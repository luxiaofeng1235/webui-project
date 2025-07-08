const { body, validationResult } = require('express-validator');
const Setting = require('../models/Setting');

class SettingController {
  static validateSetting = [
    body('setting_value').notEmpty().withMessage('设置值不能为空')
  ];

  static async getAll(req, res) {
    try {
      const settings = await Setting.getAll();
      
      // 转换为键值对格式
      const settingsMap = {};
      settings.forEach(setting => {
        settingsMap[setting.setting_key] = {
          value: setting.setting_value,
          description: setting.description
        };
      });

      res.json({
        success: true,
        data: { settings: settingsMap }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async getByKey(req, res) {
    try {
      const { key } = req.params;
      const setting = await Setting.findByKey(key);
      
      if (!setting) {
        return res.status(404).json({
          success: false,
          message: '设置项不存在'
        });
      }

      res.json({
        success: true,
        data: { setting }
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

      const { key } = req.params;
      const { setting_value } = req.body;

      // 检查设置项是否存在
      const existingSetting = await Setting.findByKey(key);
      if (!existingSetting) {
        return res.status(404).json({
          success: false,
          message: '设置项不存在'
        });
      }

      const success = await Setting.update(key, setting_value);
      if (!success) {
        return res.status(500).json({
          success: false,
          message: '更新失败'
        });
      }

      const setting = await Setting.findByKey(key);

      res.json({
        success: true,
        message: '设置更新成功',
        data: { setting }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async batchUpdate(req, res) {
    try {
      const { settings } = req.body;

      if (!settings || typeof settings !== 'object') {
        return res.status(400).json({
          success: false,
          message: '设置数据格式错误'
        });
      }

      const results = [];
      for (const [key, value] of Object.entries(settings)) {
        try {
          const success = await Setting.update(key, value);
          results.push({ key, success });
        } catch (error) {
          results.push({ key, success: false, error: error.message });
        }
      }

      const allSuccess = results.every(result => result.success);

      res.json({
        success: allSuccess,
        message: allSuccess ? '所有设置更新成功' : '部分设置更新失败',
        data: { results }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = SettingController;
