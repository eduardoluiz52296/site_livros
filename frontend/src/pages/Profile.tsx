import { FormEvent, useState } from 'react';
import { api, ApiError } from '../api';
import { Alert } from '../components/Alert';
import { Button } from '../components/Button';
import { Field } from '../components/Field';
import { useAuth, UserInfo } from '../context/AuthContext';
import { isCpf, passwordProblems } from '../validators';

export default function Profile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name ?? '', cpf: user?.cpf ?? '', password: '', confirm: '' });
  const [errors, setErrors] = useState<Record<string, string>>({}); const [msg, setMsg] = useState(''); const [apiError, setApiError] = useState('');
  const set = (k: keyof typeof form) => (v: string) => setForm(f => ({ ...f, [k]: v }));
  async function submit(e: FormEvent) {
    e.preventDefault(); setMsg(''); setApiError('');
    const errs: Record<string, string> = {};
    if (form.name.trim().length < 2) errs.name = 'Digite seu nome';
    if (!isCpf(form.cpf)) errs.cpf = 'CPF inválido';
    const p = passwordProblems(form.password);
    if (p.length) errs.password = `Senha fraca. Falta: ${p.join(', ')}`;
    if (form.confirm !== form.password) errs.confirm = 'As senhas não são iguais';
    setErrors(errs); if (Object.keys(errs).length) return;
    try {
      const u = await api<UserInfo>('/users/me', { method: 'PUT', body: { name: form.name, cpf: form.cpf, password: form.password } });
      setUser(u); setMsg('Perfil atualizado.'); setForm(f => ({ ...f, password: '', confirm: '' }));
    } catch (err) { setApiError(err instanceof ApiError ? err.message : 'Erro inesperado'); }
  }
  return (
    <main className="auth-page"><form className="panel" onSubmit={submit} noValidate>
      <h1>Seu perfil</h1>
      {msg && <Alert kind="success">{msg}</Alert>}{apiError && <Alert kind="error">{apiError}</Alert>}
      <Field label="E-mail" name="email" value={user?.email ?? ''} onChange={() => undefined} disabled hint="O e-mail não pode ser alterado" />
      <Field label="Nome" name="name" value={form.name} onChange={set('name')} error={errors.name} required />
      <Field label="CPF" name="cpf" value={form.cpf} onChange={set('cpf')} error={errors.cpf} required />
      <Field label="Nova senha" name="password" type="password" value={form.password} onChange={set('password')} error={errors.password} autoComplete="new-password" required />
      <Field label="Confirme a senha" name="confirm" type="password" value={form.confirm} onChange={set('confirm')} error={errors.confirm} autoComplete="new-password" required />
      <Button type="submit">Salvar alterações</Button>
    </form></main>
  );
}
