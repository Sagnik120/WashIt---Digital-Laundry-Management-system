import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.js';
import { prisma } from '../../db.js';
import { z } from 'zod';

const router = Router();

router.post('/', requireAuth('ADMIN'), async (req, res) => {
  const schema = z.object({
    hostelName: z.string(),
    hostelCode: z.string(),
    status: z.enum(['ACTIVE', 'INACTIVE']),
  });

  const body = schema.parse(req.body);

  const exists = await prisma.hostel.findUnique({
    where: { hostelCode: body.hostelCode },
  });
  if (exists) return res.status(409).json({ message: 'hostelCode exists' });

  const hostel = await prisma.hostel.create({ data: body });
  res.json(hostel);
});

router.get('/', async (req, res) => {
  const parsed = z.object({ status: z.enum(['ACTIVE','INACTIVE']).optional() })
                  .safeParse(req.query);
  if (!parsed.success) return res.status(400).json({ message: 'Invalid status' });

  const where = parsed.data.status ? { status: parsed.data.status } : undefined;
  const list = await prisma.hostel.findMany({ where, orderBy: { createdAt: 'desc' } });
  res.json(list);
});

router.put('/:id', requireAuth('ADMIN'), async (req, res) => {
  const id = req.params.id;
  const schema = z.object({
    hostelName: z.string(),
    hostelCode: z.string(),
    status: z.enum(['ACTIVE', 'INACTIVE']),
  });

  const body = schema.parse(req.body);

  const found = await prisma.hostel.findUnique({ where: { id } });
  if (!found) return res.status(404).json({ message: 'Not found' });

  if (found.hostelCode !== body.hostelCode) {
    const dup = await prisma.hostel.findUnique({
      where: { hostelCode: body.hostelCode },
    });
    if (dup) return res.status(409).json({ message: 'hostelCode exists' });
  }

  const updated = await prisma.hostel.update({ where: { id }, data: body });
  res.json(updated);
});

router.delete('/:id', requireAuth('ADMIN'), async (req, res) => {
  const id = req.params.id;
  const found = await prisma.hostel.findUnique({
    where: { id },
    include: { students: true },
  });
  if (!found) return res.status(404).json({ message: 'Not found' });
  if (found.students.length)
    return res.status(409).json({ message: 'In use' });

  await prisma.hostel.delete({ where: { id } });
  res.json({ message: 'Deleted' });
});

export default router;
