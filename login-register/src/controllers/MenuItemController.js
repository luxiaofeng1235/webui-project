const { body, validationResult } = require('express-validator');
const MenuItem = require('../models/MenuItem');

class MenuItemController {
  static validateMenuItem = [
    body('name').notEmpty().withMessage('菜品名称不能为空'),
    body('category_id').isInt().withMessage('分类ID必须是整数'),
    body('price').isFloat({ min: 0 }).withMessage('价格必须是大于0的数字'),
    body('stock_quantity').optional().isInt({ min: 0 }).withMessage('库存数量必须是非负整数'),
    body('unit').optional().notEmpty().withMessage('单位不能为空'),
    body('status').optional().isIn(['available', 'unavailable']).withMessage('状态值无效')
  ];

  static async getAll(req, res) {
    try {
      const { category_id, status } = req.query;
      const items = await MenuItem.getAll(category_id, status);
      
      res.json({
        success: true,
        data: { items }
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
      const item = await MenuItem.findById(id);

      if (!item) {
        return res.status(404).json({
          success: false,
          message: '菜品不存在'
        });
      }

      res.json({
        success: true,
        data: { item }
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

      const itemId = await MenuItem.create(req.body);
      const item = await MenuItem.findById(itemId);

      res.status(201).json({
        success: true,
        message: '菜品创建成功',
        data: { item }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async update(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: '输入验证失败',
          errors: errors.array()
        });
      }

      const { id } = req.params;
      const updated = await MenuItem.update(id, req.body);

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: '菜品不存在'
        });
      }

      const item = await MenuItem.findById(id);

      res.json({
        success: true,
        message: '菜品更新成功',
        data: { item }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await MenuItem.delete(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: '菜品不存在'
        });
      }

      res.json({
        success: true,
        message: '菜品删除成功'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = MenuItemController;