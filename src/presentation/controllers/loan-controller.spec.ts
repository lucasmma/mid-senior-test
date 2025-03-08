import { LoanController } from './loan-controller'
import { HttpRequest, HttpResponse } from '../protocols'
import { badRequest, ok, unauthorized } from '../helpers/http-helper'
import prisma from '../../main/config/prisma'
import { LoanRepository } from '../../repository/loan-repository'
import { makeLoanCache } from '../../main/factories/cache/loan-cache-factory'

jest.mock('../../main/config/prisma', () => ({
  loan: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
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

describe('LoanController', () => {
  let loanController: LoanController
  let loanRepository: jest.Mocked<LoanRepository>
  let loanCreate = prisma.loan.create as jest.Mock
  let loanFindMany = prisma.loan.findMany as jest.Mock
  let loanFindUnique = prisma.loan.findUnique as jest.Mock
  let loanUpdate = prisma.loan.update as jest.Mock

  beforeEach(() => {
    loanRepository = new LoanRepository(makeLoanCache()) as jest.Mocked<LoanRepository>
    loanController = new LoanController(loanRepository)
    jest.clearAllMocks()
  })

  describe('createLoan', () => {
    it('should create a loan successfully', async () => {
      const request = {
        body: { amount: 5000, purpose: 'Business', duration: 12 },
        auth: { user: mockUser },
      } as HttpRequest

      loanRepository.createLoan.mockResolvedValue({ id: '123', user_id: 'user1', status: 'PENDING', remaining_balance: 500, total_paid: 200, amount: 100000, duration: 12, purpose: 'Test', created_at: new Date(), updatedAt: new Date() })

      const response = await loanController.createLoan(request)
      expect(response).toEqual(ok({ id: '123', user_id: 'user1', status: 'PENDING', remaining_balance: 500, total_paid: 200, amount: 100000, duration: 12, purpose: 'Test', created_at: new Date(), updatedAt: new Date() }))
    })
  })

  describe('listLoans', () => {
    it('should return a list of loans', async () => {
      const request = { auth: { user: mockUser }, query: { skip: 0, take: 10 } } as HttpRequest

      loanFindMany.mockResolvedValue([
        { id: 'loan1', amount: 5000, purpose: 'Business', duration: 12, user_id: 'user1' },
      ])

      const response = await loanController.listLoans(request)
      expect(response).toEqual(ok([
        { id: 'loan1', amount: 5000, purpose: 'Business', duration: 12, user_id: 'user1' },
      ]))
    })
  })

  describe('listLoan', () => {
    it('should return bad request if loan is not found', async () => {
      const request = { auth: { user: mockUser }, params: { id: 'loan1' } } as HttpRequest
      loanRepository.getLoanById.mockResolvedValue(null)

      const response = await loanController.listLoan(request)
      expect(response).toEqual(badRequest(new Error('Loan not found')))
    })

    it('should return unauthorized if loan is not from the user and user is not admin', async () => {
      const request = { auth: { user: mockUser }, params: { id: 'loan2' } } as HttpRequest
      loanRepository.getLoanById.mockResolvedValue({ id: 'loan2', user_id: 'user2', status: 'PENDING', remaining_balance: 500, total_paid: 200, amount: 100000, duration: 12, purpose: 'Test', created_at: new Date(), updatedAt: new Date() })

      const response = await loanController.listLoan(request)
      expect(response).toEqual(unauthorized())
    })


  })

  describe('updateStatus', () => {
    it('should return bad request if loan is already processed', async () => {
      const request = {
        auth: { user: mockUser },
        params: { id: 'loan1' },
        body: { status: 'APPROVED' },
      } as HttpRequest

      loanRepository.getLoanById.mockResolvedValue({ id: '123', user_id: 'user2', status: 'APPROVED', remaining_balance: 500, total_paid: 200, amount: 100000, duration: 12, purpose: 'Test', created_at: new Date(), updatedAt: new Date() })

      const response = await loanController.updateStatus(request)
      expect(response).toEqual(badRequest(new Error('Loan already processed')))
    })
  })
})
