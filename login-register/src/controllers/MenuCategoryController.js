const { body, validationResult } = require('express-validator');
const MenuCategory = require('../models/MenuCategory');

class MenuCategoryController {
  static validateCategory = [
    body('name').notEmpty().withMessage('分类名称不能为空'),
    body('status').optional().isIn(['active', 'inactive']).withMessage('状态值无效')
  ];

  static async getAll(req, res) {
    try {
      const categories = await MenuCategory.getAll();
      
      // 为每个分类添加菜品数量
      for (let category of categories) {
        category.item_count = await MenuCategory.getItemCount(category.id);
      }

      res.json({
        success: true,
        data: { categories }
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
      const category = await MenuCategory.findById(id);

      if (!category) {
        return res.status(404).json({
          success: false,
          message: '分类不存在'
        });
      }

      res.json({
        success: true,
        data: { category }
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

      const categoryId = await MenuCategory.create(req.body);
      const category = await MenuCategory.findById(categoryId);

      res.status(201).json({
        success: true,
        message: '分类创建成功',
        data: { category }
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
      const updated = await MenuCategory.update(id, req.body);

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: '分类不存在'
        });
      }

      const category = await MenuCategory.findById(id);

      res.json({
        success: true,
        message: '分类更新成功',
        data: { category }
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
      
      // 检查是否有菜品属于该分类
      const itemCount = await MenuCategory.getItemCount(id);
      if (itemCount > 0) {
        return res.status(400).json({
          success: false,
          message: '该分类下还有菜品，无法删除'
        });
      }

      const deleted = await MenuCategory.delete(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: '分类不存在'
        });
      }

      res.json({
        success: true,
        message: '分类删除成功'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = MenuCategoryController;