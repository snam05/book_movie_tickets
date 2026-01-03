// services/cloudinary.service.js
import cloudinary from '../cloudinary.config.js';
import { Readable } from 'stream';

/**
 * Upload ảnh lên Cloudinary
 * @param {Buffer} fileBuffer - Buffer của file ảnh
 * @param {string} folder - Tên folder trên Cloudinary (mặc định: movie_posters)
 * @param {string} publicId - Public ID tùy chỉnh (optional)
 * @returns {Promise<{url: string, publicId: string}>}
 */
export const uploadImage = async (fileBuffer, folder = 'movie_posters', publicId = null) => {
    try {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: folder,
                    public_id: publicId,
                    resource_type: 'auto',
                    transformation: [
                        { width: 800, height: 1200, crop: 'limit' }, // Giới hạn kích thước tối đa
                        { quality: 'auto:good' }, // Tự động tối ưu chất lượng
                        { fetch_format: 'auto' } // Tự động chọn định dạng tốt nhất
                    ]
                },
                (error, result) => {
                    if (error) {
                        console.error('Cloudinary upload error:', error);
                        reject(error);
                    } else {
                        resolve({
                            url: result.secure_url,
                            publicId: result.public_id
                        });
                    }
                }
            );

            // Chuyển buffer thành stream và pipe vào uploadStream
            const bufferStream = Readable.from(fileBuffer);
            bufferStream.pipe(uploadStream);
        });
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        throw new Error('Failed to upload image to Cloudinary');
    }
};

/**
 * Xóa ảnh từ Cloudinary
 * @param {string} publicId - Public ID của ảnh cần xóa
 * @returns {Promise<boolean>}
 */
export const deleteImage = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result.result === 'ok';
    } catch (error) {
        console.error('Error deleting from Cloudinary:', error);
        throw new Error('Failed to delete image from Cloudinary');
    }
};

/**
 * Lấy Public ID từ Cloudinary URL
 * @param {string} url - URL của ảnh trên Cloudinary
 * @returns {string|null}
 */
export const extractPublicId = (url) => {
    if (!url || !url.includes('cloudinary.com')) return null;
    
    try {
        // URL format: https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{folder}/{public_id}.{format}
        const parts = url.split('/upload/');
        if (parts.length < 2) return null;
        
        const pathParts = parts[1].split('/');
        // Bỏ version (vXXXXXXXX)
        const relevantParts = pathParts.filter(part => !part.startsWith('v') || isNaN(part.substring(1)));
        
        // Lấy tên file và bỏ extension
        const fileName = relevantParts[relevantParts.length - 1].split('.')[0];
        
        // Nối folder + fileName
        return relevantParts.slice(0, -1).concat(fileName).join('/');
    } catch (error) {
        console.error('Error extracting public ID:', error);
        return null;
    }
};
