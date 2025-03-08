import { Loan } from '@prisma/client'
import { DbLoanRepository } from '../data/protocols/db-loan-repository'
import prisma from '../main/config/prisma'
import { CacheAdapter } from '../infra/cache/cache-adapter'

export class LoanRepository implements DbLoanRepository {
  constructor(private readonly loanCache: CacheAdapter) {
    this.loanCache = loanCache
  }

  createLoan(data: {amount: number, purpose: string, duration: number, user_id: string}): Promise<Loan> {
    // implementation
    const loan = prisma.loan.create({
      data: {
        amount: data.amount,
        purpose: data.purpose,
        duration: data.duration,
        user_id: data.user_id,
        status: 'PENDING',
        total_paid: 0,
        remaining_balance: 0,
      },
    })
    return loan
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