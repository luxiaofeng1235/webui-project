const express = require('express');
const AuthController = require('../controllers/AuthController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// 登录
router.post('/login', AuthController.validateLogin, AuthController.login);

// 注册
router.post('/register', AuthController.validateRegister, AuthController.register);

// 获取当前用户信息 (需要认证)
router.get('/me', authMiddleware, AuthController.getCurrentUser);

module.exports = router;