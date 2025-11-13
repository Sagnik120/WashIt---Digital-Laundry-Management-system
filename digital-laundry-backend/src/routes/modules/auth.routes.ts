
import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../../db.js';
import { ActiveStatus, Role } from '@prisma/client';
import { hashPassword, comparePassword } from '../../utils/hash.js';
import { generateOtp, hashOtp } from '../../utils/otp.js';
import { sendMail } from '../../utils/email.js';
import { signJwt } from '../../utils/jwt.js';
import bcrypt from 'bcryptjs';

const router = Router();

router.post('/register/student', async (req, res) => {
  const schema = z.object({
    fullName: z.string().min(1),
    rollNumber: z.string().min(1),
    email: z.string().email(),
    hostelCode: z.string().min(1),
    roomNo: z.string().min(1),
    password: z.string().min(6),
  });
  const body = schema.parse(req.body);

  const existing = await prisma.user.findUnique({ where: { email: body.email } });
  if (existing) return res.status(400).json({ message: 'Email already registered' });

  const hostel = await prisma.hostel.findUnique({ where: { hostelCode: body.hostelCode } });
  if (!hostel || hostel.status !== 'ACTIVE') return res.status(400).json({ message: 'Invalid hostel' });

  const passwordHash = await hashPassword(body.password);
  const user = await prisma.user.create({
    data: { email: body.email, passwordHash, role: 'STUDENT' },
  });

  const uniqueLaundryId = 'UL-' + body.rollNumber;
  await prisma.studentProfile.create({
    data: {
      userId: user.id,
      fullName: body.fullName,
      rollNumber: body.rollNumber,
      hostelId: hostel.id,
      roomNo: body.roomNo,
      uniqueLaundryId,
    },
  });

  const { otp, hash } = generateOtp();
  await prisma.emailVerification.create({
    data: {
      userId: user.id,
      otpHash: hash,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      status: 'PENDING',
    },
  });
  await sendMail({
    to: body.email,
    subject: 'Verify your email',
    html: `<p>Your OTP is <b>${otp}</b>. It expires in 15 minutes.</p>`,
  });

  return res.json({ userId: user.id, message: 'Registered. Verify email.' });
});

router.post('/register/staff', async (req, res) => {
  const schema = z.object({
    fullName: z.string().min(1),
    email: z.string().email(),
    staffCode: z.string().min(1),
    password: z.string().min(6),
  });
  const body = schema.parse(req.body);

  const existing = await prisma.user.findUnique({ where: { email: body.email } });
  if (existing) return res.status(400).json({ message: 'Email already registered' });

  const code = await prisma.staffCode.findUnique({ where: { code: body.staffCode } });
  if (!code || code.status !== ActiveStatus.INACTIVE) {
    return res.status(400).json({ message: 'Invalid or already used staff code' });
  }

  const passwordHash = await hashPassword(body.password);
  const user = await prisma.user.create({
    data: { email: body.email, passwordHash, role: Role.STAFF },
  });

  await prisma.staffProfile.create({
    data: { userId: user.id, fullName: body.fullName, staffCodeValue: code.code },
  });

  await prisma.staffCode.update({
    where: { code: code.code },
    data: { claimed: true, claimedByUserId: user.id, claimedAt: new Date() },
  });

  const { otp, hash } = generateOtp();
  await prisma.emailVerification.create({
    data: {
      userId: user.id,
      otpHash: hash,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      status: 'PENDING',
    },
  });
  await sendMail({
    to: body.email,
    subject: 'Verify your email',
    html: `<p>Your OTP is <b>${otp}</b>. It expires in 15 minutes.</p>`,
  });

  return res.json({ userId: user.id, message: 'Registered. Verify email.' });
});

router.post('/verify-email', async (req, res) => {
  const schema = z.object({ email: z.string().email(), otp: z.string().length(6) });
  const { email, otp } = schema.parse(req.body);

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const ev = await prisma.emailVerification.findFirst({
    where: { userId: user.id, status: 'PENDING' },
    orderBy: { createdAt: 'desc' },
  });
  if (!ev) return res.status(400).json({ message: 'Invalid/expired OTP' });
  if (ev.expiresAt < new Date()) return res.status(400).json({ message: 'Invalid/expired OTP' });

  if (ev.otpHash !== hashOtp(otp)) return res.status(400).json({ message: 'Invalid/expired OTP' });

  await prisma.$transaction([
    prisma.emailVerification.update({ where: { id: ev.id }, data: { status: 'VERIFIED', verifiedAt: new Date() } }),
    prisma.user.update({ where: { id: user.id }, data: { emailVerified: true } }),
  ]);

  return res.json({ message: 'Email verified' });
});

router.post('/resend-otp', async (req, res) => {
  const schema = z.object({ email: z.string().email() });
  const { email } = schema.parse(req.body);

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const { otp, hash } = generateOtp();
  await prisma.emailVerification.create({
    data: {
      userId: user.id,
      otpHash: hash,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      status: 'PENDING',
    },
  });
  await sendMail({
    to: email,
    subject: 'Your OTP',
    html: `<p>Your OTP is <b>${otp}</b>. It expires in 15 minutes.</p>`,
  });
  return res.json({ message: 'OTP sent' });
});

router.post('/login', async (req, res) => {
  const schema = z.object({ email: z.string().email(), password: z.string().min(1) });
  const { email, password } = schema.parse(req.body);
  
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(400).json({ message: 'user not found' });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(400).json({ message: 'Invalid credentials' });

  const token = signJwt({ sub: user.id, role: user.role as any });
  return res.json({ token, role: user.role });
});

router.post('/forgot-password', async (req, res, next) => {
  try {
    const schema = z.object({ email: z.string().email() });
    const { email } = schema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.json({ message: 'User not found' });
    }

    const tempPassword = Math.random().toString(36).slice(-8);
    const tempHash = await hashPassword(tempPassword);

    // Save reset event
    await prisma.passwordReset.create({
      data: {
        userId: user.id,
        tempPasswordHash: tempHash,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
        status: 'PENDING',
      },
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: tempHash },
    });

    await sendMail({
      to: email,
      subject: 'Temporary Password',
      html: `
        <p>Your temporary password is <b>${tempPassword}</b></p>
        <p>It is valid for <b>60 minutes</b>. Please log in and change your password immediately.</p>
      `,
    });

    return res.json({ message: 'Temporary password sent' });
  } catch (err) {
    next(err); 
  }
});


router.post('/change-password', async (req, res) => {
  const schema = z.object({ oldPassword: z.string(), newPassword: z.string().min(6) });
  const { oldPassword, newPassword } = schema.parse(req.body);

  const auth = (req.headers.authorization||'').split(' ')[1];
  if (!auth) return res.status(401).json({ message: 'Unauthorized' });
  const payload = JSON.parse(Buffer.from(auth.split('.')[1], 'base64').toString());
  const userId = payload.sub as string;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return res.status(401).json({ message: 'Unauthorized' });

  const ok = await comparePassword(oldPassword, user.passwordHash);
  if (!ok) return res.status(400).json({ message: 'Old password incorrect' });

  const passwordHash = await hashPassword(newPassword);
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });
  return res.json({ message: 'Password changed' });
});

export default router;
