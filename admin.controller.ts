import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { prisma } from './index';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: process.env.SMTP_PORT === '465' || !process.env.SMTP_PORT, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || process.env.EMAIL_USER,
    pass: process.env.SMTP_PASS || process.env.EMAIL_PASS,
  },
});

// Helper function to generate a secure random referral code
const generateReferralCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'SKR';
  for (let i = 0; i < 7; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

export const inviteVendor = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, email, phone, address, city, state, pincode } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'A user with this email already exists.' });
    }

    // Generate a temporary secure password for the new vendor
    const plainPassword = Math.random().toString(36).slice(-8) + 'A1!'; 
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // Generate Vendor ID based on current count
    const vendorCount = await prisma.vendor.count();
    const vendor_id = `VND${String(vendorCount + 1).padStart(6, '0')}`;
    const referral_code = generateReferralCode();

    // Create User and Vendor records in the database simultaneously
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        role: 'VENDOR',
        is_verified: true,
        vendor: {
          create: {
            vendor_id,
            referral_code,
            address,
            city,
            state,
            pincode,
            aadhaar_number: '',
            pan_number: '',
            aadhaar_front: '',
            aadhaar_back: '',
            pan_image: '',
            bank_name: '',
            branch_name: '',
            account_number: '',
            ifsc_code: '',
            passbook_image: '',
            status: 'ACTIVE',
          }
        }
      },
      include: { vendor: true }
    });

    const loginLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login`;

    // Return the generated credentials so the Admin can send them via email/WhatsApp
    res.status(201).json({
      message: 'Vendor created successfully.',
      credentials: {
        email: user.email,
        password: plainPassword,
        loginLink,
        messageToForward: `Hello ${user.name}, your Vendor account has been created. You can log in at ${loginLink} using Email: ${user.email} and Password: ${plainPassword}`
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};

export const getAdminStats = async (req: Request, res: Response): Promise<any> => {
  try {
    const totalVendors = await prisma.vendor.count();
    const pendingVendors = await prisma.vendorApplication.count({ where: { status: 'PENDING' } });
    const totalStudents = await prisma.studentLead.count();
    
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const monthlyStudents = await prisma.studentLead.count({
      where: { created_at: { gte: startOfMonth } }
    });

    res.json({ totalVendors, pendingVendors, totalStudents, monthlyStudents });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};

export const getPendingApplications = async (req: Request, res: Response): Promise<any> => {
  try {
    const applications = await prisma.vendorApplication.findMany({
      where: { status: 'PENDING' },
      orderBy: { created_at: 'desc' }
    });
    res.json(applications);
  } catch (error: any) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const approveApplication = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const application = await prisma.vendorApplication.findUnique({ where: { id } });
    
    if (!application || application.status !== 'PENDING') {
      return res.status(404).json({ message: 'Application not found or already processed.' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email: application.email } });
    if (existingUser) return res.status(400).json({ message: 'User with this email already exists.' });

    const plainPassword = Math.random().toString(36).slice(-8) + 'A1!'; 
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    const vendorCount = await prisma.vendor.count();
    const vendor_id = `VND${String(vendorCount + 1).padStart(6, '0')}`;
    const referral_code = generateReferralCode();

    const user = await prisma.user.create({
      data: {
        name: application.name, email: application.email, phone: application.phone,
        password: hashedPassword, role: 'VENDOR', is_verified: true,
        vendor: {
          create: {
            vendor_id, referral_code, address: application.address,
            city: application.city, state: application.state, pincode: application.pincode, 
            aadhaar_number: application.aadhaar_number,
            pan_number: application.pan_number,
            aadhaar_front: application.aadhaar_front,
            aadhaar_back: application.aadhaar_back,
            pan_image: application.pan_image,
            bank_name: application.bank_name,
            branch_name: application.branch_name,
            account_number: application.account_number,
            ifsc_code: application.ifsc_code,
            passbook_image: application.passbook_image,
            status: 'ACTIVE'
          }
        }
      }
    });

    await prisma.vendorApplication.update({ where: { id }, data: { status: 'APPROVED' } });
    
    const loginLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login`;
    // Send approval email with credentials
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER || 'noreply@topperssikshakendra.com',
        to: user.email,
        subject: 'Topper\'s Siksha Kendra - Vendor Account Approved!',
        html: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;"> <h2 style="color: #FF6B00;">Congratulations, ${user.name}!</h2> <p>Your application to become a Topper<span style="color: #FF6B00;">'s</span> Siksha <span style="color: #FF6B00;">Kendra</span> Vendor has been <strong>approved</strong>.</p> <p>Here are your official details:</p> <ul> <li><strong>Vendor ID:</strong> ${vendor_id}</li> <li><strong>Referral Code:</strong> ${referral_code}</li> </ul> <p>You can now log into your dashboard and start referring students:</p> <p style="background: #f4f4f4; padding: 10px; border-radius: 5px;"> <strong>Login Email:</strong> ${user.email}<br/> <strong>Temporary Password:</strong> ${plainPassword} </p> <a href="${loginLink}" style="display: inline-block; padding: 10px 20px; background: #FF6B00; color: white; text-decoration: none; border-radius: 5px; margin-top: 15px;">Login to Dashboard</a> </div>`
      });
    } catch (emailError) {
      console.error("Email failed to send but vendor was approved", emailError);
    }

    res.json({ message: 'Vendor approved successfully.', credentials: { email: user.email, password: plainPassword } });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};

export const rejectApplication = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    await prisma.vendorApplication.update({ where: { id }, data: { status: 'REJECTED' } });
    res.json({ message: 'Application rejected successfully.' });
  } catch (error: any) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getAllVendors = async (req: Request, res: Response): Promise<any> => {
  try {
    const vendors = await prisma.vendor.findMany({
      include: { user: true, _count: { select: { studentLeads: true } } },
      orderBy: { created_at: 'desc' }
    });
    res.json(vendors);
  } catch (error: any) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};