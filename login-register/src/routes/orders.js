const express = require('express');
const OrderController = require('../controllers/OrderController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// 所有路由都需要认证
router.use(authMiddleware);

// 获取所有订单
router.get('/', OrderController.getAll);

// 获取订单统计
router.get('/stats', OrderController.getStats);

// 获取单个订单
router.get('/:id', OrderController.getById);

// 创建订单
router.post('/', OrderController.validateOrder, OrderController.create);

// 更新订单状态
router.patch('/:id/status', OrderController.updateStatus);

module.exports = router;