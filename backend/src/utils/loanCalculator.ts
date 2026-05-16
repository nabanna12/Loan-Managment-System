export interface LoanCalculation {
  principal: number; tenure: number; interestRate: number; simpleInterest: number; totalRepayment: number;
}
// SI = (P × R × T) / (365 × 100)
export const calculateLoan = (principal: number, tenure: number, rate = 12): LoanCalculation => {
  const simpleInterest = (principal * rate * tenure) / (365 * 100);
  const totalRepayment = principal + simpleInterest;
  return { principal, tenure, interestRate: rate,
    simpleInterest: Math.round(simpleInterest * 100) / 100,
    totalRepayment: Math.round(totalRepayment * 100) / 100 };
};
