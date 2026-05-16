import { Request, Response } from 'express';
import User from '../models/User';
import { generateToken } from '../utils/generateToken';
import { AuthRequest } from '../middleware/auth';

export const register = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) { res.status(400).json({ success: false, message: 'All fields required.' }); return; }
  if (await User.findOne({ email })) { res.status(409).json({ success: false, message: 'Email already registered.' }); return; }
  const user = await User.create({ name, email, password, role: 'borrower' });
  const token = generateToken(user._id.toString(), user.email, user.role, user.name);
  res.status(201).json({ success: true, message: 'Account created.', data: { token, user: { _id: user._id, name: user.name, email: user.email, role: user.role } } });
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  if (!email || !password) { res.status(400).json({ success: false, message: 'Email and password required.' }); return; }
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) { res.status(401).json({ success: false, message: 'Invalid credentials.' }); return; }
  const token = generateToken(user._id.toString(), user.email, user.role, user.name);
  res.status(200).json({ success: true, message: 'Login successful.', data: { token, user: { _id: user._id, name: user.name, email: user.email, role: user.role } } });
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  const user = await User.findById(req.user?._id).select('-password');
  res.status(200).json({ success: true, data: user });
};
