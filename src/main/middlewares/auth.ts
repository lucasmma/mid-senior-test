import { adaptAuthRoute } from '../route-adapters/auth-route-adapter'
import env from '../config/env'
import { JwtAdapter } from '../../infra/auth/jwt-adapter'

export const authorization = (role?: 'USER' | 'ADMIN') => {
  var jwtAdapter = new JwtAdapter(env.JWT_SECRET)
  return adaptAuthRoute(jwtAdapter, role)
}
