import { useCallback, useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { api, ApiError } from '../api';
import { Alert } from '../components/Alert';
import { Item, ItemCard } from '../components/ItemCard';
import { Pagination } from '../components/Pagination';
import { RESOURCES } from '../resources';

interface Page { data: Item[]; page: number; totalPages: number; total: number; }
export default function ResourceList() {
  const { resource = '' } = useParams();
  const cfg = RESOURCES[resource];
  const [page, setPage] = useState(1); const [result, setResult] = useState<Page | null>(null); const [error, setError] = useState('');
  const load = useCallback(() => {
    if (!cfg) return;
    setError('');
    api<Page>(`/${cfg.key}?page=${page}&limit=6`).then(setResult).catch(e => setError(e instanceof ApiError ? e.message : 'Erro ao carregar'));
  }, [cfg, page]);
  useEffect(() => { setPage(1); setResult(null); }, [resource]);
  useEffect(load, [load]);
  if (!cfg) return <Navigate to="/" replace />;
  async function remove(id: number) {
    if (!window.confirm(`Excluir esta ${cfg.singular}?`)) return;
    try {
      await api(`/${cfg.key}/${id}`, { method: 'DELETE' });
      if (result && result.data.length === 1 && page > 1) setPage(page - 1); else load();
    } catch (e) { setError(e instanceof ApiError ? e.message : 'Erro ao excluir'); }
  }
  return (
    <main className="list-page">
      <div className="list-head"><h1>{cfg.plural}</h1><Link className="btn btn-primary" to={`/${cfg.key}/nova`}>Nova {cfg.singular}</Link></div>
      {error && <Alert kind="error">{error}</Alert>}
      {result && result.data.length === 0 && <p className="empty">{cfg.emptyText}</p>}
      <div className="cards">
        {result?.data.map(item => <ItemCard key={item.id} cfg={cfg} item={item} onDelete={remove} />)}
      </div>
      {result && <Pagination page={page} totalPages={result.totalPages} onChange={setPage} />}
    </main>
  );
}
