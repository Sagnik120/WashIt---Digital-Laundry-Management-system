
import { Router } from 'express';
import { requireAuth, AuthedRequest } from '../../middleware/auth.js';
import { prisma } from '../../db.js';

const router = Router();

router.get('/student', requireAuth('STUDENT'), async (req: AuthedRequest, res) => {
  const orders = await prisma.order.groupBy({
    by: ['orderStatus'],
    where: { studentUserId: req.user!.id },
    _count: { orderStatus: true },
  });
  const complaints = await prisma.complaint.groupBy({
    by: ['complaintStatus'],
    where: { studentUserId: req.user!.id },
    _count: { complaintStatus: true },
  });
  const ordersObj: any = { QR_NOT_SCANNED: 0, IN_PROGRESS: 0, PENDING: 0, COMPLETED: 0 };
  orders.forEach(o => ordersObj[o.orderStatus] = o._count.orderStatus);
  const complaintsObj: any = { OPEN:0, IN_REVIEW:0, RESOLVED:0, CLOSED:0 };
  complaints.forEach(c => complaintsObj[c.complaintStatus] = c._count.complaintStatus);
  res.json({ orders: ordersObj, complaints: complaintsObj });
});

router.get('/staff', requireAuth('STAFF'), async (_req: AuthedRequest, res) => {
  const orders = await prisma.order.groupBy({ by: ['orderStatus'], where: { orderStatus: { in: ['IN_PROGRESS','PENDING'] } }, _count: { orderStatus: true } });
  const complaints = await prisma.complaint.groupBy({ by: ['complaintStatus'], where: { complaintStatus: { in: ['OPEN','IN_REVIEW','RESOLVED'] } }, _count: { complaintStatus: true } });
  const ordersObj: any = { IN_PROGRESS: 0, PENDING: 0 };
  orders.forEach(o => ordersObj[o.orderStatus] = o._count.orderStatus);
  const complaintsObj: any = { OPEN:0, IN_REVIEW:0, RESOLVED:0 };
  complaints.forEach(c => complaintsObj[c.complaintStatus] = c._count.complaintStatus);
  res.json({ orders: ordersObj, complaints: complaintsObj });
});

router.get('/admin', requireAuth('ADMIN'), async (req: AuthedRequest, res) => {
  const hostelCode = req.query.hostelCode as string | undefined;
  let hostelId: string | undefined;
  if (hostelCode) {
    const hostel = await prisma.hostel.findUnique({ where: { hostelCode } });
    hostelId = hostel?.id;
  }

  const orders = await prisma.order.groupBy({ by: ['orderStatus'], _count: { orderStatus: true } });
  const complaints = await prisma.complaint.groupBy({ by: ['complaintStatus'], _count: { complaintStatus: true } });
  const studentsByHostel = await prisma.studentProfile.groupBy({ by: ['hostelId'], _count: { hostelId: true } });

  const ordersObj: any = { QR_NOT_SCANNED:0, IN_PROGRESS:0, PENDING:0, COMPLETED:0 };
  orders.forEach(o => ordersObj[o.orderStatus] = o._count.orderStatus);
  const complaintsObj: any = { OPEN:0, IN_REVIEW:0, RESOLVED:0, CLOSED:0 };
  complaints.forEach(c => complaintsObj[c.complaintStatus] = c._count.complaintStatus);

  const hostels = await prisma.hostel.findMany({});
  const studentsByHostelOut = studentsByHostel.map(s => ({ hostelCode: hostels.find(h => h.id === s.hostelId)?.hostelCode || 'UNK', count: s._count.hostelId }));

  res.json({ ordersByStatus: ordersObj, complaintsByStatus: complaintsObj, studentsByHostel: studentsByHostelOut });
});

export default router;
