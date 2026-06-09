import { Router } from 'express';
import { validateReferralCode } from './referral.controller';

const router = Router();

router.get('/validate/:code', validateReferralCode);

export default router;