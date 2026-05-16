import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Loan from '../models/Loan';
import Profile from '../models/Profile';
import User from '../models/User';
import { calculateLoan } from '../utils/loanCalculator';

export const applyLoan = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?._id;
  const { amount, tenure } = req.body;
  if (!amount || !tenure) { res.status(400).json({ success: false, message: 'Amount and tenure required.' }); return; }
  const loanAmount = Number(amount); const loanTenure = Number(tenure);
  if (loanAmount < 50000 || loanAmount > 500000) { res.status(400).json({ success: false, message: 'Amount must be ₹50,000–₹5,00,000.' }); return; }
  if (loanTenure < 30 || loanTenure > 365) { res.status(400).json({ success: false, message: 'Tenure must be 30–365 days.' }); return; }
  const profile = await Profile.findOne({ userId });
  if (!profile) { res.status(400).json({ success: false, message: 'Complete personal details first.' }); return; }
  if (profile.breStatus !== 'passed') { res.status(422).json({ success: false, message: 'Eligibility check not passed.' }); return; }
  if (!profile.salarySlipUrl) { res.status(400).json({ success: false, message: 'Upload salary slip first.' }); return; }
  const existing = await Loan.findOne({ userId, status: { $in: ['APPLIED','SANCTIONED','DISBURSED'] } });
  if (existing) { res.status(409).json({ success: false, message: 'Active loan already exists.' }); return; }
  const calc = calculateLoan(loanAmount, loanTenure);
  const loan = await Loan.create({ userId, amount: calc.principal, tenure: calc.tenure,
    interestRate: calc.interestRate, simpleInterest: calc.simpleInterest, totalRepayment: calc.totalRepayment });
  res.status(201).json({ success: true, message: 'Loan applied successfully.', data: loan });
};

export const getMyLoans = async (req: AuthRequest, res: Response): Promise<void> => {
  const loans = await Loan.find({ userId: req.user?._id }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: loans });
};

export const getLoanById = async (req: AuthRequest, res: Response): Promise<void> => {
  const loan = await Loan.findById(req.params.id).populate('userId','name email').populate('sanctionedBy','name').populate('disbursedBy','name');
  if (!loan) { res.status(404).json({ success: false, message: 'Loan not found.' }); return; }
  res.status(200).json({ success: true, data: loan });
};

export const getAllAppliedLoans = async (_req: AuthRequest, res: Response): Promise<void> => {
  const loans = await Loan.find({ status: 'APPLIED' }).populate('userId','name email').sort({ createdAt: -1 });
  const enriched = await Promise.all(loans.map(async (loan) => {
    const uid = (loan.userId as any)._id || loan.userId;
    const profile = await Profile.findOne({ userId: uid });
    return { ...loan.toObject(), profile };
  }));
  res.status(200).json({ success: true, data: enriched });
};

export const sanctionLoan = async (req: AuthRequest, res: Response): Promise<void> => {
  const { action, rejectionReason } = req.body;
  const loan = await Loan.findById(req.params.id);
  if (!loan) { res.status(404).json({ success: false, message: 'Loan not found.' }); return; }
  if (loan.status !== 'APPLIED') { res.status(400).json({ success: false, message: `Cannot sanction loan with status '${loan.status}'.` }); return; }
  if (action === 'approve') { loan.status = 'SANCTIONED'; loan.sanctionedBy = req.user?._id as any; loan.sanctionedAt = new Date(); }
  else if (action === 'reject') {
    if (!rejectionReason?.trim()) { res.status(400).json({ success: false, message: 'Rejection reason required.' }); return; }
    loan.status = 'REJECTED'; loan.rejectionReason = rejectionReason.trim();
  } else { res.status(400).json({ success: false, message: "Action must be 'approve' or 'reject'." }); return; }
  await loan.save();
  res.status(200).json({ success: true, message: `Loan ${action}d.`, data: loan });
};

export const getAllSanctionedLoans = async (_req: AuthRequest, res: Response): Promise<void> => {
  const loans = await Loan.find({ status: 'SANCTIONED' }).populate('userId','name email').populate('sanctionedBy','name').sort({ sanctionedAt: -1 });
  res.status(200).json({ success: true, data: loans });
};

export const disburseLoan = async (req: AuthRequest, res: Response): Promise<void> => {
  const loan = await Loan.findById(req.params.id);
  if (!loan) { res.status(404).json({ success: false, message: 'Loan not found.' }); return; }
  if (loan.status !== 'SANCTIONED') { res.status(400).json({ success: false, message: `Cannot disburse loan with status '${loan.status}'.` }); return; }
  loan.status = 'DISBURSED'; loan.disbursedBy = req.user?._id as any; loan.disbursedAt = new Date();
  await loan.save();
  res.status(200).json({ success: true, message: 'Loan disbursed.', data: loan });
};

export const getAllDisbursedLoans = async (_req: AuthRequest, res: Response): Promise<void> => {
  const loans = await Loan.find({ status: { $in: ['DISBURSED','CLOSED'] } }).populate('userId','name email').sort({ disbursedAt: -1 });
  res.status(200).json({ success: true, data: loans });
};

export const getLeads = async (_req: AuthRequest, res: Response): Promise<void> => {
  const usersWithLoans = await Loan.distinct('userId');
  const leads = await User.find({ role: 'borrower', _id: { $nin: usersWithLoans } }).select('-password');
  const enriched = await Promise.all(leads.map(async (user) => {
    const profile = await Profile.findOne({ userId: user._id });
    return { user, profile };
  }));
  res.status(200).json({ success: true, data: enriched });
};

export const getAllLoans = async (_req: AuthRequest, res: Response): Promise<void> => {
  const loans = await Loan.find().populate('userId','name email').populate('sanctionedBy','name').populate('disbursedBy','name').sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: loans });
};
