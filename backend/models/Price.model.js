import { DataTypes } from 'sequelize';
import { sequelize } from '../db.config.js';

const Price = sequelize.define('Price', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id'
  },
  seatType: {
    type: DataTypes.ENUM('standard', 'premium', 'vip'),
    allowNull: false,
    unique: true,
    field: 'seat_type'
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'price'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'description'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active'
  }
}, {
  tableName: 'prices',
  timestamps: true,
  underscored: true
});

export default Price;
