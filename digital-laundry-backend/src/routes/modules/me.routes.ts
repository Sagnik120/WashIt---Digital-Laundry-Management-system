
import { Router } from 'express';
import { requireAuth, AuthedRequest } from '../../middleware/auth.js';
import { prisma } from '../../db.js';
import { z } from 'zod';

const router = Router();

router.get('/', requireAuth('ADMIN','STUDENT','STAFF'), async (req: AuthedRequest, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    include: {
      studentProfile: true,
      staffProfile: true,
    },
  });
  if (!user) return res.status(404).json({ message: 'Not found' });
  res.json({
    id: user.id,
    email: user.email,
    role: user.role,
    emailVerified: user.emailVerified,
    studentProfile: user.studentProfile,
    staffProfile: user.staffProfile,
  });
});

router.put('/', requireAuth('ADMIN','STUDENT','STAFF'), async (req: AuthedRequest, res) => {
  const schema = z.object({
    fullName: z.string().optional(),
    phone: z.string().optional(),
    passingYear: z.number().int().optional(),
    roomNo: z.string().optional(),
    profileImageUrl: z.string().optional(),
  });
  const body = schema.parse(req.body);

  const user = await prisma.user.findUnique({ where: { id: req.user!.id }, include: { studentProfile: true, staffProfile: true } });
  if (!user) return res.status(404).json({ message: 'Not found' });

  if (user.role === 'STUDENT' && user.studentProfile) {
    const upd = await prisma.studentProfile.update({
      where: { userId: user.id },
      data: {
        fullName: body.fullName ?? user.studentProfile.fullName,
        phone: body.phone ?? user.studentProfile.phone,
        passingYear: body.passingYear ?? user.studentProfile.passingYear ?? undefined,
        roomNo: body.roomNo ?? user.studentProfile.roomNo,
        profileImageUrl: body.profileImageUrl ?? user.studentProfile.profileImageUrl,
      },
    });
    return res.json(upd);
  }
  if (user.role === 'STAFF' && user.staffProfile) {
    const updUser = await prisma.staffProfile.update({
      where: { userId: user.id },
      data: { fullName: body.fullName ?? user.staffProfile.fullName },
    });
    return res.json(updUser);
  }
  return res.json({ id: user.id, email: user.email, role: user.role });
});

export default router;
