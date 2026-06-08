import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from './index'; // or correct path to prisma instance
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const applicationSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  address: z.string().min(5),
  city: z.string().min(2),
  state: z.string().min(2),
  pincode: z.string().min(4),
  aadhaar_number: z.string().length(12, "Aadhaar must be exactly 12 digits"),
  pan_number: z.string().length(10, "PAN must be exactly 10 characters"),
  aadhaar_front: z.string().min(1, "Aadhaar front image is required"),
  aadhaar_back: z.string().min(1, "Aadhaar back image is required"),
  pan_image: z.string().min(1, "PAN image is required"),
  bank_name: z.string().min(2, "Bank name is required"),
  branch_name: z.string().min(2, "Branch name is required"),
  account_number: z.string().min(5, "Account number is required"),
  ifsc_code: z.string().min(11, "IFSC code is required"),
  passbook_image: z.string().min(1, "Passbook image is required"),
});

export const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    // 1. Super Admin Environment Variable Login (Bypasses Database)
    const superAdminEmail = process.env.SUPER_ADMIN_EMAIL;
    const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD;
    
    if (superAdminEmail && email === superAdminEmail && password === superAdminPassword) {
      const token = jwt.sign(
        { id: 'super_admin_env', role: 'SUPER_ADMIN' },
        process.env.JWT_SECRET as string,
        { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
      );
      return res.json({ token, user: { id: 'super_admin_env', name: 'Super Admin', email: superAdminEmail, role: 'SUPER_ADMIN' } });
    }

    // 2. Standard Vendor Database Login
    const user = await prisma.user.findUnique({ where: { email }, include: { vendor: true } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (user.role === 'VENDOR' && user.vendor?.status !== 'ACTIVE') {
      return res.status(403).json({ message: 'Vendor account is not active' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, vendorId: user.vendor?.id },
      process.env.JWT_SECRET as string,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );

    const { password: _, ...userWithoutPassword } = user;
    res.json({ token, user: userWithoutPassword });
  } catch (error: any) {
    const errorMsg = error.errors ? error.errors.map((e: any) => e.message).join(', ') : error.message;
    res.status(400).json({ message: errorMsg });
  }
};

export const applyForVendor = async (req: Request, res: Response): Promise<any> => {
  try {
    const data = applicationSchema.parse(req.body);
    
    // 1. Check if the email or phone is already registered as an active User
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email: data.email }, { phone: data.phone }] },
      select: { email: true, phone: true }
    });
    if (existingUser) {
      if (existingUser.email === data.email) return res.status(400).json({ message: 'This email address is already registered. Please use another email.' });
      if (existingUser.phone === data.phone) return res.status(400).json({ message: 'This mobile number is already registered. Please use another mobile number.' });
    }

    // 2. Check if the email or phone is already in a pending Vendor Application
    const existingApp = await prisma.vendorApplication.findFirst({
      where: { OR: [{ email: data.email }, { phone: data.phone }] },
      select: { email: true, phone: true }
    });
    if (existingApp) {
      if (existingApp.email === data.email) return res.status(400).json({ message: 'An application with this email already exists. Please use another email.' });
      if (existingApp.phone === data.phone) return res.status(400).json({ message: 'An application with this mobile number already exists. Please use another mobile number.' });
    }

    // Upload images to Cloudinary
    const uploadAadhaarFront = await cloudinary.uploader.upload(data.aadhaar_front, { folder: 'siksha_kendra/vendors' });
    const uploadAadhaarBack = await cloudinary.uploader.upload(data.aadhaar_back, { folder: 'siksha_kendra/vendors' });
    const uploadPan = await cloudinary.uploader.upload(data.pan_image, { folder: 'siksha_kendra/vendors' });
    const uploadPassbook = await cloudinary.uploader.upload(data.passbook_image, { folder: 'siksha_kendra/vendors' });

    // Save application with the secure URLs
    await prisma.vendorApplication.create({ data: { 
      ...data, 
      aadhaar_front: uploadAadhaarFront.secure_url,
      aadhaar_back: uploadAadhaarBack.secure_url,
      pan_image: uploadPan.secure_url,
      passbook_image: uploadPassbook.secure_url
    }});
    
    res.status(201).json({ message: 'Application submitted successfully. Awaiting admin approval.' });
  } catch (error: any) {
    const errorMsg = error.errors ? error.errors.map((e: any) => e.message).join(', ') : error.message;
    res.status(400).json({ message: errorMsg });
  }
};