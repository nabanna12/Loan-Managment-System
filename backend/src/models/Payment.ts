import mongoose, { Document, Schema } from 'mongoose';

export interface IPayment extends Document {
  _id: mongoose.Types.ObjectId;
  loanId: mongoose.Types.ObjectId; utrNumber: string;
  amount: number; paymentDate: Date;
  recordedBy: mongoose.Types.ObjectId;
  createdAt: Date; updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>({
  loanId: { type: Schema.Types.ObjectId, ref: 'Loan', required: true },
  utrNumber: { type: String, required: true, unique: true, uppercase: true, trim: true },
  amount: { type: Number, required: true, min: 1 },
  paymentDate: { type: Date, required: true },
  recordedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

PaymentSchema.index({ utrNumber: 1 }, { unique: true });
export default mongoose.model<IPayment>('Payment', PaymentSchema);
