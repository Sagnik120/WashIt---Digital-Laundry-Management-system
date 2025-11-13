
import { Router } from 'express';
import { requireAuth, AuthedRequest } from '../../middleware/auth.js';
import { prisma } from '../../db.js';
import { z } from 'zod';

const router = Router();

router.post('/', requireAuth('STUDENT'), async (req: AuthedRequest, res) => {
  console.log("1");
  console.log(typeof req.user!.id, 'shree')
  const schema = z.object({
    orderDate: z.string(),
    items: z.array(z.object({ itemType: z.string().min(1), quantity: z.number().int().positive(), remark: z.string().optional() })).nonempty(),
  });
  console.log("2");

  const body = schema.parse(req.body);
  console.log("3");

  const order = await prisma.order.create({
    data: {
      studentUserId: req.user!.id,
      orderCode: 'ORD-' + Math.random().toString(36).slice(2, 10).toUpperCase(),
      orderDate: new Date(body.orderDate),
      items: { create: body.items.map(it => ({ itemType: it.itemType, quantity: it.quantity, remark: it.remark })) },
    },
    include: { items: true },
  });

  const payload = `ORDER:${order.orderCode}:${order.id}`;
  await prisma.qRCode.create({ data: { orderId: order.id, qrPayload: payload } });

  res.json({ id: order.id, orderCode: order.orderCode, orderStatus: order.orderStatus, items: order.items });
});

router.get('/', requireAuth('STUDENT','STAFF','ADMIN'), async (req: AuthedRequest, res) => {
  const status = req.query.status as string | undefined;
  const where: any = {};
  if (status) where.orderStatus = status;

  if (req.user!.role === 'STUDENT') where.studentUserId = req.user!.id;

  const orders = await prisma.order.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: { items: true, qrCode: true, complaints: true },
  });
  res.json({ data: orders, page: 1, pageSize: orders.length, total: orders.length });
});

router.get('/:id', requireAuth('STUDENT','STAFF','ADMIN'), async (req: AuthedRequest, res) => {
  const id = req.params.id;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: { include: { images: true } }, qrCode: true, complaints: { include: { images: true } } },
  });
  if (!order) return res.status(404).json({ message: 'Not found' });
  if (req.user!.role === 'STUDENT' && order.studentUserId !== req.user!.id) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  res.json(order);
});

router.post('/:id/complete', requireAuth('STUDENT'), async (req: AuthedRequest, res) => {
  const id = req.params.id;
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) return res.status(404).json({ message: 'Not found' });
  if (order.studentUserId !== req.user!.id) return res.status(403).json({ message: 'Not owner' });
  if (order.orderStatus !== 'PENDING') return res.status(400).json({ message: 'Only PENDING → COMPLETED' });

  await prisma.$transaction([
    prisma.order.update({ where: { id }, data: { orderStatus: 'COMPLETED' } }),
    prisma.orderStatusHistory.create({ data: { orderId: id, fromStatus: 'PENDING', toStatus: 'COMPLETED', changedByUserId: req.user!.id } }),
  ]);

  res.json({ id, orderStatus: 'COMPLETED' });
});

router.post('/:orderId/items/:itemId/images', requireAuth('STUDENT'), async (req: AuthedRequest, res) => {
  const { orderId, itemId } = req.params;
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) return res.status(404).json({ message: 'Order not found' });
  if (order.studentUserId !== req.user!.id) return res.status(403).json({ message: 'Not owner' });

  const schema = z.object({ images: z.array(z.string().min(10)).nonempty() });
  const body = schema.parse(req.body);

  await prisma.orderItemImage.createMany({
    data: body.images.map(u => ({ orderItemId: itemId, imageUrl: u })),
  });
  res.json({ uploaded: body.images });
});

router.get('/:id/qrcode', requireAuth('STUDENT','STAFF','ADMIN'), async (req, res) => {
  const id = req.params.id;
  const qr = await prisma.qRCode.findUnique({ where: { orderId: id }, include: { order: true } });
  if (!qr) return res.status(404).json({ message: 'Not found' });
  res.json({ qrPayload: qr.qrPayload, orderCode: qr.order.orderCode });
});

export default router;
