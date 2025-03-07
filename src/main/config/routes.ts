import { Express, Router } from 'express'
import userRoutes from '../routes/user-routes'
import loanRoutes from '../routes/loan-routes'

export default (router: Router): void => {
  userRoutes(router)
  loanRoutes(router)
}