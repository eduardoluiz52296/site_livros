import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { pool } from '../db';
import { User } from '../entities/User';

const toUser = (r: RowDataPacket): User =>
  new User({ id: r.id, name: r.name, email: r.email, cpf: r.cpf, passwordHash: r.password_hash });

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM users WHERE email = ?', [email.trim().toLowerCase()]);
    return rows[0] ? toUser(rows[0]) : null;
  }
  async findById(id: number): Promise<User | null> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0] ? toUser(rows[0]) : null;
  }
  async cpfInUse(cpf: string, exceptId = 0): Promise<boolean> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT id FROM users WHERE cpf = ? AND id <> ?', [cpf, exceptId]);
    return rows.length > 0;
  }
  async insert(u: User): Promise<number> {
    const [r] = await pool.query<ResultSetHeader>('INSERT INTO users (name,email,cpf,password_hash) VALUES (?,?,?,?)',
      [u.name, u.email, u.cpf, u.passwordHash]);
    return r.insertId;
  }
  async update(u: User): Promise<void> {
    await pool.query('UPDATE users SET name=?, cpf=?, password_hash=? WHERE id=?', [u.name, u.cpf, u.passwordHash, u.id]);
  }
}
