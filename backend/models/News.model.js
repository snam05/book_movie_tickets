import { DataTypes } from 'sequelize';
import { sequelize } from '../db.config.js';

const News = sequelize.define('News', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id'
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'title'
  },
  slug: {
    type: DataTypes.STRING(255),
    unique: true,
    allowNull: true,
    field: 'slug'
  },
  content: {
    type: DataTypes.TEXT('long'),
    allowNull: false,
    field: 'content'
  },
  summary: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'summary'
  },
  image: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'image'
  },
  category: {
    type: DataTypes.ENUM('promotion', 'event', 'announcement', 'update'),
    defaultValue: 'announcement',
    field: 'category'
  },
  isPublished: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_published'
  },
  publishedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'published_at'
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'views'
  }
}, {
  tableName: 'news',
  timestamps: true,
  underscored: true,
  hooks: {
    beforeSave: (news) => {
      // Auto-generate slug from title
      if (news.changed('title')) {
        news.slug = news.title
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
          .replace(/^-+|-+$/g, '');
      }
      // Set publishedAt when publishing
      if (news.changed('isPublished') && news.isPublished && !news.publishedAt) {
        news.publishedAt = new Date();
      }
    }
  }
});

export default News;
