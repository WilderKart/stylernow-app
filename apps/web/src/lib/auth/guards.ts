import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

// Types for clarity
type UserRole = 'superuser' | 'admin' | 'barberia' | 'manager' | 'staff' | 'cliente'
type SubStatus = 'active' | 'past_due' | 'canceled' | 'trialing' | 'blocked'

interface SessionData {
    user: any
    role: UserRole
    subStatus?: SubStatus
}

// ----------------------------------------------------------------------
// 1. AUTH GUARD
// ----------------------------------------------------------------------
export async function authGuard(request: NextRequest, response: NextResponse) {
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    response = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
        return { session: null, response: null }
    }

    // Extract Metadata
    const role = (session.user.user_metadata.role as UserRole) || 'cliente'
    // V2.1: Dynamic Sub Status from Metadata (synced via triggers ideally)
    const subStatus = (session.user.user_metadata.sub_status as SubStatus) || 'trialing'

    return {
        session: {
            user: session.user,
            role,
            subStatus
        },
        response: response
    }
}

// ----------------------------------------------------------------------
// 2. ROLE ROUTING (Strict Redirects)
// ----------------------------------------------------------------------
export function getDashboardUrl(role: UserRole): string {
    switch (role) {
        case 'superuser': return '/backoffice/master'
        case 'admin': return '/backoffice/ops'
        case 'barberia': return '/business/dashboard'
        case 'manager': return '/manager/dashboard'
        case 'staff': return '/staff/home'
        case 'cliente': return '/client/home'
        default: return '/client/home'
    }
}

export function roleGuard(request: NextRequest, role: UserRole) {
    const path = request.nextUrl.pathname

    // V2.1: Explicit Public Exclusions
    if (path.startsWith('/auth') || path.startsWith('/legal') || path.startsWith('/help')) {
        return null
    }

    // Define allowed paths by role zone
    const zoneMap: Record<string, UserRole[]> = {
        '/backoffice': ['superuser', 'admin'],
        '/business': ['barberia'],
        '/manager': ['manager'],
        '/staff': ['staff'],
        '/client': ['cliente']
    }

    for (const [prefix, allowedRoles] of Object.entries(zoneMap)) {
        if (path.startsWith(prefix)) {
            if (!allowedRoles.includes(role)) {
                const correctDash = getDashboardUrl(role)
                return NextResponse.redirect(new URL(correctDash, request.url))
            }
        }
    }

    return null
}

// ----------------------------------------------------------------------
// 3. SUBSCRIPTION GUARD (V2.1)
// ----------------------------------------------------------------------
export function subscriptionGuard(request: NextRequest, role: UserRole, status: SubStatus) {
    if (role === 'superuser' || role === 'admin' || role === 'cliente') return null

    // Business/Manager/Staff logic
    const path = request.nextUrl.pathname

    // V2.1: Blocked/Canceled Logic
    if (status === 'blocked' || status === 'canceled') {
        if (!path.startsWith('/billing/suspended')) {
            return NextResponse.redirect(new URL('/billing/suspended', request.url))
        }
    }

    // V2.1: Past Due Logic (Access allowed, but maybe warn?)
    // This Guard allows access. Component level should show "Pay Now" banner.

    return null
}
