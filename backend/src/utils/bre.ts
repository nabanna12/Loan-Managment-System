import { differenceInYears } from './dateUtils';
import { EmploymentMode } from '../models/Profile';

export interface BREInput {
  dateOfBirth: Date; monthlySalary: number; pan: string; employmentMode: EmploymentMode;
}
export interface BREResult { passed: boolean; failReasons: string[]; }

const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

export const runBRE = (input: BREInput): BREResult => {
  const failReasons: string[] = [];
  const age = differenceInYears(new Date(), input.dateOfBirth);
  if (age < 23 || age > 50) failReasons.push(`Age must be between 23 and 50. Your age: ${age}`);
  if (input.monthlySalary < 25000) failReasons.push(`Monthly salary must be ≥ ₹25,000. Got: ₹${input.monthlySalary.toLocaleString('en-IN')}`);
  if (!PAN_REGEX.test(input.pan.toUpperCase())) failReasons.push('PAN must match: AAAAA9999A (5 letters, 4 digits, 1 letter)');
  if (input.employmentMode === 'Unemployed') failReasons.push('Unemployed applicants are not eligible.');
  return { passed: failReasons.length === 0, failReasons };
};
