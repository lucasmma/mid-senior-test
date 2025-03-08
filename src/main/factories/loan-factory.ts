import { LoanController } from '../../presentation/controllers/loan-controller'
import { LoanRepository } from '../../repository/loan-repository'
import { makeLoanCache } from './cache/loan-cache-factory'

export function makeLoanController(): LoanController {
  const loanCache = makeLoanCache()
  const loanRepository = new LoanRepository(loanCache)
  return new LoanController(loanRepository)
}