import { withAuth } from 'next-auth/middleware'

export default withAuth(
  function proxy() {
    // Just pass through, no next-intl middleware needed since we don't use localized paths
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const isPublicPage = req.nextUrl.pathname.startsWith('/login')

        if (isPublicPage) {
          return true
        }

        return token != null
      }
    },
    pages: {
      signIn: '/login'
    }
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - static files with common image/vector extensions
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'
  ]
}
