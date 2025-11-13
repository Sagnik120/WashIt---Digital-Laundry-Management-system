
import { Router } from 'express';
import { requireAuth, AuthedRequest } from '../../middleware/auth.js';
import { prisma } from '../../db.js';

const router = Router();

router.post('/scan', requireAuth('STAFF'), async (req: AuthedRequest, res) => {
  const { qrPayload } = req.body as { qrPayload: string };
  const qr = await prisma.qRCode.findUnique({ where: { qrPayload } });
  if (!qr) return res.status(404).json({ message: 'QR not found' });
  if (qr.scannedAt) return res.status(400).json({ message: 'Already scanned' });

  const order = await prisma.order.findUnique({ where: { id: qr.orderId } });
  if (!order) return res.status(404).json({ message: 'Order not found' });

  await prisma.$transaction([
    prisma.qRCode.update({ where: { qrPayload }, data: { scannedAt: new Date(), scannedByStaffUserId: req.user!.id } }),
    prisma.order.update({ where: { id: order.id }, data: { orderStatus: 'IN_PROGRESS' } }),
    prisma.orderStatusHistory.create({ data: { orderId: order.id, fromStatus: 'QR_NOT_SCANNED', toStatus: 'IN_PROGRESS', changedByUserId: req.user!.id } }),
  ]);

  res.json({ id: order.id, orderStatus: 'IN_PROGRESS' });
});

router.post('/mark-pending/:orderId', requireAuth('STAFF'), async (req: AuthedRequest, res) => {
  const id = req.params.orderId;
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) return res.status(404).json({ message: 'Order not found' });
  if (order.orderStatus !== 'IN_PROGRESS') return res.status(400).json({ message: 'Only IN_PROGRESS → PENDING' });

  await prisma.$transaction([
    prisma.order.update({ where: { id }, data: { orderStatus: 'PENDING' } }),
    prisma.orderStatusHistory.create({ data: { orderId: id, fromStatus: 'IN_PROGRESS', toStatus: 'PENDING', changedByUserId: req.user!.id } }),
    prisma.notification.create({ data: { userId: order.studentUserId, type: 'ORDER_PENDING', payload: { orderId: id } } }),
  ]);

  res.json({ id, orderStatus: 'PENDING' });
});

export default router;
