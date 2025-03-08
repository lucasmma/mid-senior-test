import { PrismaClient } from '@prisma/client'
import { BcryptAdapter } from '../src/infra/criptography/bcrypt-adapter'

const prisma = new PrismaClient()

async function main() {
  const PASSWORD = '123456'
  var bcryptAdapter = new BcryptAdapter(10)
  const passwordHash = await bcryptAdapter.encrypt(PASSWORD)

  // Criando usuários
  const admin = await prisma.user.upsert({
    where: { email: 'admin@mail.com' },
    update: {},
    create: {
      email: 'admin@mail.com',
      name: 'Admin User',
      password: passwordHash,
      role: 'ADMIN',
    },
  })

  const user = await prisma.user.upsert({
    where: { email: 'user@mail.com' },
    update: {},
    create: {
      email: 'user@mail.com',
      name: 'Regular User',
      password: passwordHash,
      role: 'USER',
    },
  })

  // Criando empréstimos
  const loan1 = await prisma.loan.create({
    data: {
      user_id: user.id,
      amount: 5000,
      purpose: 'Business Expansion',
      duration: 12,
      status: 'APPROVED',
      total_paid: 1000,
      remaining_balance: 4000,
    },
  })

  const loan2 = await prisma.loan.create({
    data: {
      user_id: user.id,
      amount: 3000,
      purpose: 'Car Repair',
      duration: 6,
      status: 'PENDING',
      total_paid: 0,
      remaining_balance: 3000,
    },
  })

  // Criando pagamentos
  await prisma.payment.create({
    data: {
      loan_id: loan1.id,
      amount_paid: 500,
      payment_date: new Date(),
    },
  })
  
  await prisma.payment.create({
    data: {
      loan_id: loan1.id,
      amount_paid: 500,
      payment_date: new Date(),
    },
  })

  console.log('Seed completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
