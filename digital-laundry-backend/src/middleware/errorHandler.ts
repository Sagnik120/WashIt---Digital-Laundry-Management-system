import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  console.error(err);
  if (err?.status && err?.message) {
    return res.status(err.status).json({ message: err.message, code: err.code, details: err.details });
  }
  return res.status(500).json({ message: 'Internal Server Error' });
}
