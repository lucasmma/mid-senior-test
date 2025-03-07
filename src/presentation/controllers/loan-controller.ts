import { HttpRequest, HttpResponse } from '../protocols'
import { badRequest, ok } from '../helpers/http-helper'
import prisma from '../../main/config/prisma'
import { JwtAdapter } from '../../infra/auth/jwt-adapter'
import { omit } from '../helpers/omit-field'
import { createLoanSchema } from '../../main/schemas/loan/create-loan-schema'

export class LoanController {
  constructor() {
  }
  async createLoan(
    request: HttpRequest<( typeof createLoanSchema._output)>,
  ): Promise<HttpResponse> {
    const body = request.body!
    var user = request.auth!.user!

    const loan = prisma.loan.create({
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

    const loans = prisma.loan.findMany({
      where: {
        user_id: user.id
      }
    })

    return ok(loans)
  }
}