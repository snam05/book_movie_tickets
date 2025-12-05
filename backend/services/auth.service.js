import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.model.js'; // Nhập Model User (Sequelize)
import dotenv from 'dotenv';

// Khởi tạo dotenv để đọc biến môi trường như JWT_SECRET
dotenv.config(); 

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';


// Hàm tạo mã thành viên 10 ký tự ngẫu nhiên
const generateMemberCode = () => {
    // Tạo chuỗi ngẫu nhiên từ 0-9
    let code = '';
    for (let i = 0; i < 10; i++) {
        code += Math.floor(Math.random() * 10);
    }
    return code;
};

// --- HÀM HỖ TRỢ: TẠO JWT TOKEN ---
const createToken = (payload) => {
    // Sử dụng biến môi trường JWT_SECRET để ký token
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
    });
};

// 1. Logic Đăng ký Người dùng
export const registerUser = async (userData) => {
    // Lấy các trường cần thiết. matKhau là mật khẩu thô từ Body JSON.
    const { email, matKhau, cccd_number, full_name, ...rest } = userData; 

    // --- 1. KIỂM TRA ĐẦY ĐỦ THÔNG TIN BẮT BUỘC (Validation) ---
    if (!email || !matKhau || !cccd_number || !full_name) {
        throw new Error('Thiếu trường bắt buộc. Vui lòng cung cấp đầy đủ Email, Mật khẩu, Số CCCD và Họ tên.');
    }
    
    // --- 2. KIỂM TRA TRÙNG LẶP (Duplication Checks) ---

    // A. Kiểm tra email
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
        throw new Error('Email đã tồn tại trong hệ thống.');
    }
    
    // B. Kiểm tra CCCD
    const existingCccd = await User.findOne({ where: { cccd_number } });
    if (existingCccd) {
        throw new Error('Số CCCD đã được đăng ký.');
    }

    // C. Băm mật khẩu (Hashing)
    const salt = await bcrypt.genSalt(10); 
    const password_hash = await bcrypt.hash(matKhau, salt); 
    
    // D. Tạo mã thành viên duy nhất
    let memberCode;
    let codeExists = true;
    while(codeExists) {
        memberCode = generateMemberCode();
        const existingCode = await User.findOne({ where: { member_code: memberCode } });
        if (!existingCode) {
            codeExists = false; 
        }
    }
    
    // E. Lưu người dùng mới vào DB
    const newUser = await User.create({
        ...rest, // Các trường còn lại (date_of_birth, gender...)
        email,
        cccd_number,
        full_name,
        password_hash, // Lưu mật khẩu đã băm
        member_code: memberCode
    });

    // F. Tạo Token và trả về
    const token = createToken({ id: newUser.id, role: newUser.role, mail: newUser.email});

    // Trả về thông tin người dùng (trừ password_hash) và token
    return {
        user: {
            id: newUser.id,
            email: newUser.email,
            full_name: newUser.full_name,
            member_code: newUser.member_code,
            role: newUser.role
        },
        token
    };
};

// 2. Logic Đăng nhập
export const loginUser = async (email, matKhau) => {
    try {
        // A. Tìm người dùng bằng email
        const user = await User.findOne({ where: { email } });
        
        if (!user) {
            // Thông báo lỗi chung để tránh tiết lộ user có tồn tại hay không
            throw new Error('Email hoặc Mật khẩu không đúng.'); 
        }

        // B. So sánh mật khẩu
        // So sánh mật khẩu thô (matKhau) với hash đã lưu trong DB (user.password_hash)
        const isMatch = await bcrypt.compare(matKhau, user.password_hash);

        if (!isMatch) {
            throw new Error('Email hoặc Mật khẩu không đúng.');
        }

        // C. Tạo Token và trả về
        const token = createToken({ id: user.id, role: user.role });

        return {
            user: {
                id: user.id,
                email: user.email,
                full_name: user.full_name,
                member_code: user.member_code,
                role: user.role
            },
            token
        };
    } catch (error) {
        // Ném lỗi ra ngoài để Controller xử lý (ví dụ: lỗi kết nối DB, lỗi JWT)
        throw error;
    }
};