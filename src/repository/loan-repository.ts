import { Loan } from '@prisma/client'
import { DbLoanRepository } from '../data/protocols/db-loan-repository'
import prisma from '../main/config/prisma'

export class LoanRepository implements DbLoanRepository {
  async getLoansByUserId(userId: string): Promise<Loan[]> {
    // implementation
    const loans = await prisma.loan.findMany({
      where: {
        user_id: userId
      }
    })
    return loans
  }

  async getLoanById(loanId: string): Promise<Loan | null> {
    // implementation
    const loan = await prisma.loan.findUnique({
      where: {
        id: loanId,
      }
    })
    return loan
  }

  async updateLoan(loanId: string, data: Partial<Omit<Loan, 'id'>>): Promise<Loan | null> {
    // implementation
    const loan = await prisma.loan.update({
      where: {
        id: loanId,
      },
      data: data,
    })
    return loan
  }
}