import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
  host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME, waitForConnections: true, connectionLimit: 10,
});

export async function initSchema(): Promise<void> {
  for (let attempt = 1; attempt <= 30; attempt++) {
    try {
      await pool.query(`CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(120) NOT NULL,
        email VARCHAR(160) NOT NULL UNIQUE, cpf CHAR(11) NOT NULL UNIQUE, password_hash VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
      return;
    } catch { console.log(`Aguardando MySQL (${attempt}/30)...`); await new Promise(r => setTimeout(r, 2000)); }
  }
  throw new Error('MySQL indisponível');
}
