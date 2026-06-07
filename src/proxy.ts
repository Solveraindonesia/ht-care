import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const role = token?.role as string
    const pathname = req.nextUrl.pathname

    if (token) {
      // If user is logged in, redirect them away from /login
      if (pathname === '/login') {
        if (role === 'BORROWER') {
          return NextResponse.redirect(new URL('/borrower/dashboard', req.url))
        } else {
          return NextResponse.redirect(new URL('/dashboard', req.url))
        }
      }

      // If user is borrower, prevent accessing admin routes
      if (role === 'BORROWER') {
        const isAdminPath =
          pathname.startsWith('/dashboard') ||
          pathname.startsWith('/ht-data') ||
          pathname.startsWith('/borrower-data') ||
          pathname.startsWith('/scan-borrow') ||
          pathname.startsWith('/scan-return') ||
          pathname.startsWith('/riwayat-log') ||
          pathname.startsWith('/reports-analytics') ||
          pathname.startsWith('/settings') ||
          pathname === '/'

        if (isAdminPath) {
          return NextResponse.redirect(new URL('/borrower/dashboard', req.url))
        }

        // Enforce api/admin or settings/admin blocking
        if (pathname.startsWith('/api/admin') || pathname.startsWith('/settings/admin')) {
          return new NextResponse(JSON.stringify({ success: false, message: 'Forbidden' }), {
            status: 403,
            headers: { 'content-type': 'application/json' }
          })
        }
      } else {
        // If user is admin/operator/superadmin, prevent accessing borrower routes
        if (pathname.startsWith('/borrower/')) {
          return NextResponse.redirect(new URL('/dashboard', req.url))
        }
      }
    }
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
