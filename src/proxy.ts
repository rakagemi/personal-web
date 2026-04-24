import { NextRequest, NextResponse } from 'next/server';
import { CLIENT_ENV } from './utils/environment/client';

const MAINTENANCE_MODE = CLIENT_ENV.maintenanceMode === "true";
const MAINTENANCE_PATH = '/maintenance';

// Whitelist path yang tetap bisa diakses saat maintenance
const BYPASS_PATHS = [
    MAINTENANCE_PATH,
    '/favicon.ico',
    '/_next',
    '/api/health',
];

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Lewati path yang ada di whitelist
    const isBypassed = BYPASS_PATHS.some((path) =>
        pathname.startsWith(path)
    );

    if (MAINTENANCE_MODE && !isBypassed) {
        const url = request.nextUrl.clone();
        url.pathname = MAINTENANCE_PATH;
        return NextResponse.redirect(url);
    }

    // Jika tidak maintenance, lanjut normal
    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match semua path KECUALI:
         * - _next/static  (static files)
         * - _next/image   (image optimization)
         * - favicon.ico
         * - file ekstensi: .png, .jpg, .svg, dll
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|css|js)$).*)',
    ],
};