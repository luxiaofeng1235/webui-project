const express = require('express');
const UserController = require('../controllers/UserController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// 所有路由都需要认证
router.use(authMiddleware);

// 获取所有用户
router.get('/', UserController.getAll);

// 获取单个用户
router.get('/:id', UserController.getById);

// 创建用户
router.post('/', UserController.validateUser, UserController.create);

// 更新用户
router.put('/:id', UserController.validateUser, UserController.update);

// 删除用户
router.delete('/:id', UserController.delete);

// 重置密码
router.post('/:id/reset-password', UserController.resetPassword);

module.exports = router;