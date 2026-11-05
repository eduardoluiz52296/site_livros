import { NextFunction, Request, Response, Router } from 'express';
import { User } from '../entities/User';
import { ConflictError, UnauthorizedError, ValidationError } from '../errors';
import { AuthedRequest, requireAuth, signToken } from '../middlewares/auth';
import { UserRepository } from '../repositories/UserRepository';
import { isEmail, onlyDigits } from '../validators';

const repo = new UserRepository();
const h = (fn: (req: Request, res: Response) => Promise<void>) =>
  (q: Request, s: Response, n: NextFunction) => { fn(q, s).catch(n); };
const required = (b: Record<string, unknown>, keys: string[]): void => {
  for (const k of keys) if (!b?.[k] || String(b[k]).trim() === '') throw new ValidationError(`Campo obrigatório: ${k}`);
};
export const authRouter = Router();

authRouter.post('/auth/register', h(async (req, res) => {
  required(req.body, ['name', 'email', 'password', 'cpf']);
  const { name, email, password, cpf } = req.body;
  if (!isEmail(email)) throw new ValidationError('E-mail inválido');
  if (await repo.findByEmail(email)) throw new ConflictError('E-mail já cadastrado');
  const user = await User.create({ name, email, cpf, password }); // valida nome, CPF e nível da senha
  if (await repo.cpfInUse(user.cpf)) throw new ConflictError('CPF já cadastrado');
  const id = await repo.insert(user);
  res.status(201).json({ id, name: user.name, email: user.email });
}));

authRouter.post('/auth/login', h(async (req, res) => {
  required(req.body, ['email', 'password']);
  if (!isEmail(req.body.email)) throw new ValidationError('E-mail inválido');
  const user = await repo.findByEmail(req.body.email);
  if (!user || !(await user.verifyPassword(req.body.password))) throw new UnauthorizedError('E-mail ou senha incorretos');
  res.json({ token: signToken(user.id as number), user });
}));

authRouter.get('/users/me', requireAuth, h(async (req, res) => {
  const user = await repo.findById((req as AuthedRequest).userId);
  if (!user) throw new UnauthorizedError();
  res.json(user);
}));

authRouter.put('/users/me', requireAuth, h(async (req, res) => {
  const id = (req as AuthedRequest).userId;
  const user = await repo.findById(id);
  if (!user) throw new UnauthorizedError();
  required(req.body, ['name', 'cpf', 'password']);
  if (req.body.email && String(req.body.email).trim().toLowerCase() !== user.email) throw new ValidationError('O e-mail não pode ser alterado');
  user.name = req.body.name;
  user.cpf = req.body.cpf;
  if (await repo.cpfInUse(onlyDigits(req.body.cpf), id)) throw new ConflictError('CPF já cadastrado');
  await user.changePassword(req.body.password);
  await repo.update(user);
  res.json(user);
}));
