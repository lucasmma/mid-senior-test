import { Loan } from '@prisma/client'

export interface DbLoanRepository {
  getLoanById(loanId: string): Promise<Loan | null>
  updateLoan(loanId: string, data: Partial<Omit<Loan, 'id'>>): Promise<Loan | null>
}