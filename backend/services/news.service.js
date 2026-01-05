import News from '../models/News.model.js';
import { deleteImage, extractPublicId } from './cloudinary.service.js';

class NewsService {
  // Lấy tất cả tin tức đã publish
  async getAllNews(page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;
      const { count, rows } = await News.findAndCountAll({
        where: { isPublished: true },
        order: [['publishedAt', 'DESC']],
        limit,
        offset
      });
      
      return {
        data: rows,
        pagination: {
          total: count,
          page,
          pages: Math.ceil(count / limit),
        },
      };
    } catch (error) {
      throw new Error(`Error fetching news: ${error.message}`);
    }
  }

  // Lấy tin tức theo slug (không tăng view)
  async getNewsBySlug(slug) {
    try {
      const news = await News.findOne({ where: { slug, isPublished: true } });
      if (!news) {
        throw new Error('News not found');
      }
      return news;
    } catch (error) {
      throw new Error(`Error fetching news: ${error.message}`);
    }
  }

  // Tăng view count cho tin tức
  async incrementNewsViews(id) {
    try {
      const news = await News.findByPk(id);
      if (!news) {
        throw new Error('News not found');
      }
      await news.increment('views');
      return news;
    } catch (error) {
      throw new Error(`Error incrementing views: ${error.message}`);
    }
  }

  // Lấy tin tức theo ID
  async getNewsById(id) {
    try {
      const news = await News.findByPk(id);
      if (!news) {
        throw new Error('News not found');
      }
      return news;
    } catch (error) {
      throw new Error(`Error fetching news: ${error.message}`);
    }
  }

  // Lấy tin tức theo category
  async getNewsByCategory(category, page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;
      const { count, rows } = await News.findAndCountAll({
        where: { category, isPublished: true },
        order: [['publishedAt', 'DESC']],
        limit,
        offset
      });
      
      return {
        data: rows,
        pagination: {
          total: count,
          page,
          pages: Math.ceil(count / limit),
        },
      };
    } catch (error) {
      throw new Error(`Error fetching news: ${error.message}`);
    }
  }

  // Tạo tin tức mới
  async createNews(newsData) {
    try {
      const news = await News.create(newsData);
      return news;
    } catch (error) {
      throw new Error(`Error creating news: ${error.message}`);
    }
  }

  // Cập nhật tin tức
  async updateNews(id, newsData) {
    try {
      const news = await News.findByPk(id);
      if (!news) {
        throw new Error('News not found');
      }
      await news.update(newsData);
      return news;
    } catch (error) {
      throw new Error(`Error updating news: ${error.message}`);
    }
  }

  // Xóa tin tức
  async deleteNews(id) {
    try {
      const news = await News.findByPk(id);
      if (!news) {
        throw new Error('News not found');
      }
      // Xóa ảnh từ Cloudinary nếu có
      if (news.image) {
        try {
          const publicId = extractPublicId(news.image);
          if (publicId) {
            await deleteImage(publicId);
          }
        } catch (cloudinaryError) {
          console.error(`Error deleting image from Cloudinary: ${cloudinaryError.message}`);
          // Tiếp tục xóa tin dù xóa ảnh thất bại
        }
      }
      await news.destroy();
      return news;
    } catch (error) {
      throw new Error(`Error deleting news: ${error.message}`);
    }
  }

  // Lấy tất cả tin tức (bao gồm chưa publish) - dành cho admin
  async getAllNewsAdmin(page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;
      const { count, rows } = await News.findAndCountAll({
        order: [['createdAt', 'DESC']],
        limit,
        offset
      });
      
      return {
        data: rows,
        pagination: {
          total: count,
          page,
          pages: Math.ceil(count / limit),
        },
      };
    } catch (error) {
      throw new Error(`Error fetching news: ${error.message}`);
    }
  }

  // Publish tin tức
  async publishNews(id) {
    try {
      const news = await News.findByPk(id);
      if (!news) {
        throw new Error('News not found');
      }
      await news.update({
        isPublished: true,
        publishedAt: new Date()
      });
      return news;
    } catch (error) {
      throw new Error(`Error publishing news: ${error.message}`);
    }
  }

  // Unpublish tin tức
  async unpublishNews(id) {
    try {
      const news = await News.findByPk(id);
      if (!news) {
        throw new Error('News not found');
      }
      await news.update({ isPublished: false });
      return news;
    } catch (error) {
      throw new Error(`Error unpublishing news: ${error.message}`);
    }
  }

  // Lấy tin tức mới nhất
  async getLatestNews(limit = 5) {
    try {
      const news = await News.findAll({
        where: { isPublished: true },
        order: [['publishedAt', 'DESC']],
        limit
      });
      return news;
    } catch (error) {
      throw new Error(`Error fetching latest news: ${error.message}`);
    }
  }
}

export default new NewsService();
