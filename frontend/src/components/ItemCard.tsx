import { Link } from 'react-router-dom';
import { Button } from './Button';
import { ResourceConfig } from '../resources';

export type Item = Record<string, string | number | null> & { id: number };
export function ItemCard({ cfg, item, onDelete }: { cfg: ResourceConfig; item: Item; onDelete(id: number): void }) {
  const meta = cfg.metaField ? item[cfg.metaField] : null;
  const hasMeta = meta !== null && meta !== undefined && meta !== '';
  return (
    <article className="card">
      {cfg.key === 'photos' && <img src={String(item.image_url)} alt={String(item.caption)} loading="lazy" />}
      <div className="card-body">
        <h3>{String(item[cfg.titleField])}</h3>
        {(hasMeta || cfg.key === 'notes') && <p className="meta">
          {hasMeta && (cfg.key === 'opinions' ? '★'.repeat(Number(meta)) + '☆'.repeat(5 - Number(meta)) : cfg.key === 'photos' ? `Anotação #${meta}` : String(meta))}
          {cfg.key === 'notes' && <span>{hasMeta ? ' · ' : ''}#{item.id}</span>}</p>}
        {cfg.key !== 'photos' && <p className="excerpt">{String(item[cfg.bodyField])}</p>}
      </div>
      <div className="card-actions">
        <Link className="btn btn-ghost" to={`/${cfg.key}/${item.id}/editar`}>Editar</Link>
        <Button variant="danger" onClick={() => onDelete(item.id)}>Excluir</Button>
      </div>
    </article>
  );
}
