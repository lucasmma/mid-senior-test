import { Router } from 'express'
import { adaptRoute } from '../route-adapters/controller-route-adapter'
import { idSchema } from '../schemas/id-schema'
import { authorization } from '../middlewares/auth'
import { makePaymentController } from '../factories/payment-factory'
import { createPaymentSchema } from '../schemas/payment/create-payment-schema'
import { paginationSchema } from '../schemas/pagination-schema'

/**
 * @openapi
 * tags:
 *   name: Payments
 *   description: API for payments in the system
 * 
 * components:
 *   schemas:
 *     Payment:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "cl1j9c9f0g2b0a0h6jj0"
 *         loan_id:
 *           type: string
 *           example: "cl1j9c9f0g2b0a0h6jj0"
 *         amount_paid:
 *           type: number
 *           example: 1000
 *         payment_date:
 *           type: string
 *           format: date-time
 *           example: "2024-12-30T00:00:00Z"
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2024-12-30T00:00:00Z"
 *         updated_at:
 *           type: string
 *           format: date-time
 *           example: "2024-12-30T00:00:00Z"
 * 
 * /payments:
 *   post:
 *     tags:
 *       - Payments
 *     summary: Create a payment
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePayment'
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Payment'
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Server Error
 * 
 * /loans/{id}/payments:
 *   get:
 *     tags:
 *       - Payments
 *     summary: List payments
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           $ref: '#/components/parameters/IdParameter'
 *         description: Loan ID
 *       - $ref: '#/components/parameters/SkipParameter'
 *       - $ref: '#/components/parameters/LimitParameter'
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Payment'
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 *       500:
 *         description: Server Error
 */



export default (router: Router): void => {
  const baseRoute = '/payments'
  const controller = makePaymentController()

  router.post(baseRoute, authorization('USER'), adaptRoute(controller, controller.createPayment, { body: createPaymentSchema }))
  router.get('/loans/:id/payments', authorization('USER'), adaptRoute(controller, controller.listPayment, { param: idSchema, query: paginationSchema }))
}
