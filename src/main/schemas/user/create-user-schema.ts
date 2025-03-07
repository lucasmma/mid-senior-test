import { z } from 'zod'

/**
 * @openapi
 * components:
 *   schemas:
 *     CreateUser:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: "John Doe"
 *         email:
 *           type: string
 *           example: "johndoe@example.com"
 *         password:
 *           type: string
 *           example: "password123"
 *         passwordConfirmation:
 *           type: string
 *           example: "password123"
 *       required:
 *         - name
 *         - email
 *         - password
 *         - passwordConfirmation
 *       additionalProperties: false
 *       description: |
 *         Schema for creating a new user account.
 *         - `name`: Full name of the user.
 *         - `email`: Email address of the user, must be a valid email format.
 *         - `password`: Password for the account, at least 6 characters.
 *         - `passwordConfirmation`: Confirmation of the password, must match `password`.
 *       example:
 *         name: "John Doe"
 *         email: "johndoe@example.com"
 *         password: "password123"
 *         passwordConfirmation: "password123"
 */
export const createUserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  passwordConfirmation: z.string().min(6)
}).strict().refine((data) => data.password === data.passwordConfirmation, {
  message: 'Passwords do not match',
  path: ['passwordConfirmation'], // Path should match the field you're validating
});