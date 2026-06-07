import { PrismaAdapter } from '@next-auth/prisma-adapter'
import bcrypt from 'bcryptjs'
import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from './prisma'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/auth/login'
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Missing credentials')
        }

        // 1. Try to find in User table (Admin/Operator)
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (user && user.password) {
          const isValid = await bcrypt.compare(credentials.password, user.password)
          if (isValid) {
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role
            }
          }
        }

        // 2. Try to find in Borrower table (Borrowers)
        const borrower = await prisma.borrower.findUnique({
          where: { email: credentials.email }
        })

        if (borrower && borrower.password) {
          const isValid = await bcrypt.compare(credentials.password, borrower.password)
          if (isValid) {
            return {
              id: borrower.id,
              email: borrower.email,
              name: borrower.full_name,
              role: 'BORROWER'
            }
          }
        }

        throw new Error('Invalid credentials')
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string
        session.user.id = token.id as string
      }
      return session
    }
  }
}
