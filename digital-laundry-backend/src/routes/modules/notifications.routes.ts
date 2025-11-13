
import { Router } from 'express';
import { requireAuth, AuthedRequest } from '../../middleware/auth.js';
import { prisma } from '../../db.js';

const router = Router();

router.get('/', requireAuth('ADMIN','STUDENT','STAFF'), async (req: AuthedRequest, res) => {
  const list = await prisma.notification.findMany({ where: { userId: req.user!.id }, orderBy: { createdAt: 'desc' } });
  res.json(list);
});

router.post('/:id/read', requireAuth('ADMIN','STUDENT','STAFF'), async (req: AuthedRequest, res) => {
  const id = req.params.id;
  const n = await prisma.notification.findUnique({ where: { id } });
  if (!n || n.userId !== req.user!.id) return res.status(404).json({ message: 'Not found or not owner' });
  const upd = await prisma.notification.update({ where: { id }, data: { isRead: true, readAt: new Date() } });
  res.json({ id: upd.id, isRead: upd.isRead, readAt: upd.readAt });
});

export default router;
