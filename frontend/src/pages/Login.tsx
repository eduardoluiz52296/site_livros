import { FormEvent, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { api, ApiError } from '../api';
import { Alert } from '../components/Alert';
import { Button } from '../components/Button';
import { Field } from '../components/Field';
import { useAuth, UserInfo } from '../context/AuthContext';
import { isEmail } from '../validators';

export default function Login() {
  const { user, signIn } = useAuth();
  const navigate = useNavigate();
  const justRegistered = (useLocation().state as { registered?: boolean } | null)?.registered;
  const [email, setEmail] = useState(''); const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({}); const [apiError, setApiError] = useState(''); const [busy, setBusy] = useState(false);
  if (user) return <Navigate to="/" replace />;

  async function submit(e: FormEvent) {
    e.preventDefault(); setApiError('');
    const errs: Record<string, string> = {};
    if (!isEmail(email)) errs.email = 'Digite um e-mail válido, como nome@exemplo.com';
    if (!password) errs.password = 'Digite sua senha';
    setErrors(errs); if (Object.keys(errs).length) return;
    setBusy(true);
    try {
      const r = await api<{ token: string; user: UserInfo }>('/auth/login', { method: 'POST', body: { email, password } });
      signIn(r.token, r.user); navigate('/');
    } catch (err) { setApiError(err instanceof ApiError ? err.message : 'Erro inesperado'); } finally { setBusy(false); }
  }
  return (
    <main className="auth-page"><form className="panel" onSubmit={submit} noValidate>
      <h1>Bem-vindo de volta</h1>
      {justRegistered && <Alert kind="success">Conta criada! Entre para começar a escrever.</Alert>}
      {apiError && <Alert kind="error">{apiError}</Alert>}
      <Field label="E-mail" name="email" type="email" value={email} onChange={setEmail} error={errors.email} autoComplete="email" required />
      <Field label="Senha" name="password" type="password" value={password} onChange={setPassword} error={errors.password} autoComplete="current-password" required />
      <Button type="submit" disabled={busy}>{busy ? 'Entrando...' : 'Entrar'}</Button>
      <p className="switch">Ainda não tem conta? <Link to="/cadastro">Criar conta</Link></p>
    </form></main>
  );
}
