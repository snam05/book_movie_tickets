import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const { pathname } = request.nextUrl;

    // 1. Định nghĩa các nhóm đường dẫn
    const protectedPaths = ['/profile', '/admin', '/booking', '/checkout'];
    const authPaths = ['/auth/login', '/auth/register'];
    
    const isProtected = protectedPaths.some(path => pathname.startsWith(path));
    const isAuthPage = authPaths.some(path => pathname.startsWith(path));

    // 2. Nếu đã có Token mà cố vào trang Login/Register -> Đẩy về trang chủ
    if (isAuthPage && token) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // 3. Xử lý các trang yêu cầu đăng nhập
    if (isProtected) {
        if (!token) {
            return NextResponse.redirect(new URL('/auth/login', request.url));
        }

        try {
            // Gọi Backend để xác thực thực tế
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/verify`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                // Quan trọng: Thêm cache: 'no-store' để đảm bảo luôn check mới
                cache: 'no-store'
            });

            if (!response.ok) {
                const res = NextResponse.redirect(new URL('/auth/login', request.url));
                res.cookies.delete('token');
                return res;
            }
        } catch (error) {
            // Nếu server backend sập, tạm thời cho qua hoặc chặn tùy bạn
            // Ở đây chọn redirect để an toàn
            return NextResponse.redirect(new URL('/auth/login', request.url));
        }
    }

    return NextResponse.next();
}

// Giới hạn matcher để middleware không chạy vào các file tĩnh (ảnh, css, js) gây chậm web
export const config = {
    matcher: [
        '/profile/:path*', 
        '/admin/:path*', 
        '/booking/:path*', 
        '/auth/:path*' // Thêm auth để chặn người đã login vào lại trang login
    ],
};