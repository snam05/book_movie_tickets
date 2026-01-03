// controllers/upload.controller.js
import { uploadImage, deleteImage, extractPublicId } from '../services/cloudinary.service.js';

/**
 * Upload poster phim lên Cloudinary
 * POST /api/upload/poster
 * Body: multipart/form-data với field 'poster'
 */
export const uploadPoster = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng chọn file ảnh để upload'
            });
        }

        // Upload lên Cloudinary
        const result = await uploadImage(
            req.file.buffer,
            process.env.CLOUDINARY_FOLDER || 'movie_posters'
        );

        return res.status(200).json({
            success: true,
            message: 'Upload ảnh thành công',
            data: {
                url: result.url,
                publicId: result.publicId
            }
        });
    } catch (error) {
        console.error('Upload poster error:', error);
        return res.status(500).json({
            success: false,
            message: 'Lỗi khi upload ảnh',
            error: error.message
        });
    }
};

/**
 * Xóa poster từ Cloudinary
 * DELETE /api/upload/poster
 * Body: { url: string } hoặc { publicId: string }
 */
export const deletePoster = async (req, res) => {
    try {
        const { url, publicId } = req.body;

        if (!url && !publicId) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng cung cấp URL hoặc Public ID của ảnh'
            });
        }

        // Lấy publicId từ URL nếu cần
        const idToDelete = publicId || extractPublicId(url);

        if (!idToDelete) {
            return res.status(400).json({
                success: false,
                message: 'Không thể xác định Public ID của ảnh'
            });
        }

        // Xóa ảnh từ Cloudinary
        const deleted = await deleteImage(idToDelete);

        if (deleted) {
            return res.status(200).json({
                success: true,
                message: 'Xóa ảnh thành công'
            });
        } else {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy ảnh để xóa'
            });
        }
    } catch (error) {
        console.error('Delete poster error:', error);
        return res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa ảnh',
            error: error.message
        });
    }
};
