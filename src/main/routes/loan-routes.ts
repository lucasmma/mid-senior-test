import { Router } from 'express'
import { adaptRoute } from '../route-adapters/controller-route-adapter'
import { makeLoanController } from '../factories/loan-factory'
import { createLoanSchema } from '../schemas/loan/create-loan-schema'
import { authorization } from '../middlewares/auth'
import { idSchema } from '../schemas/id-schema'
import { updateLoanStatusSchema } from '../schemas/loan/update-loan-status-schema'
import { paginationSchema } from '../schemas/pagination-schema'

/**
 * @openapi
 * components:
 *   schemas:
 *     Loan:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "cl1j9c9f0g2b0a0h6jj0"
 *         amount:
 *           type: number
 *           example: 1000
 *         purpose:
 *           type: string
 *           example: "Business"
 *         duration:
 *           type: number
 *           example: 12
 *         user_id:
 *           type: string
 *           example: "cl1j9c9f0g2b0a0h6jj0"
 *         status:
 *           type: string
 *           enum: [PENDING, APPROVED, REJECTED]
 *           example: "PENDING"
 *         total_paid:
 *           type: number
 *           example: 0
 *         remaining_balance:
 *           type: number
 *           example: 1000
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2024-12-30T00:00:00Z"
 *         updated_at:
 *           type: string
 *           format: date-time
 *           example: "2024-12-30T00:00:00Z"
 * 
 * tags:
 *   - name: Loans
 *     description: API for loans in the system
 * 
 * /loans:
 *   post:
 *     tags:
 *       - Loans
 *     summary: Create a loan
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateLoan'
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Loan'
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Server Error
 * 
 *   get:
 *     tags:
 *       - Loans
 *     summary: List loans
 *     security:
 *       - BearerAuth: []
 *     parameters:
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
 *                 $ref: '#/components/schemas/Loan'
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Server Error
 * 
 * /loans/{id}:
 *   get:
 *     tags:
 *       - Loans
 *     summary: Get loan
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Loan ID
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Loan'
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not Found
 *       500:
 *         description: Server Error
 * 
 * /loans/{id}/status:
 *   patch:
 *     tags:
 *       - Loans
 *     summary: Update loan status
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Loan ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateLoanStatus'
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Loan'
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 *       500:
 *         description: Server Error
 */

export default (router: Router): void => {
  const baseRoute = '/loans'
  const controller = makeLoanController()

  router.post(baseRoute, authorization('USER'), adaptRoute(controller, controller.createLoan, { body: createLoanSchema }))
  router.get(baseRoute, authorization('USER'), adaptRoute(controller, controller.listLoans, { query: paginationSchema }))
  router.get(baseRoute + '/:id', authorization('USER'), adaptRoute(controller, controller.listLoan, { param: idSchema }))
  router.patch(baseRoute + '/:id/status', authorization('ADMIN'), adaptRoute(controller, controller.updateStatus, { body: updateLoanStatusSchema , param: idSchema }))
}
