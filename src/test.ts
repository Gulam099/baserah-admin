// import { NextResponse, NextRequest } from "next/server"

// export function middleware(request: NextRequest) {
//   // 1) Check if user has a token cookie
//   const token = request.cookies.get("token")?.value

//   // 2) If user is authenticated
//   if (token) {
//     // If user tries to go to /login, redirect to /dashboard
//     if (request.nextUrl.pathname === "/login") {
//       return NextResponse.redirect(new URL("/dashboard", request.url))
//     }
//     // Otherwise, allow the request (they can stay on /dashboard or any other route you permit)
//     return NextResponse.next()
//   } else {
//     // 3) If user is NOT authenticated:
//     // if user attempts any route under /dashboard, redirect them to /login
//     if (request.nextUrl.pathname.startsWith("/dashboard")) {
//       return NextResponse.redirect(new URL("/login", request.url))
//     }
//     // If they attempt the root or any other route you want to protect, also redirect or handle as you wish
//     // Example: if they go to "/", also redirect to "/login"
//     if (request.nextUrl.pathname === "/") {
//       return NextResponse.redirect(new URL("/login", request.url))
//     }
//     // Otherwise, allow the request
//     return NextResponse.next()
//   }
// }

// export const config = {
//   // Apply this middleware to any routes you want to protect or redirect.
//   // For example, if you want to handle /, /login, /dashboard, and all subroutes:
//   matcher: ["/", "/login", "/dashboard/:path*"],
// }
