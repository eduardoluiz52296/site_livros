import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { pool } from '../db';
import { User } from '../entities/User';

export class UserRepository {
  async emailInUse(email: string): Promise<boolean> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT id FROM users WHERE email = ?', [email.trim().toLowerCase()]);
    return rows.length > 0;
  }
  async cpfInUse(cpf: string): Promise<boolean> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT id FROM users WHERE cpf = ?', [cpf]);
    return rows.length > 0;
  }
  async insert(u: User): Promise<number> {
    const [r] = await pool.query<ResultSetHeader>('INSERT INTO users (name,email,cpf,password_hash) VALUES (?,?,?,?)',
      [u.name, u.email, u.cpf, u.passwordHash]);
    return r.insertId;
  }
}
