import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { HTCondition, HTStatus } from '../generated/prisma/client'

async function main() {
  console.log('--- STARTING RICH SEEDING ---')

  // 1. Create/Upsert Admin/Operators
  const adminPassword = await bcrypt.hash('admin123', 10)

  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@htcare.com' },
    update: {},
    create: {
      email: 'admin@htcare.com',
      name: 'Super Administrator',
      password: adminPassword,
      role: 'SUPERADMIN'
    }
  })

  const operator1 = await prisma.user.upsert({
    where: { email: 'operator1@htcare.com' },
    update: {},
    create: {
      email: 'operator1@htcare.com',
      name: 'Operator Budi',
      password: adminPassword,
      role: 'OPERATOR'
    }
  })

  console.log('Users (Admin/Operators) seeded.')

  // 2. Create/Upsert Multiple Borrowers
  const borrowerPassword = await bcrypt.hash('borrower123', 10)

  const borrowersData = [
    {
      code: 'P-001',
      name: 'Ahmad Syarif',
      dept: 'Keamanan (Security)',
      email: 'borrower@htcare.com'
    },
    {
      code: 'P-002',
      name: 'Budi Santoso',
      dept: 'Operasional Lapangan',
      email: 'budi.borrower@htcare.com'
    },
    {
      code: 'P-003',
      name: 'Citra Lestari',
      dept: 'Logistik & Gudang',
      email: 'citra.borrower@htcare.com'
    },
    {
      code: 'P-004',
      name: 'Dedi Kurniawan',
      dept: 'Keamanan (Security)',
      email: 'dedi.borrower@htcare.com'
    },
    {
      code: 'P-005',
      name: 'Eka Wijaya',
      dept: 'Event Management',
      email: 'eka.borrower@htcare.com'
    }
  ]

  const borrowers = []
  for (const b of borrowersData) {
    const seeded = await prisma.borrower.upsert({
      where: { email: b.email },
      update: {},
      create: {
        borrower_code: b.code,
        barcode: b.code,
        full_name: b.name,
        department: b.dept,
        email: b.email,
        password: borrowerPassword
      }
    })
    borrowers.push(seeded)
  }
  console.log(`${borrowers.length} Borrowers seeded.`)

  // 3. Create/Upsert Multiple HT Items
  const htItemsData: {
    code: string
    brand: string
    condition: HTCondition
    status: HTStatus
  }[] = [
    { code: 'HT-001', brand: 'Baofeng UV-5R', condition: HTCondition.GOOD, status: HTStatus.BORROWED },
    { code: 'HT-002', brand: 'Motorola GP328', condition: HTCondition.GOOD, status: HTStatus.AVAILABLE },
    { code: 'HT-003', brand: 'Baofeng UV-5R', condition: HTCondition.LIGHT_DAMAGE, status: HTStatus.AVAILABLE },
    { code: 'HT-004', brand: 'Motorola GP328', condition: HTCondition.HEAVY_DAMAGE, status: HTStatus.AVAILABLE },
    { code: 'HT-005', brand: 'Baofeng UV-5R', condition: HTCondition.GOOD, status: HTStatus.BORROWED },
    { code: 'HT-006', brand: 'Alinco DJ-W10', condition: HTCondition.GOOD, status: HTStatus.AVAILABLE },
    { code: 'HT-007', brand: 'Alinco DJ-W10', condition: HTCondition.GOOD, status: HTStatus.BORROWED },
    { code: 'HT-008', brand: 'Motorola GP328', condition: HTCondition.LOST, status: HTStatus.AVAILABLE },
    { code: 'HT-009', brand: 'Baofeng UV-5R', condition: HTCondition.GOOD, status: HTStatus.AVAILABLE },
    { code: 'HT-010', brand: 'Alinco DJ-W10', condition: HTCondition.GOOD, status: HTStatus.AVAILABLE }
  ]

  const htItems = []
  for (const item of htItemsData) {
    const seeded = await prisma.hT_Item.upsert({
      where: { ht_code: item.code },
      update: {
        condition: item.condition,
        status: item.status
      },
      create: {
        ht_code: item.code,
        barcode: item.code,
        brand_type: item.brand,
        condition: item.condition,
        status: item.status
      }
    })
    htItems.push(seeded)
  }
  console.log(`${htItems.length} HT Items seeded.`)

  // Clear existing transactions to build clean history
  await prisma.transaction.deleteMany({})

  // 4. Create sample transactions (historical and active) across the last 6 months
  const now = new Date()

  // Helper function to create date offsets
  const getDateOffset = (monthsAgo: number, daysAgo: number, hoursOffset = 0) => {
    const d = new Date()
    d.setMonth(now.getMonth() - monthsAgo)
    d.setDate(now.getDate() - daysAgo)
    d.setHours(now.getHours() - hoursOffset)
    return d
  }

  // 5 months ago: 3 loans
  await prisma.transaction.createMany({
    data: [
      {
        ht_id: htItems[0].id,
        borrower_id: borrowers[0].id, // Ahmad Syarif (P-001)
        borrow_time: getDateOffset(5, 10, 4),
        return_time: getDateOffset(5, 10),
        status: 'RETURNED',
        operator_id: superAdmin.id
      },
      {
        ht_id: htItems[1].id,
        borrower_id: borrowers[1].id, // Budi Santoso
        borrow_time: getDateOffset(5, 8, 6),
        return_time: getDateOffset(5, 8),
        status: 'RETURNED',
        operator_id: superAdmin.id
      },
      {
        ht_id: htItems[2].id,
        borrower_id: borrowers[2].id, // Citra
        borrow_time: getDateOffset(5, 2, 8),
        return_time: getDateOffset(5, 2),
        status: 'RETURNED',
        operator_id: superAdmin.id
      }
    ]
  })

  // 4 months ago: 4 loans
  await prisma.transaction.createMany({
    data: [
      {
        ht_id: htItems[3].id,
        borrower_id: borrowers[0].id, // Ahmad Syarif (P-001)
        borrow_time: getDateOffset(4, 20, 5),
        return_time: getDateOffset(4, 20),
        status: 'RETURNED',
        operator_id: superAdmin.id
      },
      {
        ht_id: htItems[4].id,
        borrower_id: borrowers[3].id, // Dedi
        borrow_time: getDateOffset(4, 15, 6),
        return_time: getDateOffset(4, 15),
        status: 'RETURNED',
        operator_id: superAdmin.id
      },
      {
        ht_id: htItems[5].id,
        borrower_id: borrowers[4].id, // Eka
        borrow_time: getDateOffset(4, 12, 10),
        return_time: getDateOffset(4, 12),
        status: 'RETURNED',
        operator_id: superAdmin.id
      },
      {
        ht_id: htItems[0].id,
        borrower_id: borrowers[1].id, // Budi
        borrow_time: getDateOffset(4, 5, 2),
        return_time: getDateOffset(4, 5),
        status: 'RETURNED',
        operator_id: operator1.id
      }
    ]
  })

  // 3 months ago: 2 loans
  await prisma.transaction.createMany({
    data: [
      {
        ht_id: htItems[1].id,
        borrower_id: borrowers[0].id, // Ahmad Syarif (P-001)
        borrow_time: getDateOffset(3, 14, 8),
        return_time: getDateOffset(3, 14),
        status: 'RETURNED',
        operator_id: operator1.id
      },
      {
        ht_id: htItems[2].id,
        borrower_id: borrowers[2].id, // Citra
        borrow_time: getDateOffset(3, 3, 5),
        return_time: getDateOffset(3, 3),
        status: 'RETURNED',
        operator_id: superAdmin.id
      }
    ]
  })

  // 2 months ago: 5 loans
  await prisma.transaction.createMany({
    data: [
      {
        ht_id: htItems[6].id,
        borrower_id: borrowers[0].id, // Ahmad Syarif (P-001)
        borrow_time: getDateOffset(2, 22, 6),
        return_time: getDateOffset(2, 22),
        status: 'RETURNED',
        operator_id: superAdmin.id
      },
      {
        ht_id: htItems[7].id,
        borrower_id: borrowers[1].id, // Budi
        borrow_time: getDateOffset(2, 18, 5),
        return_time: getDateOffset(2, 18),
        status: 'RETURNED',
        operator_id: superAdmin.id
      },
      {
        ht_id: htItems[8].id,
        borrower_id: borrowers[3].id, // Dedi
        borrow_time: getDateOffset(2, 12, 4),
        return_time: getDateOffset(2, 12),
        status: 'RETURNED',
        operator_id: operator1.id
      },
      {
        ht_id: htItems[9].id,
        borrower_id: borrowers[4].id, // Eka
        borrow_time: getDateOffset(2, 7, 3),
        return_time: getDateOffset(2, 7),
        status: 'RETURNED',
        operator_id: superAdmin.id
      },
      {
        ht_id: htItems[0].id,
        borrower_id: borrowers[0].id, // Ahmad Syarif (P-001)
        borrow_time: getDateOffset(2, 2, 7),
        return_time: getDateOffset(2, 2),
        status: 'RETURNED',
        operator_id: superAdmin.id
      }
    ]
  })

  // 1 month ago: 3 loans
  await prisma.transaction.createMany({
    data: [
      {
        ht_id: htItems[1].id,
        borrower_id: borrowers[2].id, // Citra
        borrow_time: getDateOffset(1, 15, 4),
        return_time: getDateOffset(1, 15),
        status: 'RETURNED',
        operator_id: superAdmin.id
      },
      {
        ht_id: htItems[2].id,
        borrower_id: borrowers[0].id, // Ahmad Syarif (P-001)
        borrow_time: getDateOffset(1, 8, 9),
        return_time: getDateOffset(1, 8),
        status: 'RETURNED',
        operator_id: operator1.id
      },
      {
        ht_id: htItems[3].id,
        borrower_id: borrowers[1].id, // Budi
        borrow_time: getDateOffset(1, 4, 3),
        return_time: getDateOffset(1, 4),
        status: 'RETURNED',
        operator_id: superAdmin.id
      }
    ]
  })

  // Today/Current month: 3 ACTIVE loans and 2 completed
  await prisma.transaction.create({
    data: {
      ht_id: htItems[0].id,
      borrower_id: borrowers[0].id, // Ahmad Syarif (P-001) - Active
      borrow_time: getDateOffset(0, 0, 3),
      status: 'BORROWED',
      operator_id: superAdmin.id
    }
  })

  await prisma.transaction.create({
    data: {
      ht_id: htItems[4].id,
      borrower_id: borrowers[1].id, // Budi - Active
      borrow_time: getDateOffset(0, 0, 5),
      status: 'BORROWED',
      operator_id: operator1.id
    }
  })

  await prisma.transaction.create({
    data: {
      ht_id: htItems[6].id,
      borrower_id: borrowers[2].id, // Citra - Active
      borrow_time: getDateOffset(0, 1, 2),
      status: 'BORROWED',
      operator_id: superAdmin.id
    }
  })

  await prisma.transaction.createMany({
    data: [
      {
        ht_id: htItems[5].id,
        borrower_id: borrowers[0].id, // Ahmad Syarif (P-001) - Completed
        borrow_time: getDateOffset(0, 2, 4),
        return_time: getDateOffset(0, 2),
        status: 'RETURNED',
        operator_id: superAdmin.id
      },
      {
        ht_id: htItems[7].id,
        borrower_id: borrowers[3].id, // Dedi - Completed
        borrow_time: getDateOffset(0, 4, 6),
        return_time: getDateOffset(0, 4),
        status: 'RETURNED',
        operator_id: operator1.id
      }
    ]
  })

  console.log('Loan transaction history populated successfully.')
  console.log('--- SEED COMPLETE ---')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
