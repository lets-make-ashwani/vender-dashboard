import type { Response } from 'express';
import { prisma } from './index';
import { AuthRequest } from './auth.middleware';

export const getVendorStats = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const vendorId = req.user.vendorId;

    const totalStudents = await prisma.studentLead.count({ where: { vendor_id: vendorId } });

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const todaysStudents = await prisma.studentLead.count({
      where: { vendor_id: vendorId, created_at: { gte: startOfToday } }
    });

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const monthlyStudents = await prisma.studentLead.count({
      where: { vendor_id: vendorId, created_at: { gte: startOfMonth } }
    });

    const vendor = await prisma.vendor.findUnique({ where: { id: vendorId }, select: { referral_code: true } });

    res.json({ totalStudents, todaysStudents, monthlyStudents, referral_code: vendor?.referral_code });
  } catch (error: any) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};