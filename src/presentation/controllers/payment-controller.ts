import { HttpRequest, HttpResponse } from '../protocols'
import { badRequest, notFound, ok } from '../helpers/http-helper'
import prisma from '../../main/config/prisma'
import { createPaymentSchema } from '../../main/schemas/payment/create-payment-schema'
import { paginationSchema } from '../../main/schemas/pagination-schema'
import { LoanRepository } from '../../repository/loan-repository'
import { transactionErrorCounter } from '../../main/config/registry-metrics'

export class PaymentController {
  constructor(private readonly loanRepository: LoanRepository) {
    this.loanRepository = loanRepository
  }
  async createPayment(
    request: HttpRequest<( typeof createPaymentSchema._output)>,
  ): Promise<HttpResponse> {
    const body = request.body!
    var user = request.auth!.user!

    const loan = await this.loanRepository.getLoanById(body.loanId)

    if (!loan) {
      transactionErrorCounter.inc({ error_type: 'loan_not_found', method: 'createPayment'});
      return notFound(new Error('Loan not found'))
    }

    if (loan.user_id != user.id) {
      transactionErrorCounter.inc({ error_type: 'loan_doesnt_belong_to_user', method: 'createPayment'});
      return badRequest(new Error('Loan does not belong to user'))
    }
    
    if(loan.status != 'APPROVED') {
      return badRequest(new Error('Loan is not approved'))
    }
    
    if(loan.remaining_balance < body.amountPaid) {
      transactionErrorCounter.inc({ error_type: 'amount_is_greater', method: 'createPayment'});
      return badRequest(new Error('Amount paid is greater than remaining balance'))
    }

    const payment = await prisma.payment.create({
      data: {
        loan_id: body.loanId,
        amount_paid: body.amountPaid,
        payment_date: body.paymentDate,
      }
    })

    loan.remaining_balance -= body.amountPaid
    loan.total_paid += body.amountPaid

    await this.loanRepository.updateLoan(body.loanId, {
      remaining_balance: loan.remaining_balance,
      total_paid: loan.total_paid,
    })

    return ok(payment)
  }

  async listPayment(
    request: HttpRequest<null, (typeof paginationSchema._output)>,
  ): Promise<HttpResponse> {
    var user = request.auth!.user!
    const { id } = request.params!

    const loan = await prisma.loan.findUnique({
      where: {
        id: id
      }
    })

    if(!loan) {
      transactionErrorCounter.inc({ error_type: 'loan_not_found', method: 'listPayment'});
      return notFound(new Error('Loan not found'))
    }

    if(user.role == 'USER' && loan.user_id !== user.id) {
      transactionErrorCounter.inc({ error_type: 'loan_doesnt_belong_to_user', method: 'listPayment'});
      return badRequest(new Error('Loan does not belong to user'))
    }

    const payments = await prisma.payment.findMany({
      where: {
        loan_id: id
      },
      skip: request.query?.skip,
      take: request.query?.take,
    })

    return ok(payments)
  }

}