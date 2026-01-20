import { NextResponse, type NextRequest } from 'next/server'
import { authGuard, roleGuard, subscriptionGuard, getDashboardUrl } from './lib/auth/guards'

export async function middleware(request: NextRequest) {

    const path = request.nextUrl.pathname

    // 1. PUBLIC PATHS EXCLUSION
    if (
        path === '/' ||
        path.startsWith('/_next') ||
        path.startsWith('/api') ||
        path.startsWith('/static') ||
        path.startsWith('/auth') ||
        path.startsWith('/login') ||
        path.startsWith('/register') ||
        path.startsWith('/legal') ||
        path.startsWith('/terms') ||
        path.startsWith('/privacy') ||
        path.includes('.')
    ) {
        return NextResponse.next()
    }

    // 2. AUTH GUARD
    // Returns session info + response object (with cookies refreshing)
    // If no session, handle redirect
    let nextResponse = NextResponse.next({
        request: { headers: request.headers }
    })

    const authResult = await authGuard(request, nextResponse)

    if (!authResult.session) {
        // Redirect to Login
        const redirectUrl = request.nextUrl.clone()
        redirectUrl.pathname = '/login'
        redirectUrl.searchParams.set('redirectedFrom', path)
        return NextResponse.redirect(redirectUrl)
    }

    const { role, subStatus } = authResult.session

    // 3. ROLE GUARD (Strict Redirect)
    // If user tries to access /staff but is 'manager', bounce to /manager
    const roleRedirect = roleGuard(request, role)
    if (roleRedirect) return roleRedirect

    // 4. SUBSCRIPTION GUARD
    // Blocks usage if subscription is dead
    const subRedirect = subscriptionGuard(request, role, subStatus || 'active')
    if (subRedirect) return subRedirect

    // 5. ROOT REDIRECT
    // If user hits pure domain '/', redirect to their specific dashboard
    // currently handled by public exclusion logic? No, '/' logic:
    // If '/' is NOT excluded (it's public but let's say we want auto-dash):
    // Actually '/' is public landing. But if logged in?
    // TODO: Ideally if logged in on '/', go to Dashboard. (Optional V2.1)

    return authResult.response
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
}
