import { PaymentController } from '../../presentation/controllers/payment-controller'
import { LoanRepository } from '../../repository/loan-repository'

export function makePaymentController(): PaymentController {
  const loanRepository = new LoanRepository()
  return new PaymentController(loanRepository)
}