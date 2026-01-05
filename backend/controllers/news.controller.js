import newsService from '../services/news.service.js';
import { deleteImage, extractPublicId } from '../services/cloudinary.service.js';

class NewsController {
  // Lấy tất cả tin tức (public)
  async getAllNews(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const result = await newsService.getAllNews(
        parseInt(page),
        parseInt(limit)
      );

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
        message: 'News fetched successfully',
      });
    } catch (error) {
      console.error(`Error in getAllNews: ${error.message}`);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Lấy tin tức theo slug
  async getNewsBySlug(req, res) {
    try {
      const { slug } = req.params;
      const news = await newsService.getNewsBySlug(slug);

      res.status(200).json({
        success: true,
        data: news,
        message: 'News fetched successfully',
      });
    } catch (error) {
      console.error(`Error in getNewsBySlug: ${error.message}`);
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Tăng view count cho tin tức
  async incrementNewsViews(req, res) {
    try {
      const { id } = req.params;
      const news = await newsService.incrementNewsViews(id);

      res.status(200).json({
        success: true,
        data: news,
        message: 'Views incremented successfully',
      });
    } catch (error) {
      console.error(`Error in incrementNewsViews: ${error.message}`);
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Lấy tin tức theo category
  async getNewsByCategory(req, res) {
    try {
      const { category } = req.params;
      const { page = 1, limit = 10 } = req.query;

      const result = await newsService.getNewsByCategory(
        category,
        parseInt(page),
        parseInt(limit)
      );

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
        message: 'News fetched successfully',
      });
    } catch (error) {
      console.error(`Error in getNewsByCategory: ${error.message}`);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Tạo tin tức mới (Admin)
  async createNews(req, res) {
    try {
      const { title, content, summary, image, imagePublicId, author, category } =
        req.body;

      // Validation
      if (!title || !content || !summary) {
        return res.status(400).json({
          success: false,
          message: 'Please provide title, content, and summary',
        });
      }

      const newNews = await newsService.createNews({
        title,
        content,
        summary,
        image,
        imagePublicId,
        author: author || 'Admin',
        category: category || 'announcement',
      });

      console.log(`News created: ${newNews.id}`);

      res.status(201).json({
        success: true,
        data: newNews,
        message: 'News created successfully',
      });
    } catch (error) {
      console.error(`Error in createNews: ${error.message}`);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Cập nhật tin tức (Admin)
  async updateNews(req, res) {
    try {
      const { id } = req.params;
      const { title, content, summary, image, imagePublicId, author, category } =
        req.body;

      const updatedNews = await newsService.updateNews(id, {
        title,
        content,
        summary,
        image,
        imagePublicId,
        author,
        category,
      });

      console.log(`News updated: ${id}`);

      res.status(200).json({
        success: true,
        data: updatedNews,
        message: 'News updated successfully',
      });
    } catch (error) {
      console.error(`Error in updateNews: ${error.message}`);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Xóa tin tức (Admin)
  async deleteNews(req, res) {
    try {
      const { id } = req.params;
      
      // Lấy thông tin tin tức trước khi xóa để có được image URL
      const news = await newsService.getNewsById(id);
      
      if (!news) {
        return res.status(404).json({
          success: false,
          message: 'News not found',
        });
      }

      // Xóa ảnh từ Cloudinary nếu có
      if (news.image) {
        try {
          const publicId = extractPublicId(news.image);
          if (publicId) {
            await deleteImage(publicId);
            console.log(`Image deleted from Cloudinary: ${publicId}`);
          }
        } catch (cloudinaryError) {
          console.error(`Error deleting image from Cloudinary: ${cloudinaryError.message}`);
          // Tiếp tục xóa tin dù xóa ảnh thất bại
        }
      }

      // Xóa tin tức từ database
      await newsService.deleteNews(id);

      console.log(`News deleted: ${id}`);

      res.status(200).json({
        success: true,
        message: 'News deleted successfully',
      });
    } catch (error) {
      console.error(`Error in deleteNews: ${error.message}`);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Lấy tất cả tin tức (bao gồm chưa publish) - Admin
  async getAllNewsAdmin(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const result = await newsService.getAllNewsAdmin(
        parseInt(page),
        parseInt(limit)
      );

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
        message: 'News fetched successfully',
      });
    } catch (error) {
      console.error(`Error in getAllNewsAdmin: ${error.message}`);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Publish tin tức (Admin)
  async publishNews(req, res) {
    try {
      const { id } = req.params;
      const publishedNews = await newsService.publishNews(id);

      console.log(`News published: ${id}`);

      res.status(200).json({
        success: true,
        data: publishedNews,
        message: 'News published successfully',
      });
    } catch (error) {
      console.error(`Error in publishNews: ${error.message}`);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Unpublish tin tức (Admin)
  async unpublishNews(req, res) {
    try {
      const { id } = req.params;
      const unpublishedNews = await newsService.unpublishNews(id);

      console.log(`News unpublished: ${id}`);

      res.status(200).json({
        success: true,
        data: unpublishedNews,
        message: 'News unpublished successfully',
      });
    } catch (error) {
      console.error(`Error in unpublishNews: ${error.message}`);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Lấy tin tức mới nhất
  async getLatestNews(req, res) {
    try {
      const { limit = 5 } = req.query;
      const news = await newsService.getLatestNews(parseInt(limit));

      res.status(200).json({
        success: true,
        data: news,
        message: 'Latest news fetched successfully',
      });
    } catch (error) {
      console.error(`Error in getLatestNews: ${error.message}`);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new NewsController();
