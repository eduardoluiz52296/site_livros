import { useLocation } from 'react-router-dom';
import { Alert } from '../components/Alert';

/** Destino do redirecionamento após o cadastro. O login completo está no site completo. */
export default function Login() {
  const registered = (useLocation().state as { registered?: boolean } | null)?.registered;
  return (
    <main className="auth-page"><div className="panel">
      <h1>Entrar</h1>
      {registered && <Alert kind="success">Conta criada! Entre para começar a escrever.</Alert>}
      <p className="lead">A tela de login completa faz parte do site completo.</p>
    </div></main>
  );
}
