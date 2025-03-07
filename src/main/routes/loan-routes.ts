import { Router } from 'express'
import { adaptRoute } from '../route-adapters/controller-route-adapter'
import { makeLoanController } from '../factories/loan-factory'
import { createLoanSchema } from '../schemas/loan/create-loan-schema'
import { authorization } from '../middlewares/auth'
import { idSchema } from '../schemas/id-schema'
import { updateLoanStatusSchema } from '../schemas/loan/update-loan-status-schema'

export default (router: Router): void => {
  const baseRoute = '/loans'
  const controller = makeLoanController()

  router.post(baseRoute, authorization('USER'), adaptRoute(controller, controller.createLoan, { body: createLoanSchema }))
  router.get(baseRoute, authorization('USER'), adaptRoute(controller, controller.listLoans))
  router.get(baseRoute + '/:id', authorization('USER'), adaptRoute(controller, controller.listLoan, { param: idSchema }))
  router.patch(baseRoute + '/:id/status', authorization('ADMIN'), adaptRoute(controller, controller.updateStatus, { body: updateLoanStatusSchema , param: idSchema }))
}
