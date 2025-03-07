import { z } from 'zod'

/**
 * @openapi
 * components:
 *   schemas:
 *     CreatePayment:
 *       type: object
 *       properties:
 *          loanId:
 *            type: string
 *            example: "cl1j9c9f0g2b0a0h6jj0"
 *          amountPaid:
 *            type: number
 *            example: 10
 *          paymentDate:
 *            type: string
 *            format: date-time
 *       required:
 *        - loanId
 *        - amountPaid
 *        - paymentDate
 *  
 *       additionalProperties: false
 *       description: |
 *          Schema for creating a new payment for specific loan
 *            - `loanId`: The id of the loan.
 *            - `amountPaid`: The amount paid for the loan.
 *            - `paymentDate`: The date of the payment.
 *       example:
 *          loanId: 
 *          amountPaid: 10
 *          paymentDate: "2024-12-30T00:00:00Z"
 */
export const createPaymentSchema = z.object({
  loanId: z.string().cuid(),
  amountPaid: z.number().refine(value => value >= 0, {
    message: 'Amount paid must be greater than or equal to 0',
  }),
  paymentDate: z.date(),
});