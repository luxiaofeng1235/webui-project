const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');

class OrderController {
  static validateOrder = [
    body('table_id').optional().isInt().withMessage('桌台ID必须是整数'),
    body('items').isArray().withMessage('订单项必须是数组'),
    body('items.*.menu_item_id').isInt().withMessage('菜品ID必须是整数'),
    body('items.*.quantity').isInt({ min: 1 }).withMessage('数量必须是大于0的整数'),
    body('items.*.price').isFloat({ min: 0 }).withMessage('价格必须是大于0的数字')
  ];

  static async getAll(req, res) {
    try {
      const { status, limit = 50, offset = 0 } = req.query;
      const orders = await Order.getAll(status, parseInt(limit), parseInt(offset));
      
      res.json({
        success: true,
        data: { orders }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;
      const order = await Order.findById(id);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: '订单不存在'
        });
      }

      res.json({
        success: true,
        data: { order }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async create(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: '输入验证失败',
          errors: errors.array()
        });
      }

      const orderId = await Order.create(req.body);
      const order = await Order.findById(orderId);

      res.status(201).json({
        success: true,
        message: '订单创建成功',
        data: { order }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!['pending', 'preparing', 'ready', 'completed', 'cancelled'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: '无效的订单状态'
        });
      }

      const updated = await Order.updateStatus(id, status);

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: '订单不存在'
        });
      }

      const order = await Order.findById(id);

      res.json({
        success: true,
        message: '订单状态更新成功',
        data: { order }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async getStats(req, res) {
    try {
      const stats = await Order.getTodayStats();
      
      res.json({
        success: true,
        data: { stats }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = OrderController;