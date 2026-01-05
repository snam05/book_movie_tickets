import priceService from '../services/price.service.js';

class PriceController {
  // Lấy tất cả giá vé
  async getAllPrices(req, res) {
    try {
      const prices = await priceService.getAllPrices();
      res.status(200).json({
        success: true,
        data: prices,
        message: 'Prices fetched successfully',
      });
    } catch (error) {
      console.error(`Error in getAllPrices: ${error.message}`);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Lấy giá vé theo ID
  async getPriceById(req, res) {
    try {
      const { id } = req.params;
      const price = await priceService.getPriceById(id);
      res.status(200).json({
        success: true,
        data: price,
        message: 'Price fetched successfully',
      });
    } catch (error) {
      console.error(`Error in getPriceById: ${error.message}`);
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Lấy giá vé theo loại ghế
  async getPriceBySeatType(req, res) {
    try {
      const { seatType } = req.params;
      const price = await priceService.getPriceBySeatType(seatType);
      res.status(200).json({
        success: true,
        data: price,
        message: 'Price fetched successfully',
      });
    } catch (error) {
      console.error(`Error in getPriceBySeatType: ${error.message}`);
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Tạo giá vé mới (Admin)
  async createPrice(req, res) {
    try {
      const { seatType, seatTypeVietnamese, price, description } = req.body;

      // Validation
      if (!seatType || !seatTypeVietnamese || price === undefined) {
        return res.status(400).json({
          success: false,
          message: 'Please provide all required fields',
        });
      }

      const newPrice = await priceService.createPrice({
        seatType,
        seatTypeVietnamese,
        price,
        description,
      });

      console.log(`Price created: ${newPrice.id}`);

      res.status(201).json({
        success: true,
        data: newPrice,
        message: 'Price created successfully',
      });
    } catch (error) {
      console.error(`Error in createPrice: ${error.message}`);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Cập nhật giá vé (Admin)
  async updatePrice(req, res) {
    try {
      const { id } = req.params;
      const { seatType, seatTypeVietnamese, price, description, isActive } = req.body;

      const updatedPrice = await priceService.updatePrice(id, {
        seatType,
        seatTypeVietnamese,
        price,
        description,
        isActive,
      });

      console.log(`Price updated: ${id}`);

      res.status(200).json({
        success: true,
        data: updatedPrice,
        message: 'Price updated successfully',
      });
    } catch (error) {
      console.error(`Error in updatePrice: ${error.message}`);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Xóa giá vé (Admin)
  async deletePrice(req, res) {
    try {
      const { id } = req.params;
      await priceService.deletePrice(id);

      console.log(`Price deleted: ${id}`);

      res.status(200).json({
        success: true,
        message: 'Price deleted successfully',
      });
    } catch (error) {
      console.error(`Error in deletePrice: ${error.message}`);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Lấy tất cả giá vé (bao gồm không active) - Admin
  async getAllPricesAdmin(req, res) {
    try {
      const prices = await priceService.getAllPricesAdmin();
      res.status(200).json({
        success: true,
        data: prices,
        message: 'Prices fetched successfully',
      });
    } catch (error) {
      console.error(`Error in getAllPricesAdmin: ${error.message}`);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new PriceController();
