import { Router } from 'express';
import { inviteVendor, getAdminStats, getPendingApplications, approveApplication, rejectApplication, getAllVendors, deleteVendor, updateStudentStatus, updateVendorCommission } from './admin.controller';
import { authenticate, authorize } from './auth.middleware';

const router = Router();

// All routes below are protected for Super Admin only
router.use(authenticate, authorize('SUPER_ADMIN'));

router.get('/stats', getAdminStats);
router.get('/vendors', getAllVendors);
router.post('/vendors/invite', inviteVendor);
router.delete('/vendors/:id', deleteVendor);
router.patch('/vendors/:id/commission', updateVendorCommission);
router.patch('/students/:id/status', updateStudentStatus);

router.get('/applications/pending', getPendingApplications);
router.post('/applications/:id/approve', approveApplication);
router.post('/applications/:id/reject', rejectApplication);

export default router;