import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { Database } from '@/types/supabase'; // Assuming we have or will generate this, or use 'any' for now if generic types arent generated yet.

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient<Database>({ req, res });
  const { data: { session } } = await supabase.auth.getSession();

  const path = req.nextUrl.pathname;

  // 1. Public Paths (Allow always)
  if (path === '/' || path.startsWith('/auth') || path.startsWith('/api') || path.startsWith('/_next') || path.startsWith('/static')) {
    return res;
  }

  // 2. Auth Guard
  if (!session) {
    if (path.startsWith('/login') || path.startsWith('/register')) {
        return res; // Allow access to login pages
    }
    // Redirect unauthenticated users to login
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/login';
    redirectUrl.searchParams.set('redirectedFrom', path);
    return NextResponse.redirect(redirectUrl);
  }

  // 3. User & Role Validation
  const userRole = session.user.user_metadata.role;

  // 4. Role-Based Access Control (RBAC) Logic
  
  // Backoffice: SuperUser & Admin
  if (path.startsWith('/backoffice')) {
      // SuperUser Zone
      if (path.startsWith('/backoffice/superuser')) {
          if (userRole !== 'superuser') {
              return NextResponse.redirect(new URL('/unauthorized', req.url));
          }
      }
      // Internal Admin Zone
      if (path.startsWith('/backoffice/admin')) {
          if (userRole !== 'superuser' && userRole !== 'admin') {
               return NextResponse.redirect(new URL('/unauthorized', req.url));
          }
      }
      return res;
  }

  // Barberia (Business) Zone
  if (path.startsWith('/barberia')) {
      if (userRole !== 'barberia' && userRole !== 'superuser') {
          return NextResponse.redirect(new URL('/unauthorized', req.url));
      }
      return res;
  }

  // Staff Zone
  if (path.startsWith('/staff')) {
       if (userRole !== 'staff' && userRole !== 'barberia' && userRole !== 'superuser') {
          return NextResponse.redirect(new URL('/unauthorized', req.url));
      }
      return res;
  }

  // Client Zone (Protection mostly for user-specific data, but generally open to 'cliente')
  // ...

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
