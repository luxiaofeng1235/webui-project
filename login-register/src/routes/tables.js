const express = require('express');
const TableController = require('../controllers/TableController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// 所有路由都需要认证
router.use(authMiddleware);

// 获取所有桌台
router.get('/', TableController.getAll);

// 获取单个桌台
router.get('/:id', TableController.getById);

// 创建桌台
router.post('/', TableController.validateTable, TableController.create);

// 更新桌台
router.put('/:id', TableController.validateTable, TableController.update);

// 删除桌台
router.delete('/:id', TableController.delete);

// 更新桌台状态
router.patch('/:id/status', TableController.updateStatus);

module.exports = router;
