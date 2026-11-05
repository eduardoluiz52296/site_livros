import { FormEvent, useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { api, ApiError } from '../api';
import { Alert } from '../components/Alert';
import { Button } from '../components/Button';
import { Field } from '../components/Field';
import { RESOURCES } from '../resources';

export default function ResourceForm() {
  const { resource = '', id } = useParams();
  const cfg = RESOURCES[resource];
  const navigate = useNavigate();
  const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({}); const [apiError, setApiError] = useState('');
  useEffect(() => {
    if (!cfg || !id) { setValues({}); return; }
    api<Record<string, string | number | null>>(`/${cfg.key}/${id}`)
      .then(r => setValues(Object.fromEntries(cfg.fields.map(f => [f.name, r[f.name] == null ? '' : String(r[f.name])]))))
      .catch(e => setApiError(e instanceof ApiError ? e.message : 'Erro ao carregar'));
  }, [cfg, id]);
  if (!cfg) return <Navigate to="/" replace />;

  async function submit(e: FormEvent) {
    e.preventDefault(); setApiError('');
    const errs: Record<string, string> = {};
    for (const f of cfg.fields) if (f.required && !(values[f.name] ?? '').trim()) errs[f.name] = `${f.label} é obrigatório`;
    if (cfg.key === 'opinions' && !errs.rating && (Number(values.rating) < 1 || Number(values.rating) > 5)) errs.rating = 'Use uma nota de 1 a 5';
    setErrors(errs); if (Object.keys(errs).length) return;
    try {
      await api(`/${cfg.key}${id ? `/${id}` : ''}`, { method: id ? 'PUT' : 'POST', body: values });
      navigate(`/${cfg.key}`);
    } catch (err) { setApiError(err instanceof ApiError ? err.message : 'Erro inesperado'); }
  }
  return (
    <main className="auth-page"><form className="panel wide" onSubmit={submit} noValidate>
      <h1>{id ? 'Editar' : 'Nova'} {cfg.singular}</h1>
      {apiError && <Alert kind="error">{apiError}</Alert>}
      {cfg.fields.map(f => (
        <Field key={f.name} label={f.label} name={f.name} value={values[f.name] ?? ''} required={f.required} hint={f.hint}
          textarea={f.kind === 'textarea'} type={f.kind === 'number' ? 'number' : f.kind === 'url' ? 'url' : 'text'}
          error={errors[f.name]} onChange={v => setValues(s => ({ ...s, [f.name]: v }))} />))}
      <div className="form-actions"><Button type="submit">Salvar {cfg.singular}</Button><Button type="button" variant="ghost" onClick={() => navigate(`/${cfg.key}`)}>Cancelar</Button></div>
    </form></main>
  );
}
