import type { Request, Response } from 'express';
import { prisma } from './index';

export const validateReferralCode = async (req: Request, res: Response): Promise<any> => {
  try {
    const code = req.params.code as string;

    const vendor = await prisma.vendor.findUnique({
      where: { referral_code: code },
      select: { id: true, vendor_id: true, status: true }
    });

    if (!vendor || vendor.status !== 'ACTIVE') {
      return res.status(404).json({ valid: false, message: 'Invalid or inactive referral code.' });
    }

    res.json({
      valid: true,
      vendorId: vendor.id
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error validating referral code.' });
  }
};