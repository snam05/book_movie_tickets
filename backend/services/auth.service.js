// services/auth.service.js

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.model.js'; // Nhập Model User để thao tác DB

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
export const registerUser = async (userData) => {
    const { email, matKhau, cccd_number, ...rest } = userData; // Lấy các trường cần thiết

    // A. Kiểm tra email đã tồn tại chưa
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
        throw new Error('Email đã tồn tại trong hệ thống.');
    }
    
    // B. Kiểm tra CCCD đã tồn tại chưa
    const existingCccd = await User.findOne({ where: { cccd_number } });
    if (existingCccd) {
        throw new Error('Số CCCD đã được đăng ký.');
    }

    // C. Băm mật khẩu (Hashing)
    const salt = await bcrypt.genSalt(10); // Tạo salt
    const password_hash = await bcrypt.hash(matKhau, salt); // Băm mật khẩu
    
    // D. Tạo mã thành viên duy nhất
    let memberCode;
    let codeExists = true;
    while(codeExists) {
        memberCode = generateMemberCode();
        const existingCode = await User.findOne({ where: { member_code: memberCode } });
        if (!existingCode) {
            codeExists = false; // Mã duy nhất, thoát vòng lặp
        }
    }
    
    // E. Lưu người dùng mới vào DB
    const newUser = await User.create({
        ...rest, // Các trường còn lại (full_name, date_of_birth, gender, role...)
        email,
        cccd_number,
        password_hash, // Lưu mật khẩu đã băm
        member_code: memberCode
    });

    // F. Trả về thông tin người dùng (trừ mật khẩu)
    return {
        id: newUser.id,
        email: newUser.email,
        full_name: newUser.full_name,
        member_code: newUser.member_code,
        role: newUser.role
    };
};

// 2. Logic Đăng nhập (Chúng ta sẽ xây dựng sau khi tạo Controller)
export const loginUser = async (email, matKhau) => {
    // Logic tìm người dùng, so sánh mật khẩu và tạo JWT token
    // ...
};