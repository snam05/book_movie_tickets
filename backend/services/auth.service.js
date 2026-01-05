// @ts-nocheck
import bcrypt from 'bcryptjs';
import User from '../models/User.model.js'; // Nhập Model User (Sequelize)
import dotenv from 'dotenv';
import { createSession } from './session.service.js';

// Khởi tạo dotenv để đọc biến môi trường
dotenv.config();


// Hàm tạo mã thành viên 10 ký tự ngẫu nhiên
const generateMemberCode = () => {
    // Tạo chuỗi ngẫu nhiên từ 0-9
    let code = '';
    for (let i = 0; i < 10; i++) {
        code += Math.floor(Math.random() * 10);
    }
    return code;
};

// 1. Logic Đăng ký Người dùng
export const registerUser = async (userData, ipAddress, userAgent) => {
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
        throw new Error('Số CCCD đã tồn tại trong hệ thống.');
    }
    
    // C. Kiểm tra số điện thoại (nếu có)
    if (rest.phone_number) {
        const existingPhone = await User.findOne({ where: { phone_number: rest.phone_number } });
        if (existingPhone) {
            throw new Error('Số điện thoại đã tồn tại trong hệ thống.');
        }
    }
    
    // C. Tạo mã thành viên duy nhất
    let memberCode;
    let codeExists = true;
    while(codeExists) {
        memberCode = generateMemberCode();
        const existingCode = await User.findOne({ where: { member_code: memberCode } });
        if (!existingCode) {
            codeExists = false; 
        }
    }
    
    // D. Lưu người dùng mới vào DB
    // Lưu ý: password_hash sẽ được tự động hash bởi hook beforeCreate trong User model
    const newUser = await User.create({
        ...rest, // Các trường còn lại (date_of_birth, gender...)
        email,
        cccd_number,
        full_name,
        password_hash: matKhau, // Truyền password thô, hook sẽ tự động hash
        member_code: memberCode
    });

    // F. Tạo Session trong database (auto-login sau khi đăng ký)
    const sessionData = await createSession(newUser.id, ipAddress, userAgent);

    // Trả về thông tin người dùng (trừ password_hash) và session
    return {
        user: {
            id: newUser.id,
            email: newUser.email,
            full_name: newUser.full_name,
            member_code: newUser.member_code,
            role: newUser.role
        },
        sessionToken: sessionData.sessionToken,
        expiresAt: sessionData.expiresAt
    };
};

// 2. Logic Đăng nhập
export const loginUser = async (email, matKhau, ipAddress, userAgent) => {
    try {
        // A. Tìm người dùng bằng email
        const user = await User.findOne({ where: { email } });
        
        if (!user) {
            // Thông báo lỗi chung để tránh tiết lộ user có tồn tại hay không
            throw new Error('Email hoặc Mật khẩu không đúng.'); 
        }

        // B. Kiểm tra tài khoản có được kích hoạt không
        if (!user.is_active) {
            throw new Error('Tài khoản của bạn đã bị vô hiệu hóa. Vui lòng liên hệ quản trị viên.');
        }

        // C. So sánh mật khẩu
        // So sánh mật khẩu thô (matKhau) với hash đã lưu trong DB (user.password_hash)
        const isMatch = await bcrypt.compare(matKhau, user.password_hash);

        if (!isMatch) {
            throw new Error('Email hoặc Mật khẩu không đúng.');
        }

        // D. Tạo Session trong database
        const sessionData = await createSession(user.id, ipAddress, userAgent);

        return {
            user: {
                id: user.id,
                email: user.email,
                full_name: user.full_name,
                member_code: user.member_code,
                role: user.role
            },
            sessionToken: sessionData.sessionToken,
            expiresAt: sessionData.expiresAt
        };
    } catch (error) {
        // Ném lỗi ra ngoài để Controller xử lý (ví dụ: lỗi kết nối DB)
        throw error;
    }
};