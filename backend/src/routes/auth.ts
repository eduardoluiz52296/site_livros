import { NextFunction, Request, Response, Router } from 'express';
import { User } from '../entities/User';
import { ConflictError, ValidationError } from '../errors';
import { UserRepository } from '../repositories/UserRepository';
import { isEmail } from '../validators';

const repo = new UserRepository();
export const authRouter = Router();

authRouter.post('/auth/register', (req: Request, res: Response, next: NextFunction) => {
  (async () => {
    for (const k of ['name', 'email', 'password', 'cpf'])
      if (!req.body?.[k] || String(req.body[k]).trim() === '') throw new ValidationError(`Campo obrigatório: ${k}`);
    const { name, email, password, cpf } = req.body;
    if (!isEmail(email)) throw new ValidationError('E-mail inválido');
    if (await repo.emailInUse(email)) throw new ConflictError('E-mail já cadastrado');
    const user = await User.create({ name, email, cpf, password }); // valida nome, CPF e nível da senha
    if (await repo.cpfInUse(user.cpf)) throw new ConflictError('CPF já cadastrado');
    const id = await repo.insert(user);
    res.status(201).json({ id, name: user.name, email: user.email });
  })().catch(next);
});
