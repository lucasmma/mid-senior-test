import { Router } from 'express'
import { adaptRoute } from '../route-adapters/controller-route-adapter'
import { idSchema } from '../schemas/id-schema'
import { authorization } from '../middlewares/auth'
import { makePaymentController } from '../factories/payment-factory'
import { createPaymentSchema } from '../schemas/payment/create-payment-schema'


export default (router: Router): void => {
  const baseRoute = '/payments'
  const controller = makePaymentController()

  router.post(baseRoute, authorization('USER'), adaptRoute(controller, controller.createLoan, { body: createPaymentSchema }))
  router.get('/loans/:id/payments', authorization('USER'), adaptRoute(controller, controller.listPayment, { param: idSchema }))
}
