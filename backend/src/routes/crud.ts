import { NextFunction, Request, RequestHandler, Response, Router } from 'express';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { pool } from '../db';
import { NotFoundError, ValidationError } from '../errors';
import { AuthedRequest, requireAuth } from '../middlewares/auth';

export interface FieldDef { name: string; label: string; required: boolean; type?: 'text' | 'number'; min?: number; max?: number; }
export interface ResourceDef {
  table: string; fields: FieldDef[];
  /** Relacionamento opcional: o campo precisa apontar para um registro do mesmo usuário na tabela indicada. */
  relation?: { field: string; table: string };
}
type Handler = (req: AuthedRequest, res: Response) => Promise<void>;
const wrap = (fn: Handler): RequestHandler =>
  (req: Request, res: Response, next: NextFunction) => { fn(req as AuthedRequest, res).catch(next); };

export function crudRouter(def: ResourceDef): Router {
  const router = Router();
  router.use(requireAuth);
  const cols = def.fields.map(f => f.name);

  async function parse(req: AuthedRequest): Promise<unknown[]> {
    const values: unknown[] = [];
    for (const f of def.fields) {
      let v: unknown = req.body?.[f.name];
      if (v === undefined || v === null || String(v).trim() === '') {
        if (f.required) throw new ValidationError(`${f.label} é obrigatório`);
        values.push(null); continue;
      }
      if (f.type === 'number') {
        v = Number(v);
        const n = v as number;
        if (Number.isNaN(n) || (f.min !== undefined && n < f.min) || (f.max !== undefined && n > f.max))
          throw new ValidationError(`${f.label} inválido (entre ${f.min} e ${f.max})`);
      } else v = String(v).trim();
      values.push(v);
    }
    const rel = def.relation;
    if (rel && req.body?.[rel.field]) {
      const [r] = await pool.query<RowDataPacket[]>(`SELECT id FROM ${rel.table} WHERE id=? AND user_id=?`, [req.body[rel.field], req.userId]);
      if (!r.length) throw new ValidationError('O registro relacionado não existe');
    }
    return values;
  }
  async function mustExist(id: number, userId: number): Promise<RowDataPacket> {
    const [rows] = await pool.query<RowDataPacket[]>(`SELECT * FROM ${def.table} WHERE id=? AND user_id=?`, [id, userId]);
    if (!rows[0]) throw new NotFoundError();
    return rows[0];
  }

  router.get('/', wrap(async (req, res) => {
    const limit = Math.min(Math.max(Number(req.query.limit) || 6, 1), 50);
    const page = Math.max(Number(req.query.page) || 1, 1);
    const [count] = await pool.query<RowDataPacket[]>(`SELECT COUNT(*) AS total FROM ${def.table} WHERE user_id=?`, [req.userId]);
    const total = Number(count[0].total);
    const [rows] = await pool.query(`SELECT * FROM ${def.table} WHERE user_id=? ORDER BY id DESC LIMIT ? OFFSET ?`,
      [req.userId, limit, (page - 1) * limit]);
    res.json({ data: rows, page, limit, total, totalPages: Math.max(Math.ceil(total / limit), 1) });
  }));
  router.get('/:id', wrap(async (req, res) => { res.json(await mustExist(Number(req.params.id), req.userId)); }));
  router.post('/', wrap(async (req, res) => {
    const values = await parse(req);
    const [r] = await pool.query<ResultSetHeader>(
      `INSERT INTO ${def.table} (user_id,${cols.join(',')}) VALUES (?${',?'.repeat(cols.length)})`, [req.userId, ...values]);
    res.status(201).json(await mustExist(r.insertId, req.userId));
  }));
  router.put('/:id', wrap(async (req, res) => {
    const id = Number(req.params.id);
    await mustExist(id, req.userId);
    const values = await parse(req);
    await pool.query(`UPDATE ${def.table} SET ${cols.map(c => `${c}=?`).join(',')} WHERE id=? AND user_id=?`, [...values, id, req.userId]);
    res.json(await mustExist(id, req.userId));
  }));
  router.delete('/:id', wrap(async (req, res) => {
    const id = Number(req.params.id);
    await mustExist(id, req.userId);
    await pool.query(`DELETE FROM ${def.table} WHERE id=? AND user_id=?`, [id, req.userId]);
    res.status(204).end();
  }));
  return router;
}
