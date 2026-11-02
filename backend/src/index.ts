import cors from 'cors';
import express from 'express';
import { initSchema } from './db';
import { errorHandler } from './middlewares/errorHandler';
import { authRouter } from './routes/auth';

async function main(): Promise<void> {
  await initSchema();
  const app = express();
  app.use(cors(), express.json());
  app.use('/api', authRouter);
  app.use(errorHandler);
  app.listen(3000, () => console.log('API na porta 3000'));
}
main().catch(e => { console.error(e); process.exit(1); });
