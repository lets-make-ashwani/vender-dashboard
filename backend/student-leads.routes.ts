import { Router } from 'express';
import { submitLead, getLeads } from './student-leads.controller';
import { authenticate } from './auth.middleware';

const router = Router();

router.post('/', submitLead); // Public
router.get('/', authenticate, getLeads); // Protected (Vendor/Admin)

export default router;