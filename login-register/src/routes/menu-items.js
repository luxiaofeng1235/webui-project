const express = require('express');
const MenuItemController = require('../controllers/MenuItemController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// 所有路由都需要认证
router.use(authMiddleware);

// 获取所有菜品
router.get('/', MenuItemController.getAll);

// 获取单个菜品
router.get('/:id', MenuItemController.getById);

// 创建菜品
router.post('/', MenuItemController.validateMenuItem, MenuItemController.create);

// 更新菜品
router.put('/:id', MenuItemController.validateMenuItem, MenuItemController.update);

// 删除菜品
router.delete('/:id', MenuItemController.delete);

module.exports = router;