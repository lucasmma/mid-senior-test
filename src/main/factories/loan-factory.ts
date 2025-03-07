import { LoanController } from '../../presentation/controllers/loan-controller'

export function makeLoanController(): LoanController {
  return new LoanController()
}