import { type NextRequest, NextResponse } from "next/server"
import { TOKEN_COOKIE, encodedJwtSecret } from "@/config"
import * as jose from "jose"

export async function middleware(request: NextRequest) {
  // Middleware used for authentication
  const anonymousRoutes = ["/login", "/register"]
  if (anonymousRoutes.includes(request.nextUrl.pathname)) return

  const token = request.cookies.get(TOKEN_COOKIE)?.value
  if (!token) return Response.redirect(new URL("/login", request.url))
  const currentUser = (await jose.jwtVerify(token, encodedJwtSecret)).payload
  if (!currentUser) return Response.redirect(new URL("/login", request.url))

  // Passing user data as stringified json
  // This is quite sketchy
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("X-User", JSON.stringify(currentUser))
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

// This is needed, do not remove
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
}
