import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Profile, { EmploymentMode } from '../models/Profile';
import { runBRE } from '../utils/bre';

export const submitProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?._id;
  const { fullName, pan, dateOfBirth, monthlySalary, employmentMode } = req.body;
  if (!fullName || !pan || !dateOfBirth || !monthlySalary || !employmentMode) {
    res.status(400).json({ success: false, message: 'All fields are required.' }); return;
  }
  const breResult = runBRE({
    dateOfBirth: new Date(dateOfBirth), monthlySalary: Number(monthlySalary),
    pan: pan.toUpperCase(), employmentMode: employmentMode as EmploymentMode,
  });
  const profileData = { userId, fullName: fullName.trim(), pan: pan.toUpperCase(),
    dateOfBirth: new Date(dateOfBirth), monthlySalary: Number(monthlySalary), employmentMode,
    breStatus: breResult.passed ? 'passed' : 'failed', breFailReasons: breResult.failReasons };
  const profile = await Profile.findOneAndUpdate({ userId }, profileData, { new: true, upsert: true, runValidators: true });
  if (!breResult.passed) {
    res.status(422).json({ success: false, message: 'Eligibility check failed.', data: { breStatus: 'failed', failReasons: breResult.failReasons, profile } }); return;
  }
  res.status(200).json({ success: true, message: 'Profile submitted. Eligibility passed.', data: { breStatus: 'passed', profile } });
};

export const uploadSalarySlip = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?._id;
  if (!req.file) { res.status(400).json({ success: false, message: 'No file uploaded.' }); return; }
  const profile = await Profile.findOneAndUpdate({ userId },
    { salarySlipUrl: `/uploads/${req.file.filename}`, salarySlipFilename: req.file.originalname }, { new: true });
  if (!profile) { res.status(404).json({ success: false, message: 'Profile not found.' }); return; }
  res.status(200).json({ success: true, message: 'Salary slip uploaded.', data: { salarySlipUrl: profile.salarySlipUrl } });
};

export const getMyProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  const profile = await Profile.findOne({ userId: req.user?._id });
  res.status(200).json({ success: true, data: profile });
};
