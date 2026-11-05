import { Button } from './Button';
export function Pagination({ page, totalPages, onChange }: { page: number; totalPages: number; onChange(p: number): void }) {
  if (totalPages <= 1) return null;
  return (
    <nav className="pagination" aria-label="Paginação">
      <Button variant="ghost" disabled={page <= 1} onClick={() => onChange(page - 1)}>Anterior</Button>
      <span>Página {page} de {totalPages}</span>
      <Button variant="ghost" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>Próxima</Button>
    </nav>
  );
}
