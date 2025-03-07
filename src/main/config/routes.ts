import { Express, Router } from 'express'
import userRoutes from '../routes/user-routes'

export default (router: Router): void => {
  userRoutes(router)
}