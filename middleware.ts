import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const hostname = request.headers.get('host') || '';
    const response = NextResponse.next();

    // ============================================================
    // Host-based routing for Shopper Subdomain
    // ============================================================
    // We have two sites in one Next.js app:
    //   - goods.gsgbrands.com.gh   -> the storefront (route root)
    //   - shopper.gsgbrands.com.gh -> the personal-shopper site
    //                                  (lives in the /shopper route group)
    //
    // Three rules are applied below in order so users always end up at clean
    // canonical URLs without us having to touch every <Link href="/shopper/...">
    // (which would break path-based access in local dev):
    //
    //   1. If the request hits the goods host with a /shopper/* path, and the
    //      shopper subdomain is configured, redirect cross-host so the user
    //      lands on the canonical subdomain URL.
    //   2. If the request hits the shopper host with a /shopper/* path,
    //      redirect to the bare path on the same host (drop the /shopper
    //      prefix from the URL bar).
    //   3. If the request hits the shopper host with a non-/shopper path
    //      (e.g. /how-it-works), silently rewrite to /shopper/<path> so the
    //      route group resolves. URL bar stays clean.
    //
    // Localhost / Vercel preview hosts hit none of these and continue to work
    // through path-based access at /shopper/*.
    const isApiRoute = pathname.startsWith('/api/');
    const isAdminRoute = pathname.startsWith('/admin');
    const isStaticFile = pathname.startsWith('/_next') || pathname.includes('.');

    const shopperHostFromEnv = (process.env.NEXT_PUBLIC_SITE_SHOPPER_URL || '')
        .replace(/^https?:\/\//, '')
        .replace(/\/.*$/, '')
        .toLowerCase();
    const goodsHostFromEnv = (process.env.NEXT_PUBLIC_SITE_GOODS_URL || '')
        .replace(/^https?:\/\//, '')
        .replace(/\/.*$/, '')
        .toLowerCase();
    const hostnameLower = hostname.toLowerCase();
    const isShopperHost = hostnameLower.startsWith('shopper.') ||
        (shopperHostFromEnv ? hostnameLower === shopperHostFromEnv : false);
    const isGoodsHost = goodsHostFromEnv ? hostnameLower === goodsHostFromEnv : false;

    if (!isApiRoute && !isAdminRoute && !isStaticFile) {
        // Rule 1: goods.../shopper/X  ->  shopper.../X (cross-host canonical)
        if (isGoodsHost && pathname.startsWith('/shopper') && shopperHostFromEnv) {
            const cleanPath = pathname.slice('/shopper'.length) || '/';
            const target = new URL(`https://${shopperHostFromEnv}${cleanPath}`);
            target.search = request.nextUrl.search;
            return NextResponse.redirect(target, 308);
        }

        // Rule 2: shopper.../shopper/X  ->  shopper.../X  (drop ugly prefix)
        if (isShopperHost && pathname.startsWith('/shopper')) {
            const cleanPath = pathname.slice('/shopper'.length) || '/';
            const target = new URL(cleanPath, request.url);
            target.search = request.nextUrl.search;
            return NextResponse.redirect(target, 308);
        }

        // Rule 3: shopper.../X  ->  rewrite to /shopper/X (transparent)
        if (isShopperHost && !pathname.startsWith('/shopper')) {
            const newUrl = new URL(
                `/shopper${pathname === '/' ? '' : pathname}`,
                request.url,
            );
            newUrl.search = request.nextUrl.search;
            return NextResponse.rewrite(newUrl);
        }
    }

    // ============================================================
    // Security headers for ALL routes
    // ============================================================
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    // ============================================================
    // Admin route protection
    // ============================================================
    if (pathname.startsWith('/admin')) {
        // Security headers for admin
        response.headers.set('X-Robots-Tag', 'noindex, nofollow');
        response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');

        // Allow login page without auth
        if (pathname === '/admin/login') {
            return response;
        }

        // Server-side auth check: verify the Supabase session cookie/token
        // We set 'sb-access-token' explicitly on login, but also check other formats
        let token: string | undefined;

        // 1. Check our explicitly set cookie (most reliable)
        token = request.cookies.get('sb-access-token')?.value;

        // 2. Check Supabase's own cookie format
        if (!token) {
            const projectRef = supabaseUrl?.split('//')[1]?.split('.')[0];
            token = request.cookies.get(`sb-${projectRef}-auth-token`)?.value;
        }

        // 3. Try to find any Supabase auth cookie (newer formats may encode as JSON)
        if (!token) {
            for (const [name, cookie] of request.cookies) {
                if (name.startsWith('sb-') && (name.endsWith('-auth-token') || name.includes('auth'))) {
                    try {
                        const parsed = JSON.parse(cookie.value);
                        if (Array.isArray(parsed) && parsed[0]) {
                            token = parsed[0];
                        } else if (typeof parsed === 'object' && parsed.access_token) {
                            token = parsed.access_token;
                        } else if (typeof parsed === 'string') {
                            token = parsed;
                        }
                    } catch {
                        // Not JSON, use raw value
                        token = cookie.value;
                    }
                    if (token) break;
                }
            }
        }

        if (!token) {
            // No auth token found — redirect to login
            const loginUrl = new URL('/admin/login', request.url);
            loginUrl.searchParams.set('redirect', pathname);
            return NextResponse.redirect(loginUrl);
        }

        // Verify the token is valid and user has admin/staff role
        if (supabaseServiceKey) {
            try {
                const supabase = createClient(supabaseUrl, supabaseServiceKey, {
                    auth: { autoRefreshToken: false, persistSession: false }
                });

                const { data: { user }, error } = await supabase.auth.getUser(token);

                if (error || !user) {
                    const loginUrl = new URL('/admin/login', request.url);
                    loginUrl.searchParams.set('redirect', pathname);
                    loginUrl.searchParams.set('error', 'session_expired');
                    return NextResponse.redirect(loginUrl);
                }

                // Check role
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single();

                if (!profile || (profile.role !== 'admin' && profile.role !== 'staff')) {
                    const loginUrl = new URL('/admin/login', request.url);
                    loginUrl.searchParams.set('error', 'unauthorized');
                    return NextResponse.redirect(loginUrl);
                }

                // Auth passed — set user info in headers for downstream use
                response.headers.set('x-user-id', user.id);
                response.headers.set('x-user-role', profile.role);

            } catch (err) {
                console.error('[Middleware] Auth check error:', err);
                // On error, still allow through (client-side check is backup)
                // But log it for monitoring
            }
        }
    }

    // ============================================================
    // API route security headers
    // ============================================================
    if (pathname.startsWith('/api/')) {
        response.headers.set('X-Content-Type-Options', 'nosniff');
        response.headers.set('Cache-Control', 'no-store');
    }

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
