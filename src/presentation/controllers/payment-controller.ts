import { HttpRequest, HttpResponse } from '../protocols'
import { badRequest, ok } from '../helpers/http-helper'
import prisma from '../../main/config/prisma'
import { createPaymentSchema } from '../../main/schemas/payment/create-payment-schema'

export class PaymentController {
  constructor() {
  }
  async createLoan(
    request: HttpRequest<( typeof createPaymentSchema._output)>,
  ): Promise<HttpResponse> {
    const body = request.body!
    var user = request.auth!.user!

    const loan = await prisma.loan.findUnique({
      where: {
        id: body.loanId,
      }
    })

    if (!loan) {
      return badRequest(new Error('Loan not found'))
    }

    if (loan.user_id != user.id) {
      return badRequest(new Error('Loan does not belong to user'))
    }

    if(loan.status != 'APPROVED') {
      return badRequest(new Error('Loan is not approved'))
    }

    if(loan.remaining_balance < body.amountPaid) {
      return badRequest(new Error('Amount paid is greater than remaining balance'))
    }

    const payment = await prisma.payment.create({
      data: {
        loan_id: body.loanId,
        amount_paid: body.amountPaid,
        payment_date: new Date(body.paymentDate),
      }
    })

    loan.remaining_balance -= body.amountPaid
    loan.total_paid += body.amountPaid

    await prisma.loan.update({
      where: {
        id: body.loanId,
      },
      data: {
        remaining_balance: loan.remaining_balance,
        total_paid: loan.total_paid,
      }
    })

    return ok(payment)
  }

}