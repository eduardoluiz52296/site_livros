import cors from 'cors';
import express from 'express';
import { initSchema } from './db';
import { errorHandler } from './middlewares/errorHandler';
import { authRouter } from './routes/auth';
import { crudRouter } from './routes/crud';
import { RESOURCES } from './routes/resources';

async function main(): Promise<void> {
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET não configurado');
  await initSchema();
  const app = express();
  app.use(cors(), express.json({ limit: '1mb' }));
  app.use('/api', authRouter);
  for (const [path, def] of Object.entries(RESOURCES)) app.use(`/api/${path}`, crudRouter(def));
  app.use(errorHandler);
  app.listen(3000, () => console.log('API na porta 3000'));
}
main().catch(e => { console.error(e); process.exit(1); });
