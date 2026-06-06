import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10)

  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@htcare.com' },
    update: {},
    create: {
      email: 'admin@htcare.com',
      name: 'Super Administrator',
      password: hashedPassword,
      role: 'SUPERADMIN'
    }
  })

  console.log('Seeding complete. SuperAdmin created:', superAdmin.email)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
