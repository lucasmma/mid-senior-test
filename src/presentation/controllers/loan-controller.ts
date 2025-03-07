import { HttpRequest, HttpResponse } from '../protocols'
import { badRequest, ok } from '../helpers/http-helper'
import prisma from '../../main/config/prisma'
import { createLoanSchema } from '../../main/schemas/loan/create-loan-schema'
import { updateLoanStatusSchema } from '../../main/schemas/loan/update-loan-status-schema'

export class LoanController {
  constructor() {
  }
  async createLoan(
    request: HttpRequest<( typeof createLoanSchema._output)>,
  ): Promise<HttpResponse> {
    const body = request.body!
    var user = request.auth!.user!

    const loan = await prisma.loan.create({
      data: {
        amount: body.amount,
        purpose: body.purpose,
        duration: body.duration,
        user_id: user.id,
        status: 'PENDING',
        total_paid: 0,
        remaining_balance: 0,
      }
    })


    return ok(loan)
  }

  async listLoans(
    request: HttpRequest,
  ): Promise<HttpResponse> {
    var user = request.auth!.user!

    const loans = await prisma.loan.findMany({
      where: {
        user_id: user.id
      }
    })

    return ok(loans)
  }

  async listLoan(
    request: HttpRequest,
  ): Promise<HttpResponse> {
    var user = request.auth!.user!
    const { id } = request.params!

    const loan = await prisma.loan.findUnique({
      where: {
        id: id
      }
    })

    if(!loan) {
      return badRequest(new Error('Loan not found'))
    }

    if(user.role == 'USER' && loan.user_id !== user.id) {
      return badRequest(new Error('Loan not found'))
    }

    return ok(loan)
  }
  
  async updateStatus(
    request: HttpRequest<(typeof updateLoanStatusSchema._output)>,
  ): Promise<HttpResponse> {
    var user = request.auth!.user!
    const { id } = request.params!

    var loan = await prisma.loan.findUnique({
      where: {
        id: id
      }
    })

    if(!loan) {
      return badRequest(new Error('Loan not found'))
    }

    loan = await prisma.loan.update({
      where: {
        id: id
      },
      data: {
        status: request.body!.status,
        remaining_balance: loan.amount
      }
    })

    return ok(loan)
  }
}