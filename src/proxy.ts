import { withAuth } from 'next-auth/middleware'

export default withAuth(
  function middleware() {
    // Just pass through if authorized
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const isPublicPage = req.nextUrl.pathname.startsWith('/auth/login')

        if (isPublicPage) {
          return true
        }

        return token != null
      }
    },
    pages: {
      signIn: '/auth/login'
    }
  }
)

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
}
