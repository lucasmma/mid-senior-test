import { HttpRequest, HttpResponse } from '../protocols'
import { badRequest, notFound, ok, unauthorized } from '../helpers/http-helper'
import prisma from '../../main/config/prisma'
import { createLoanSchema } from '../../main/schemas/loan/create-loan-schema'
import { updateLoanStatusSchema } from '../../main/schemas/loan/update-loan-status-schema'
import { paginationSchema } from '../../main/schemas/pagination-schema'
import { LoanRepository } from '../../repository/loan-repository'

export class LoanController {
  constructor(private readonly loanRepository: LoanRepository) {
    this.loanRepository = loanRepository
  }
  async createLoan(
    request: HttpRequest<( typeof createLoanSchema._output)>,
  ): Promise<HttpResponse> {
    const body = request.body!
    var user = request.auth!.user!

    const loan = await this.loanRepository.createLoan({
      amount: body.amount,
      purpose: body.purpose,
      duration: body.duration,
      user_id: user.id,
    })

    return ok(loan)
  }

  async listLoans(
    request: HttpRequest<null, (typeof paginationSchema._output) >,
  ): Promise<HttpResponse> {
    var user = request.auth!.user!

    const loans = await prisma.loan.findMany({
      where: {
        user_id: user.id
      },
      skip: request.query?.skip,
      take: request.query?.take,
    })

    return ok(loans)
  }

  async listLoan(
    request: HttpRequest,
  ): Promise<HttpResponse> {
    var user = request.auth!.user!
    const { id } = request.params!

    const loan = await this.loanRepository.getLoanById(id)

    if(!loan) {
      return notFound(new Error('Loan not found'))
    }

    if(user.role == 'USER' && loan.user_id !== user.id) {
      return unauthorized()
    }

    return ok(loan)
  }
  
  async updateStatus(
    request: HttpRequest<(typeof updateLoanStatusSchema._output)>,
  ): Promise<HttpResponse> {
    var user = request.auth!.user!
    const { id } = request.params!

    var loan = await this.loanRepository.getLoanById(id)

    if(!loan) {
      return notFound(new Error('Loan not found'))
    }

    if(loan.status == 'APPROVED' || loan.status == 'REJECTED') {
      return badRequest(new Error('Loan already processed'))
    }

    loan = await this.loanRepository.updateLoan(id, {
      status: request.body!.status,
      remaining_balance: loan.amount
    })

    return ok(loan)
  }
}