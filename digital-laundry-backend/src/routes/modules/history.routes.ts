
import { Router } from 'express';
import { requireAuth, AuthedRequest } from '../../middleware/auth.js';
import { prisma } from '../../db.js';

const router = Router();

router.get('/orders/:id/history', requireAuth('ADMIN','STUDENT','STAFF'), async (req: AuthedRequest, res) => {
  const id = req.params.id;
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) return res.status(404).json({ message: 'Not found' });
  if (req.user!.role === 'STUDENT' && order.studentUserId !== req.user!.id) return res.status(403).json({ message: 'Forbidden' });
  const hist = await prisma.orderStatusHistory.findMany({ where: { orderId: id }, orderBy: { changedAt: 'asc' } });
  res.json(hist.map(h => ({ from: h.fromStatus, to: h.toStatus, changedBy: h.changedByUserId, changedAt: h.changedAt, note: h.note || '' })));
});

router.get('/complaints/:id/history', requireAuth('ADMIN','STUDENT','STAFF'), async (req: AuthedRequest, res) => {
  const id = req.params.id;
  const c = await prisma.complaint.findUnique({ where: { id } });
  if (!c) return res.status(404).json({ message: 'Not found' });
  if (req.user!.role === 'STUDENT' && c.studentUserId !== req.user!.id) return res.status(403).json({ message: 'Forbidden' });
  const hist = await prisma.complaintStatusHistory.findMany({ where: { complaintId: id }, orderBy: { changedAt: 'asc' } });
  res.json(hist.map(h => ({ from: h.fromStatus, to: h.toStatus, changedBy: h.changedByUserId, changedAt: h.changedAt, note: h.note || '' })));
});

export default router;
