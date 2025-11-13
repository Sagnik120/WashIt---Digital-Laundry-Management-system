
import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.js';
import { prisma } from '../../db.js';
import { z } from 'zod';

const router = Router();

router.post('/', requireAuth('ADMIN'), async (req, res) => {
  const schema = z.object({ code: z.string(), staffNameHint: z.string().optional(), status: z.enum(['ACTIVE','INACTIVE']) });
  const body = schema.parse(req.body);
  const exists = await prisma.staffCode.findUnique({ where: { code: body.code } });
  if (exists) return res.status(409).json({ message: 'code exists' });
  const created = await prisma.staffCode.create({ data: { ...body, claimed: false } });
  res.json(created);
});

router.get('/', requireAuth('ADMIN'), async (req, res) => {
  const status = req.query.status as string | undefined;
  const claimed = req.query.claimed as string | undefined;
  const where: any = {};
  if (status) where.status = status;
  if (claimed !== undefined) where.claimed = claimed === 'true';
  const list = await prisma.staffCode.findMany({ where, orderBy: { createdAt: 'desc' } });
  res.json(list);
});

router.put('/:code', requireAuth('ADMIN'), async (req, res) => {
  const code = req.params.code;
  const schema = z.object({ code: z.string(), staffNameHint: z.string().optional(), status: z.enum(['ACTIVE','INACTIVE']) });
  const body = schema.parse(req.body);

  const found = await prisma.staffCode.findUnique({ where: { code } });
  if (!found) return res.status(404).json({ message: 'Not found' });

  if (code !== body.code) {
    const dup = await prisma.staffCode.findUnique({ where: { code: body.code } });
    if (dup) return res.status(409).json({ message: 'code exists' });
  }

  const updated = await prisma.staffCode.update({ where: { code }, data: { code: body.code, staffNameHint: body.staffNameHint, status: body.status } });
  res.json(updated);
});

router.delete('/:code', requireAuth('ADMIN'), async (req, res) => {
  const code = req.params.code;
  const found = await prisma.staffCode.findUnique({ where: { code } });
  if (!found) return res.status(404).json({ message: 'Not found' });
  if (found.claimed) return res.status(409).json({ message: 'In use' });
  await prisma.staffCode.delete({ where: { code } });
  res.json({ message: 'Deleted' });
});

export default router;
