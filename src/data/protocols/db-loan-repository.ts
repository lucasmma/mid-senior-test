import { Loan } from '@prisma/client'

export interface DbLoanRepository {
  getLoanById(loanId: string): Promise<Loan | null>
  updateLoan(loanId: string, data: Partial<Omit<Loan, 'id'>>): Promise<Loan | null>
  createLoan(data: {amount: number, purpose: string, duration: number, user_id: string}): Promise<Loan>
}