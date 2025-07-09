import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware() {
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        if (req.nextUrl.pathname === "/") {
          return true;
        }
        return !!token;
      },
    },
  }
)

export const config = {
  matcher: [
    
    "/((?!api/auth|auth|_next/static|_next/image|favicon.ico$).*)",
  ],
} 