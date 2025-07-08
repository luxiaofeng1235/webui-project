const express = require('express');
const SettingController = require('../controllers/SettingController');
const { authMiddleware, adminOnly } = require('../middleware/auth');

const router = express.Router();

// 所有路由都需要认证
router.use(authMiddleware);

// 获取所有设置
router.get('/', SettingController.getAll);

// 获取单个设置
router.get('/:key', SettingController.getByKey);

// 更新设置 (仅管理员)
router.put('/:key', adminOnly, SettingController.validateSetting, SettingController.update);

// 批量更新设置 (仅管理员)
router.put('/', adminOnly, SettingController.batchUpdate);

module.exports = router;
