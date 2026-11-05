import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { RESOURCES } from '../resources';

export function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  return (
    <header className="navbar">
      <NavLink to="/" className="brand">Página Viva</NavLink>
      {user ? (
        <nav>
          {Object.values(RESOURCES).map(r => <NavLink key={r.key} to={`/${r.key}`}>{r.plural}</NavLink>)}
          <NavLink to="/perfil">{user.name.split(' ')[0]}</NavLink>
          <button className="linklike" onClick={() => { signOut(); navigate('/login'); }}>Sair</button>
        </nav>
      ) : (<nav><NavLink to="/login">Entrar</NavLink><NavLink to="/cadastro">Criar conta</NavLink></nav>)}
    </header>
  );
}
