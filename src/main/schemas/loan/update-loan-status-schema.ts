import { z } from 'zod'

/**
 * @openapi
 * components:
 *   schemas:
 *     UpdateLoanStatus:
 *       type: object
 *       properties:
 *          status:
 *            type: string
 *            enum: [APPROVED, REJECTED]
 * 
 *       required:
 *        - status
 *  
 *       additionalProperties: false
 *       description: |
 *          Schema for updating status of one loan.
 *          - `status`: The amount of the loan.
 *       example:
 *         status: APPROVED
 */
export const updateLoanStatusSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED']),
}).strict();