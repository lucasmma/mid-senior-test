import { z } from "zod";

/**
 * @openapi
 * components:
 *   parameters:
 *     SkipParameter:
 *       in: query
 *       name: skip
 *       description: The number of items to skip.
 *       schema:
 *         type: integer
 *         minimum: 0
 *         example: 1
 *     
 *     LimitParameter:
 *       in: query
 *       name: take
 *       description: The number of items per request.
 *       schema:
 *         type: integer
 *         minimum: 1
 *         example: 10
 */

export const paginationSchema = z.object({
  skip: z.coerce.number().int().min(0).optional().transform(value => value ? Number(value) : undefined),
  take: z.coerce.number().int().positive().optional().transform(value => value ? Number(value) : undefined),
}).strict();