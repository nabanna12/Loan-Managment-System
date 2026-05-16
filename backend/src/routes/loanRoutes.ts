import { Router } from 'express';
import { applyLoan, getMyLoans, getLoanById, getAllAppliedLoans, sanctionLoan,
  getAllSanctionedLoans, disburseLoan, getAllDisbursedLoans, getLeads, getAllLoans } from '../controllers/loanController';
import { protect, authorize } from '../middleware/auth';
const router = Router();
router.use(protect);
router.post('/apply', authorize('borrower'), applyLoan);
router.get('/my', authorize('borrower'), getMyLoans);
router.get('/leads', authorize('sales','admin'), getLeads);
router.get('/applied', authorize('sanction','admin'), getAllAppliedLoans);
router.patch('/:id/sanction', authorize('sanction','admin'), sanctionLoan);
router.get('/sanctioned', authorize('disbursement','admin'), getAllSanctionedLoans);
router.patch('/:id/disburse', authorize('disbursement','admin'), disburseLoan);
router.get('/disbursed', authorize('collection','admin'), getAllDisbursedLoans);
router.get('/all', authorize('admin'), getAllLoans);
router.get('/:id', protect, getLoanById);
export default router;
