import { Router } from 'express';
import { getVendorStats } from './vendor.controller';
import { authenticate, authorize } from './auth.middleware';

const router = Router();

router.get('/stats', authenticate, authorize('VENDOR'), getVendorStats);

export default router;