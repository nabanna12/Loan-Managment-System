import { Router } from 'express';
import { recordPayment, getLoanPayments } from '../controllers/paymentController';
import { protect, authorize } from '../middleware/auth';
const router = Router();
router.use(protect);
router.post('/loan/:loanId', authorize('collection','admin'), recordPayment);
router.get('/loan/:loanId', authorize('collection','admin'), getLoanPayments);
export default router;
