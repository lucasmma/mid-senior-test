import { Router } from 'express'
import { adaptRoute } from '../route-adapters/controller-route-adapter'
import { makeLoanController } from '../factories/loan-factory'
import { createLoanSchema } from '../schemas/loan/create-loan-schema'
import { authorization } from '../middlewares/auth'

export default (router: Router): void => {
  const baseRoute = '/loans'
  const controller = makeLoanController()

  router.post(baseRoute, authorization('USER'), adaptRoute(controller, controller.createLoan, { body: createLoanSchema }))
}
