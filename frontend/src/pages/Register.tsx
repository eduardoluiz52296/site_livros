import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, ApiError } from '../api';
import { Alert } from '../components/Alert';
import { Button } from '../components/Button';
import { Field } from '../components/Field';
import { isCpf, isEmail, passwordProblems } from '../validators';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', cpf: '', password: '', confirm: '' });
  const [errors, setErrors] = useState<Record<string, string>>({}); const [apiError, setApiError] = useState(''); const [busy, setBusy] = useState(false);
  const set = (k: keyof typeof form) => (v: string) => setForm(f => ({ ...f, [k]: v }));

  function validate(): Record<string, string> {
    const e: Record<string, string> = {};
    if (form.name.trim().length < 2) e.name = 'Digite seu nome';
    if (!isEmail(form.email)) e.email = 'Digite um e-mail válido, como nome@exemplo.com';
    if (!isCpf(form.cpf)) e.cpf = 'CPF inválido. Confira os 11 números';
    const p = passwordProblems(form.password);
    if (p.length) e.password = `Senha fraca. Falta: ${p.join(', ')}`;
    if (form.confirm !== form.password) e.confirm = 'As senhas não são iguais';
    return e;
  }
  async function submit(ev: FormEvent) {
    ev.preventDefault(); setApiError('');
    const errs = validate(); setErrors(errs); if (Object.keys(errs).length) return;
    setBusy(true);
    try {
      await api('/auth/register', { method: 'POST', body: { name: form.name, email: form.email, cpf: form.cpf, password: form.password } });
      navigate('/login', { state: { registered: true } });
    } catch (err) { setApiError(err instanceof ApiError ? err.message : 'Erro inesperado'); } finally { setBusy(false); }
  }
  return (
    <main className="auth-page"><form className="panel" onSubmit={submit} noValidate>
      <h1>Crie sua conta</h1>
      <p className="lead">Um lugar calmo para guardar o que você lê e o que você imagina.</p>
      {apiError && <Alert kind="error">{apiError}</Alert>}
      <Field label="Nome" name="name" value={form.name} onChange={set('name')} error={errors.name} autoComplete="name" required />
      <Field label="E-mail" name="email" type="email" value={form.email} onChange={set('email')} error={errors.email} autoComplete="email" required />
      <Field label="CPF" name="cpf" value={form.cpf} onChange={set('cpf')} error={errors.cpf} hint="Somente números ou com pontos e traço" required />
      <Field label="Senha" name="password" type="password" value={form.password} onChange={set('password')} error={errors.password} hint="8+ caracteres com maiúscula, minúscula, número e símbolo" autoComplete="new-password" required />
      <Field label="Confirme a senha" name="confirm" type="password" value={form.confirm} onChange={set('confirm')} error={errors.confirm} autoComplete="new-password" required />
      <Button type="submit" disabled={busy}>{busy ? 'Criando...' : 'Criar conta'}</Button>
      <p className="switch">Já tem conta? <Link to="/login">Entrar</Link></p>
    </form></main>
  );
}
