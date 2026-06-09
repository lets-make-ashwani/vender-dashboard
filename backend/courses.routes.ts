import { Router } from 'express';
import { getCourses, createCourse, updateCourse, deleteCourse } from './courses.controller';
import { authenticate, authorize } from './auth.middleware';

const router = Router();

router.get('/', getCourses); // Public route for Homepage

// Protected Admin Routes
router.post('/', authenticate, authorize('SUPER_ADMIN'), createCourse);
router.put('/:id', authenticate, authorize('SUPER_ADMIN'), updateCourse);
router.delete('/:id', authenticate, authorize('SUPER_ADMIN'), deleteCourse);

export default router;