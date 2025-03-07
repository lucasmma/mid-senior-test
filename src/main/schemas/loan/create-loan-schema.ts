import { z } from 'zod'

/**
 * @openapi
 * components:
 *   schemas:
 *     CreateLoan:
 *       type: object
 *       properties:
 *          amount:
 *            type: number
 *            example: 10
 *          purpose:
 *            type: string
 *            example: "Buy a house"
 *          duration:
 *            type: number
 *            example: 48
 *       required:
 *        - amount
 *        - purpose
 *        - duration
 *  
 *       additionalProperties: false
 *       description: |
 *          Schema for creating a new loan.
 *          - `amount`: The amount of the loan.
 *          - `purpose`: The purpose of the loan.
 *          - `duration`: The duration of the loan.
 *       example:
 *         amount: 10
 *         purpose: "Buy a house"
 *         duration: 48
 */
export const createLoanSchema = z.object({
  amount: z.number(),
  purpose: z.string(),
  duration: z.number().int(),
});