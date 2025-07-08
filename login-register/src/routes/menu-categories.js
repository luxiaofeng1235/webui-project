const express = require('express');
const MenuCategoryController = require('../controllers/MenuCategoryController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// 所有路由都需要认证
router.use(authMiddleware);

// 获取所有分类
router.get('/', MenuCategoryController.getAll);

// 获取单个分类
router.get('/:id', MenuCategoryController.getById);

// 创建分类
router.post('/', MenuCategoryController.validateCategory, MenuCategoryController.create);

// 更新分类
router.put('/:id', MenuCategoryController.validateCategory, MenuCategoryController.update);

// 删除分类
router.delete('/:id', MenuCategoryController.delete);

module.exports = router;