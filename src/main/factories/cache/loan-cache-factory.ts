import { CacheAdapter } from '../../../infra/cache/cache-adapter'
import { redis } from '../../config/redis'

export function makeLoanCache(): CacheAdapter {
  const loanCache = new CacheAdapter(redis, 'loan')
  return loanCache
}