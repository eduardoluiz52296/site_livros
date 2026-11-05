import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../errors';

export interface AuthedRequest extends Request { userId: number; }
const SECRET = process.env.JWT_SECRET ?? '';

export const signToken = (userId: number): string => jwt.sign({ sub: String(userId) }, SECRET, { expiresIn: '7d' });

export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const h = req.headers.authorization;
  if (!h?.startsWith('Bearer ')) return next(new UnauthorizedError('Token ausente'));
  try {
    (req as AuthedRequest).userId = Number((jwt.verify(h.slice(7), SECRET) as jwt.JwtPayload).sub);
    next();
  } catch { next(new UnauthorizedError('Token inválido ou expirado')); }
}
