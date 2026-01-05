import Price from '../models/Price.model.js';

class PriceService {
  // Lấy tất cả giá vé
  async getAllPrices() {
    try {
      const prices = await Price.findAll({
        where: { isActive: true },
        order: [['seatType', 'ASC']]
      });
      return prices;
    } catch (error) {
      throw new Error(`Error fetching prices: ${error.message}`);
    }
  }

  // Lấy giá vé theo ID
  async getPriceById(id) {
    try {
      const price = await Price.findByPk(id);
      if (!price) {
        throw new Error('Price not found');
      }
      return price;
    } catch (error) {
      throw new Error(`Error fetching price: ${error.message}`);
    }
  }

  // Lấy giá vé theo loại
  async getPriceBySeatType(seatType) {
    try {
      const price = await Price.findOne({ where: { seatType } });
      if (!price) {
        throw new Error('Price not found for this seat type');
      }
      return price;
    } catch (error) {
      throw new Error(`Error fetching price: ${error.message}`);
    }
  }

  // Tạo giá vé mới
  async createPrice(priceData) {
    try {
      const price = await Price.create(priceData);
      return price;
    } catch (error) {
      throw new Error(`Error creating price: ${error.message}`);
    }
  }

  // Cập nhật giá vé
  async updatePrice(id, priceData) {
    try {
      const price = await Price.findByPk(id);
      if (!price) {
        throw new Error('Price not found');
      }
      await price.update(priceData);
      return price;
    } catch (error) {
      throw new Error(`Error updating price: ${error.message}`);
    }
  }

  // Xóa giá vé
  async deletePrice(id) {
    try {
      const price = await Price.findByPk(id);
      if (!price) {
        throw new Error('Price not found');
      }
      await price.destroy();
      return price;
    } catch (error) {
      throw new Error(`Error deleting price: ${error.message}`);
    }
  }

  // Lấy tất cả giá vé (bao gồm không active)
  async getAllPricesAdmin() {
    try {
      const prices = await Price.findAll({
        order: [['seatType', 'ASC']]
      });
      return prices;
    } catch (error) {
      throw new Error(`Error fetching prices: ${error.message}`);
    }
  }
}

export default new PriceService();
