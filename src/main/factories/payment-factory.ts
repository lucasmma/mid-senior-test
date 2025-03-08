import { PaymentController } from '../../presentation/controllers/payment-controller'
import { LoanRepository } from '../../repository/loan-repository'
import { makeLoanCache } from './cache/loan-cache-factory'

export function makePaymentController(): PaymentController {
  const loanCache = makeLoanCache()
  const loanRepository = new LoanRepository(loanCache)
  return new PaymentController(loanRepository)
}