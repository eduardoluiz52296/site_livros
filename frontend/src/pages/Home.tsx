import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { RESOURCES } from '../resources';

const BLURB: Record<string, string> = {
  notes: 'Trechos, páginas e reflexões de cada leitura.', opinions: 'O que você achou, com nota de 1 a 5.',
  photos: 'Cantinhos de leitura, estantes e páginas marcadas.', ideas: 'Enredos, personagens e livros que ainda vão existir.' };
export default function Home() {
  const { user } = useAuth();
  return (
    <main className="home">
      <section className="hero">
        <h1>{user ? `Olá, ${user.name.split(' ')[0]}. O que você leu hoje?` : 'Seu caderno de leituras e ideias'}</h1>
        <p>Anotações, opiniões, fotos e ideias de livros em um só lugar, feito para quem lê e para quem escreve.</p>
        {!user && <div className="hero-actions"><Link className="btn btn-primary" to="/cadastro">Criar conta</Link><Link className="btn btn-ghost" to="/login">Entrar</Link></div>}
      </section>
      <section className="grid">
        {Object.values(RESOURCES).map(r => (
          <Link key={r.key} to={user ? `/${r.key}` : '/login'} className="tile"><h2>{r.plural}</h2><p>{BLURB[r.key]}</p></Link>))}
      </section>
    </main>
  );
}
