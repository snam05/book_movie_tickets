/**
 * Thông tin chi tiết người dùng từ Database
 */
export interface IUser {
    id: number;
    email: string;
    full_name: string;      // Tương ứng cột full_name trong DB
    cccd_number: string;    // Tương ứng cột cccd_number trong DB
    member_code: string;    // Mã thành viên 10 số tự sinh
    role: 'customer' | 'admin';
    date_of_birth?: string;
    gender?: 'male' | 'female' | 'other';
}

/**
 * Cấu trúc dữ liệu cho Form Đăng nhập
 */
export interface ILoginForm {
    email: string;
    matKhau: string; // Khớp với trường 'matKhau' trong Backend Controller
}

/**
 * Cấu trúc dữ liệu cho Form Đăng ký (Có thêm CCCD)
 */
export interface IRegisterForm {
    full_name: string;
    email: string;
    matKhau: string;
    cccd_number: string;
    date_of_birth: string;
}

export interface IAPIResponse {
    message: string;
    data: IUser;      // Trường 'data' chứa toàn bộ object của User
    token: string;    // Trường 'token' nằm ngang hàng với 'data'
}