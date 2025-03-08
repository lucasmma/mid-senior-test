import { z } from "zod";

/**
 * @openapi
 * components:
 *   schemas:
 *     Pagination:
 *       type: object
 *       properties:
 *         skip:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *         limit:
 *           type: integer
 *           minimum: 1
 *           example: 10
 *       required:
 *         - skip
 *         - limit
 *       additionalProperties: false
 *       description: |
 *         Schema for handling pagination.
 *         - `skip`: The number of items to skip.
 *         - `limit`: The number of items per request.
 *       example:
 *         page: 1
 *         limit: 10
 */

export const paginationSchema = z.object({
  skip: z.coerce.number().int().min(0).optional().transform(value => value ? Number(value) : undefined),
  take: z.coerce.number().int().positive().optional().transform(value => value ? Number(value) : undefined),
}).strict();