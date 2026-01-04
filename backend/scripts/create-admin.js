// @ts-nocheck
import User from '../models/User.model.js';
import { sequelize } from '../db.config.js';
import dotenv from 'dotenv';

dotenv.config();

const createAdminAccount = async () => {
    try {
        // Kết nối database
        await sequelize.authenticate();
        console.log('✅ Kết nối database thành công!');

        // Thông tin admin
        const adminData = {
            email: 'admin@bookmovie.vn',
            password: 'Admin@123456', // Mật khẩu gốc
            full_name: 'Quản Trị Viên',
            cccd_number: '001234567890',
            date_of_birth: '1990-01-15',
            gender: 'male',
            member_code: 'ADM000001',
            role: 'admin'
        };

        // Kiểm tra admin đã tồn tại chưa
        const existingAdmin = await User.findOne({ where: { email: adminData.email } });
        
        if (existingAdmin) {
            console.log('⚠️ Admin đã tồn tại!');
            console.log('Email:', existingAdmin.email);
            console.log('Role:', existingAdmin.role);
            
            // Cập nhật mật khẩu mới (hook sẽ tự động hash)
            await existingAdmin.update({ password_hash: adminData.password });
            console.log('✅ Đã cập nhật mật khẩu mới cho admin!');
        } else {
            // Tạo admin mới (hook sẽ tự động hash password)
            const newAdmin = await User.create({
                email: adminData.email,
                password_hash: adminData.password, // Truyền password thô, hook sẽ hash
                full_name: adminData.full_name,
                cccd_number: adminData.cccd_number,
                date_of_birth: adminData.date_of_birth,
                gender: adminData.gender,
                member_code: adminData.member_code,
                role: adminData.role
            });

            console.log('✅ Tạo tài khoản admin thành công!');
            console.log('Email:', newAdmin.email);
            console.log('Role:', newAdmin.role);
        }

        console.log('\n📋 THÔNG TIN ĐĂNG NHẬP ADMIN:');
        console.log('Email:', adminData.email);
        console.log('Password:', adminData.password);
        console.log('\n⚠️ Hãy đổi mật khẩu sau khi đăng nhập lần đầu!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Lỗi:', error.message);
        process.exit(1);
    }
};

createAdminAccount();
