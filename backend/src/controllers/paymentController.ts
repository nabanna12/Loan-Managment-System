import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Payment from '../models/Payment';
import Loan from '../models/Loan';

export const recordPayment = async (req: AuthRequest, res: Response): Promise<void> => {
  const { loanId } = req.params;
  const { utrNumber, amount, paymentDate } = req.body;
  if (!utrNumber || !amount || !paymentDate) { res.status(400).json({ success: false, message: 'UTR, amount, and date required.' }); return; }
  const loan = await Loan.findById(loanId);
  if (!loan) { res.status(404).json({ success: false, message: 'Loan not found.' }); return; }
  if (loan.status !== 'DISBURSED') { res.status(400).json({ success: false, message: 'Payments only for disbursed loans.' }); return; }
  const paymentAmount = Number(amount);
  const outstanding = loan.totalRepayment - loan.totalPaid;
  if (paymentAmount <= 0) { res.status(400).json({ success: false, message: 'Amount must be > 0.' }); return; }
  if (paymentAmount > outstanding) { res.status(400).json({ success: false, message: `Amount ₹${paymentAmount.toLocaleString('en-IN')} exceeds outstanding ₹${outstanding.toLocaleString('en-IN')}.` }); return; }
  if (await Payment.findOne({ utrNumber: utrNumber.toUpperCase() })) { res.status(409).json({ success: false, message: 'UTR already exists.' }); return; }
  const payment = await Payment.create({ loanId, utrNumber: utrNumber.toUpperCase(), amount: paymentAmount, paymentDate: new Date(paymentDate), recordedBy: req.user?._id });
  loan.totalPaid += paymentAmount;
  if (loan.totalPaid >= loan.totalRepayment) { loan.status = 'CLOSED'; loan.closedAt = new Date(); }
  await loan.save();
  res.status(201).json({ success: true, message: `Payment recorded.${loan.status === 'CLOSED' ? ' Loan CLOSED.' : ''}`,
    data: { payment, loan: { status: loan.status, totalPaid: loan.totalPaid, totalRepayment: loan.totalRepayment, outstanding: Math.max(0, loan.totalRepayment - loan.totalPaid) } } });
};

export const getLoanPayments = async (req: AuthRequest, res: Response): Promise<void> => {
  const payments = await Payment.find({ loanId: req.params.loanId }).populate('recordedBy','name').sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: payments });
};
