
import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.js';
import { prisma } from '../../db.js';
import { parsePaging } from '../../utils/pagination.js';

const router = Router();

router.get('/students', requireAuth('ADMIN'), async (req, res) => {
  const { page, pageSize, skip, take, orderBy } = parsePaging(req.query);
  const hostelCode = (req.query.hostelCode as string) || undefined;
  const q = (req.query.q as string) || undefined;

  const hostel = hostelCode ? await prisma.hostel.findUnique({ where: { hostelCode } }) : null;
  const where: any = {
    role: 'STUDENT',
    ...(q ? { OR: [{ email: { contains: q, mode: 'insensitive' } }] } : {}),
  };
  const users = await prisma.user.findMany({
    where,
    orderBy,
    skip,
    take,
    include: {
      studentProfile: true,
    },
  });
  const filtered = users.filter(u => (hostel ? u.studentProfile?.hostelId === hostel?.id : true));
  const total = await prisma.user.count({ where });
  res.json({ data: filtered.map(u => ({ user: { id: u.id, email: u.email, createdAt: u.createdAt }, studentProfile: u.studentProfile })), page, pageSize, total });
});

router.get('/staff', requireAuth('ADMIN'), async (req, res) => {
  const { page, pageSize, skip, take, orderBy } = parsePaging(req.query);
  const where: any = { role: 'STAFF' };
  const [data, total] = await Promise.all([
    prisma.user.findMany({ where, orderBy, skip, take, include: { staffProfile: true } }),
    prisma.user.count({ where }),
  ]);
  res.json({ data, page, pageSize, total });
});

router.get('/orders', requireAuth('ADMIN'), async (req, res) => {
  const { page, pageSize, skip, take, orderBy } = parsePaging(req.query);
  const { hostelCode, uniqueLaundryId, status, dateFrom, dateTo } = req.query as any;

  let hostelId: string | undefined;
  if (hostelCode) {
    const hostel = await prisma.hostel.findUnique({ where: { hostelCode } });
    hostelId = hostel?.id;
  }

  const where: any = {
    ...(status ? { orderStatus: status } : {}),
    ...(dateFrom || dateTo ? { orderDate: { gte: dateFrom ? new Date(dateFrom) : undefined, lte: dateTo ? new Date(dateTo) : undefined } } : {}),
  };

  const orders = await prisma.order.findMany({
    where,
    orderBy,
    skip,
    take,
    include: {
      student: true, 
    },
  });


  const filtered = orders.filter(o => {
    const sp = o.student; // StudentProfile
    if (hostelId && sp.hostelId !== hostelId) return false;
    if (uniqueLaundryId && sp.uniqueLaundryId !== uniqueLaundryId) return false;
    return true;
  });
  const total = await prisma.order.count({ where });

res.json({
  data: filtered.map(o => ({
    id: o.id,
    orderCode: o.orderCode,
    orderStatus: o.orderStatus,
    orderDate: o.orderDate,
    student: o.student, // StudentProfile
  })),
  page, pageSize, total
});

});

export default router;
