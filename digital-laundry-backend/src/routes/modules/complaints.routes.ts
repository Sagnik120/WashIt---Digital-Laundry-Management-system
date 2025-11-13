
import { Router } from 'express';
import { requireAuth, AuthedRequest } from '../../middleware/auth.js';
import { prisma } from '../../db.js';
import { z } from 'zod';

const router = Router();

router.post('/:orderId', requireAuth('STUDENT'), async (req: AuthedRequest, res) => {
  const orderId = req.params.orderId;
  const schema = z.object({ description: z.string().min(1) });
  const { description } = schema.parse(req.body);

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) return res.status(404).json({ message: 'Order not found' });
  if (order.studentUserId !== req.user!.id) return res.status(403).json({ message: 'Not owner' });
  if (order.orderStatus !== 'PENDING') return res.status(400).json({ message: 'Only for PENDING orders' });

  const complaint = await prisma.complaint.create({
    data: { orderId, studentUserId: req.user!.id, description, complaintStatus: 'OPEN' },
  });

  res.json({ id: complaint.id, orderId: complaint.orderId, complaintStatus: complaint.complaintStatus });
});

router.get('/', requireAuth('STUDENT','STAFF','ADMIN'), async (req: AuthedRequest, res) => {
  const status = req.query.status as string | undefined;
  const where: any = {};
  if (status) where.complaintStatus = status;

  if (req.user!.role === 'STUDENT') {
    where.studentUserId = req.user!.id;
  } else if (req.user!.role === 'STAFF') {
    where.complaintStatus = { in: ['OPEN','IN_REVIEW','RESOLVED'] };
  }

  const list = await prisma.complaint.findMany({ where, orderBy: { createdAt: 'desc' }, include: { images: true, order: true } });
  res.json({ data: list, page: 1, pageSize: list.length, total: list.length });
});

router.get('/:id', requireAuth('STUDENT','STAFF','ADMIN'), async (req: AuthedRequest, res) => {
  const id = req.params.id;
  const c = await prisma.complaint.findUnique({ where: { id }, include: { images: true, order: true } });
  if (!c) return res.status(404).json({ message: 'Not found' });
  if (req.user!.role === 'STUDENT' && c.studentUserId !== req.user!.id) return res.status(403).json({ message: 'Forbidden' });
  res.json(c);
});

router.post('/:id/images', requireAuth('STUDENT'), async (req: AuthedRequest, res) => {
  const id = req.params.id;
  const schema = z.object({ images: z.array(z.string().min(10)).nonempty() });
  const body = schema.parse(req.body);

  const c = await prisma.complaint.findUnique({ where: { id } });
  if (!c) return res.status(404).json({ message: 'Not found' });
  if (c.studentUserId !== req.user!.id) return res.status(403).json({ message: 'Not owner' });

  await prisma.complaintImage.createMany({ data: body.images.map(u => ({ complaintId: id, imageUrl: u })) });
  res.json({ uploaded: body.images });
});

router.post('/:id/advance', requireAuth('STAFF'), async (req: AuthedRequest, res) => {
  const id = req.params.id;
  const c = await prisma.complaint.findUnique({ where: { id } });
  if (!c) return res.status(404).json({ message: 'Not found' });

  let to: 'IN_REVIEW' | 'RESOLVED';
  if (c.complaintStatus === 'OPEN') to = 'IN_REVIEW';
  else if (c.complaintStatus === 'IN_REVIEW') to = 'RESOLVED';
  else return res.status(400).json({ message: 'Invalid transition' });

  await prisma.$transaction([
    prisma.complaint.update({ where: { id }, data: { complaintStatus: to } }),
    prisma.complaintStatusHistory.create({ data: { complaintId: id, fromStatus: c.complaintStatus, toStatus: to, changedByUserId: req.user!.id } }),
    prisma.notification.create({ data: { userId: c.studentUserId, type: 'COMPLAINT_'+to, payload: { complaintId: id } } }),
  ]);

  res.json({ id, complaintStatus: to });
});

router.post('/:id/close', requireAuth('STUDENT'), async (req: AuthedRequest, res) => {
  const id = req.params.id;
  const c = await prisma.complaint.findUnique({ where: { id } });
  if (!c) return res.status(404).json({ message: 'Not found' });
  if (c.studentUserId !== req.user!.id) return res.status(403).json({ message: 'Not owner' });
  if (c.complaintStatus !== 'RESOLVED') return res.status(400).json({ message: 'Only RESOLVED → CLOSED' });

  await prisma.$transaction([
    prisma.complaint.update({ where: { id }, data: { complaintStatus: 'CLOSED' } }),
    prisma.complaintStatusHistory.create({ data: { complaintId: id, fromStatus: 'RESOLVED', toStatus: 'CLOSED', changedByUserId: req.user!.id } }),
  ]);
  res.json({ id, complaintStatus: 'CLOSED' });
});

export default router;
