
import { Request, Response, NextFunction } from 'express';
import { verifyJwt } from '../utils/jwt.js';
import { prisma } from '../db.js';

export type AuthedRequest = Request & { user?: { id: string, role: 'ADMIN'|'STUDENT'|'STAFF' } };

export function requireAuth(...roles: Array<'ADMIN' | 'STUDENT' | 'STAFF'>) {
  return async (req: AuthedRequest, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization || '';
      const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
      if (!token) return res.status(401).json({ message: 'Unauthorized' });
      const payload = verifyJwt(token);
      const user = await prisma.user.findUnique({ where: { id: payload.sub } });
      if (!user) return res.status(401).json({ message: 'Unauthorized' });
      if (roles.length && !roles.includes(user.role as any)) return res.status(403).json({ message: 'Forbidden' });
      req.user = { id: user.id, role: user.role as any };
      next();
    } catch (e) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  };
}
