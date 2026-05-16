import mongoose, { Document, Schema } from 'mongoose';

export type LoanStatus = 'APPLIED' | 'SANCTIONED' | 'REJECTED' | 'DISBURSED' | 'CLOSED';

export interface ILoan extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId; amount: number; tenure: number;
  interestRate: number; simpleInterest: number; totalRepayment: number;
  status: LoanStatus; rejectionReason?: string;
  sanctionedBy?: mongoose.Types.ObjectId; sanctionedAt?: Date;
  disbursedBy?: mongoose.Types.ObjectId; disbursedAt?: Date;
  totalPaid: number; closedAt?: Date;
  createdAt: Date; updatedAt: Date;
}

const LoanSchema = new Schema<ILoan>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true, min: 50000, max: 500000 },
  tenure: { type: Number, required: true, min: 30, max: 365 },
  interestRate: { type: Number, required: true, default: 12 },
  simpleInterest: { type: Number, required: true },
  totalRepayment: { type: Number, required: true },
  status: { type: String, enum: ['APPLIED','SANCTIONED','REJECTED','DISBURSED','CLOSED'], default: 'APPLIED' },
  rejectionReason: { type: String },
  sanctionedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  sanctionedAt: { type: Date },
  disbursedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  disbursedAt: { type: Date },
  totalPaid: { type: Number, default: 0 },
  closedAt: { type: Date },
}, { timestamps: true });

export default mongoose.model<ILoan>('Loan', LoanSchema);
