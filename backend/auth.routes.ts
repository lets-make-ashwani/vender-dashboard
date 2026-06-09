import { Router } from 'express';
import { login, applyForVendor } from './auth.controller';

const router = Router();

router.post('/login', login);
router.post('/apply-vendor', applyForVendor);

export default router;