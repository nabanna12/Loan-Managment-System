import mongoose, { Document, Schema } from 'mongoose';

export type EmploymentMode = 'Salaried' | 'Self-Employed' | 'Unemployed';

export interface IProfile extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  fullName: string; pan: string; dateOfBirth: Date;
  monthlySalary: number; employmentMode: EmploymentMode;
  salarySlipUrl?: string; salarySlipFilename?: string;
  breStatus: 'pending' | 'passed' | 'failed';
  breFailReasons: string[];
  createdAt: Date; updatedAt: Date;
}

const ProfileSchema = new Schema<IProfile>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  fullName: { type: String, required: true, trim: true },
  pan: { type: String, required: true, uppercase: true, match: [/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN'] },
  dateOfBirth: { type: Date, required: true },
  monthlySalary: { type: Number, required: true, min: 0 },
  employmentMode: { type: String, enum: ['Salaried','Self-Employed','Unemployed'], required: true },
  salarySlipUrl: { type: String },
  salarySlipFilename: { type: String },
  breStatus: { type: String, enum: ['pending','passed','failed'], default: 'pending' },
  breFailReasons: [{ type: String }],
}, { timestamps: true });

export default mongoose.model<IProfile>('Profile', ProfileSchema);
