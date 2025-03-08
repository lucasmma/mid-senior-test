import { Loan } from '@prisma/client'
import { DbLoanRepository } from '../data/protocols/db-loan-repository'
import prisma from '../main/config/prisma'
import { CacheAdapter } from '../infra/cache/cache-adapter'

export class LoanRepository implements DbLoanRepository {
  constructor(private readonly loanCache: CacheAdapter) {
    this.loanCache = loanCache
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