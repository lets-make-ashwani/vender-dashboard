import type { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from './index';

const courseSchema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional(),
  price: z.number().min(0),
  category: z.string().optional(),
  class: z.string().optional(),
  status: z.enum(['ACTIVE', 'DRAFT', 'ARCHIVED']).optional()
});

export const getCourses = async (req: Request, res: Response): Promise<any> => {
  try {
    const courses = await prisma.course.findMany({
      include: { _count: { select: { studentLeads: true } } },
      orderBy: { created_at: 'desc' }
    });
    res.json(courses);
  } catch (error: any) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const createCourse = async (req: Request, res: Response): Promise<any> => {
  try {
    const data = courseSchema.parse(req.body);
    const course = await prisma.course.create({ data });
    res.status(201).json(course);
  } catch (error: any) {
    const errorMsg = error.errors ? error.errors.map((e: any) => e.message).join(', ') : error.message;
    res.status(400).json({ message: errorMsg });
  }
};

export const updateCourse = async (req: Request, res: Response): Promise<any> => {
  try {
    const id = req.params.id as string;
    const data = courseSchema.partial().parse(req.body);
    const course = await prisma.course.update({ where: { id }, data });
    res.json(course);
  } catch (error: any) {
    const errorMsg = error.errors ? error.errors.map((e: any) => e.message).join(', ') : 'Course not found';
    res.status(400).json({ message: errorMsg });
  }
};

export const deleteCourse = async (req: Request, res: Response): Promise<any> => {
  try {
    const id = req.params.id as string;
    await prisma.course.delete({ where: { id } });
    res.json({ message: 'Course deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error deleting course' });
  }
};