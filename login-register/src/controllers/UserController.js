const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

class UserController {
  static validateUser = [
    body('username').isLength({ min: 3 }).withMessage('用户名至少3个字符'),
    body('email').isEmail().withMessage('邮箱格式不正确'),
    body('password').optional().isLength({ min: 6 }).withMessage('密码至少6个字符'),
    body('role').optional().isIn(['admin', 'staff']).withMessage('角色值无效')
  ];

  static async getAll(req, res) {
    try {
      const { role, status } = req.query;
      const users = await User.getAll(role, status);
      
      // 移除密码字段
      users.forEach(user => delete user.password);
      
      res.json({
        success: true,
        data: { users }
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
      const user = await User.findById(id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: '用户不存在'
        });
      }

      delete user.password;

      res.json({
        success: true,
        data: { user }
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

      // 检查用户名和邮箱是否已存在
      const existingUser = await User.findByUsername(req.body.username);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: '用户名已存在'
        });
      }

      const existingEmail = await User.findByEmail(req.body.email);
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: '邮箱已存在'
        });
      }

      // 加密密码
      const hashedPassword = await bcrypt.hash(req.body.password, 12);
      const userData = {
        ...req.body,
        password: hashedPassword
      };

      const userId = await User.create(userData);
      const user = await User.findById(userId);
      delete user.password;

      res.status(201).json({
        success: true,
        message: '用户创建成功',
        data: { user }
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
      const updateData = { ...req.body };

      // 如果有密码，先加密
      if (updateData.password) {
        updateData.password = await bcrypt.hash(updateData.password, 12);
      }

      const updated = await User.update(id, updateData);

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: '用户不存在'
        });
      }

      const user = await User.findById(id);
      delete user.password;

      res.json({
        success: true,
        message: '用户更新成功',
        data: { user }
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

      // 不能删除自己
      if (req.user && req.user.id == id) {
        return res.status(400).json({
          success: false,
          message: '不能删除自己的账户'
        });
      }

      const deleted = await User.delete(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: '用户不存在'
        });
      }

      res.json({
        success: true,
        message: '用户删除成功'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async resetPassword(req, res) {
    try {
      const { id } = req.params;
      const { newPassword } = req.body;

      if (!newPassword || newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: '新密码至少6个字符'
        });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 12);
      const updated = await User.updatePassword(id, hashedPassword);

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: '用户不存在'
        });
      }

      res.json({
        success: true,
        message: '密码重置成功'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = UserController;