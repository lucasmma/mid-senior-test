import { LoanController } from '../../presentation/controllers/loan-controller'
import { LoanRepository } from '../../repository/loan-repository'

export function makeLoanController(): LoanController {
  const loanRepository = new LoanRepository
  return new LoanController(loanRepository)
}