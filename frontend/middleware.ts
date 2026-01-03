import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const sessionToken = request.cookies.get('session_token')?.value;
    const { pathname } = request.nextUrl;

    // 1. Định nghĩa các nhóm đường dẫn
    const protectedPaths = ['/profile', '/admin', '/booking', '/checkout', '/my-bookings'];
    const authPaths = ['/auth/signin', '/auth/signup'];
    
    const isProtected = protectedPaths.some(path => pathname.startsWith(path));
    const isAuthPage = authPaths.some(path => pathname.startsWith(path));

    // 2. Nếu đã có Session Token mà cố vào trang Login/Register -> Đẩy về trang chủ
    if (isAuthPage && sessionToken) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // 3. Xử lý các trang yêu cầu đăng nhập
    if (isProtected) {
        if (!sessionToken) {
            return NextResponse.redirect(new URL('/auth/signin', request.url));
        }

        try {
            // Gọi Backend để xác thực session token
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/verify`, {
                method: 'GET',
                headers: {
                    'Cookie': `session_token=${sessionToken}`
                },
                cache: 'no-store'
            });

            if (!response.ok) {
                const res = NextResponse.redirect(new URL('/auth/signin', request.url));
                res.cookies.delete('session_token');
                return res;
            }
        } catch {
            // Nếu server backend sập hoặc lỗi, redirect để an toàn
            return NextResponse.redirect(new URL('/auth/signin', request.url));
        }
    }

    return NextResponse.next();
}

// Giới hạn matcher để middleware không chạy vào các file tĩnh
export const config = {
    matcher: [
        '/profile/:path*', 
        '/admin/:path*', 
        '/booking/:path*', 
        '/checkout/:path*',
        '/auth/:path*'
    ],
};