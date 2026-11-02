export class AppError extends Error {
  constructor(message: string, public readonly status: number = 400) {
    super(message);
    this.name = new.target.name;
  }
}
export class ValidationError extends AppError { constructor(m: string) { super(m, 422); } }
export class UnauthorizedError extends AppError { constructor(m = 'Não autorizado') { super(m, 401); } }
export class ForbiddenError extends AppError { constructor(m = 'Acesso negado') { super(m, 403); } }
export class NotFoundError extends AppError { constructor(m = 'Registro não encontrado') { super(m, 404); } }
export class ConflictError extends AppError { constructor(m: string) { super(m, 409); } }
