import { PaymentController } from './payment-controller'
import { HttpRequest, HttpResponse } from '../protocols'
import { badRequest, notFound, ok } from '../helpers/http-helper'
import prisma from '../../main/config/prisma'
import { LoanRepository } from '../../repository/loan-repository'
import { makeLoanCache } from '../../main/factories/cache/loan-cache-factory'
import { redis } from '../../main/config/redis'
import { CacheProtocol } from '../../data/protocols/cache'

class MockCacheAdapter implements CacheProtocol {
  async get<T>(key: string): Promise<T | null> {
    return null
  }
  async set<T>(key: string, value: T, duration?: number): Promise<void> {
    return
  }
  async delete(key: string): Promise<void> {
    return
  }
  async getMany<T>(): Promise<T[] | null> {
    return null
  }
}


jest.mock('../../main/config/prisma', () => ({
  payment: {
    create: jest.fn(),
    findMany: jest.fn(),
  },
  loan: {
    findUnique: jest.fn(),
  },
}))

jest.mock('../../repository/loan-repository')

const mockUser = {
  id: 'user1',
  email: 'testemail',
  name: 'Test User',
  role: 'USER',
  documentNumber: '12345678900',
  createdAt: new Date(),
  updatedAt: new Date(),
}

describe('PaymentController', () => {
  let paymentController: PaymentController
  let loanRepository: jest.Mocked<LoanRepository>
  let paymentCreate = prisma.payment.create as jest.Mock
  let paymentFindMany = prisma.payment.findMany as jest.Mock
  let loanFindUnique = prisma.loan.findUnique as jest.Mock

  afterAll(async () => {
    await redis.quit();
  })


  beforeEach(() => {
    const cacheAdapter = new MockCacheAdapter()
    loanRepository = new LoanRepository(cacheAdapter) as jest.Mocked<LoanRepository>
    paymentController = new PaymentController(loanRepository)
    jest.clearAllMocks()
  })

  describe('createPayment', () => {
    it('should return bad request if loan is not found', async () => {
      const request = {
        body: { loanId: 'loan1', amountPaid: 100, paymentDate: '2025-03-08' },
        auth: { user: { id: 'user1' } },
      } as HttpRequest

      loanRepository.getLoanById.mockResolvedValue(null)

      const response = await paymentController.createPayment(request)

      expect(response).toEqual(notFound(new Error('Loan not found')))
    })

    it('should return bad request if loan does not belong to user', async () => {
      const request = {
        body: { loanId: 'loan1', amountPaid: 100, paymentDate: '2025-03-08' },
        auth: { user: mockUser },
      } as HttpRequest

      loanRepository.getLoanById.mockResolvedValue({ id: '123', user_id: 'user2', status: 'APPROVED', remaining_balance: 500, total_paid: 200, amount: 100000, duration: 12, purpose: 'Test', created_at: new Date(), updatedAt: new Date() })

      const response = await paymentController.createPayment(request)

      expect(response).toEqual(badRequest(new Error('Loan does not belong to user')))
    })

    it('should return bad request if loan is not approved', async () => {
      const request = {
        body: { loanId: 'loan1', amountPaid: 100, paymentDate: '2025-03-08' },
        auth: { user: { id: 'user1' } },
      } as HttpRequest

      loanRepository.getLoanById.mockResolvedValue({ id: '123', user_id: 'user1', status: 'PENDING', remaining_balance: 500, total_paid: 200, amount: 100000, duration: 12, purpose: 'Test', created_at: new Date(), updatedAt: new Date() })

      const response = await paymentController.createPayment(request)

      expect(response).toEqual(badRequest(new Error('Loan is not approved')))
    })

    it('should create a payment successfully', async () => {
      const request = {
        body: { loanId: 'loan1', amountPaid: 100, paymentDate: '2025-03-08' },
        auth: { user: mockUser },
      } as HttpRequest

      loanRepository.getLoanById.mockResolvedValue({ id: '123', user_id: 'user1', status: 'APPROVED', remaining_balance: 500, total_paid: 200, amount: 100000, duration: 12, purpose: 'Test', created_at: new Date(), updatedAt: new Date() })

      paymentCreate.mockResolvedValue({
        id: 'payment1',
        loan_id: 'loan1',
        amount_paid: 100,
        payment_date: '2025-03-08',
      })

      const response = await paymentController.createPayment(request)

      expect(response).toEqual(ok({
        id: 'payment1',
        loan_id: 'loan1',
        amount_paid: 100,
        payment_date: '2025-03-08',
      }))
    })
  })

  describe('listPayment', () => {
    it('should return bad request if loan is not found', async () => {
      const request = {
        auth: { user: mockUser },
        params: { id: 'loan1' }
      } as HttpRequest

      loanFindUnique.mockResolvedValue(null)

      const response = await paymentController.listPayment(request)

      expect(response).toEqual(notFound(new Error('Loan not found')))
    })

    it('should return payments list if loan exists', async () => {
      const request = {
        params: { id: 'loan1' },
        auth: { user: mockUser },
        query: { skip: 0, take: 10 },
      } as HttpRequest

      loanFindUnique.mockResolvedValue({ id: 'loan1', user_id: 'user1' })
      paymentFindMany.mockResolvedValue([{ id: 'payment1', loan_id: 'loan1', amount_paid: 100, payment_date: '2025-03-08' }])

      const response = await paymentController.listPayment(request)

      expect(response).toEqual(ok([{ id: 'payment1', loan_id: 'loan1', amount_paid: 100, payment_date: '2025-03-08' }]))
    })
  })
})