import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
  host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME, waitForConnections: true, connectionLimit: 10,
});

const TABLES = [
  `CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(120) NOT NULL,
    email VARCHAR(160) NOT NULL UNIQUE, cpf CHAR(11) NOT NULL UNIQUE, password_hash VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`,
  `CREATE TABLE IF NOT EXISTS notes (id INT AUTO_INCREMENT PRIMARY KEY, user_id INT NOT NULL, book_title VARCHAR(160) NOT NULL,
    author VARCHAR(120), chapter VARCHAR(80), content TEXT NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE)`,
  `CREATE TABLE IF NOT EXISTS opinions (id INT AUTO_INCREMENT PRIMARY KEY, user_id INT NOT NULL, book_title VARCHAR(160) NOT NULL,
    rating TINYINT NOT NULL, content TEXT NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE)`,
  `CREATE TABLE IF NOT EXISTS photos (id INT AUTO_INCREMENT PRIMARY KEY, user_id INT NOT NULL, caption VARCHAR(200) NOT NULL,
    image_url TEXT NOT NULL, note_id INT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE, FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE SET NULL)`,
  `CREATE TABLE IF NOT EXISTS ideas (id INT AUTO_INCREMENT PRIMARY KEY, user_id INT NOT NULL, title VARCHAR(160) NOT NULL,
    genre VARCHAR(80), description TEXT NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE)`,
];

export async function initSchema(): Promise<void> {
  for (let attempt = 1; attempt <= 30; attempt++) {
    try { for (const sql of TABLES) await pool.query(sql); return; }
    catch { console.log(`Aguardando MySQL (${attempt}/30)...`); await new Promise(r => setTimeout(r, 2000)); }
  }
  throw new Error('MySQL indisponível');
}
