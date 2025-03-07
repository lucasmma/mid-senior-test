import { PaymentController } from '../../presentation/controllers/payment-controller'

export function makePaymentController(): PaymentController {
  return new PaymentController()
}