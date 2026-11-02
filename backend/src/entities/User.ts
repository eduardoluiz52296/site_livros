import bcrypt from 'bcryptjs';
import { ValidationError } from '../errors';
import { isCpf, isEmail, onlyDigits, passwordProblems } from '../validators';

export interface UserProps { id?: number; name: string; email: string; cpf: string; passwordHash: string; }
export interface NewUserInput { name: string; email: string; cpf: string; password: string; }

/** Entidade com estado protegido (#campos): só muda por setters/métodos que validam. */
export class User {
  #id?: number;
  #name = '';
  readonly #email: string;
  #cpf = '';
  #passwordHash: string;

  constructor(p: UserProps) {
    this.#id = p.id;
    this.name = p.name;
    if (!isEmail(p.email ?? '')) throw new ValidationError('E-mail inválido');
    this.#email = p.email.trim().toLowerCase(); // sem setter: e-mail é imutável
    this.cpf = p.cpf;
    this.#passwordHash = p.passwordHash;
  }

  static async create(i: NewUserInput): Promise<User> {
    const u = new User({ ...i, passwordHash: '' });
    u.#passwordHash = await User.hash(i.password);
    return u;
  }
  private static async hash(password: string): Promise<string> {
    const problems = passwordProblems(password);
    if (problems.length) throw new ValidationError(`Senha fraca. Falta: ${problems.join(', ')}`);
    return bcrypt.hash(password, 10);
  }

  get id(): number | undefined { return this.#id; }
  get email(): string { return this.#email; }
  get name(): string { return this.#name; }
  set name(v: string) {
    if (!v || v.trim().length < 2) throw new ValidationError('Nome obrigatório (mínimo 2 letras)');
    this.#name = v.trim();
  }
  get cpf(): string { return this.#cpf; }
  set cpf(v: string) {
    if (!isCpf(v ?? '')) throw new ValidationError('CPF inválido');
    this.#cpf = onlyDigits(v);
  }
  get passwordHash(): string { return this.#passwordHash; }
  async changePassword(newPassword: string): Promise<void> { this.#passwordHash = await User.hash(newPassword); }
  verifyPassword(password: string): Promise<boolean> { return bcrypt.compare(password, this.#passwordHash); }
  toJSON() { return { id: this.#id, name: this.#name, email: this.#email, cpf: this.#cpf }; }
}
