import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'express-async-errors';
import { errorHandler } from './middleware/errorHandler.js';
import { router } from './routes/index.js';
import { setupSwagger } from './docs/swagger.js';

export const app = express();

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

setupSwagger(app);

app.use('/api', router);

app.get('/', (_req, res) => res.json({ ok: true }));

app.use((err: any, _req: any, res: any, next: any) => {
  // Zod → 400
  if (err?.name === 'ZodError') {
    return res.status(400).json({ message: 'Validation error', details: err.issues });
  }
  if (err?.code === 'P2002') {
    return res.status(409).json({ message: 'Unique constraint failed', details: err.meta });
  }
  if (err?.code === 'P2025') {
    return res.status(404).json({ message: 'Record not found', details: err.meta });
  }
  return next(err);
});


app.use(errorHandler);
