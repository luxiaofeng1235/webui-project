const { pool } = require('../config/database');

class Setting {
  static async getAll() {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM settings ORDER BY setting_key ASC'
      );
      return rows;
    } catch (error) {
      throw new Error('获取设置失败: ' + error.message);
    }
  }

  static async findByKey(key) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM settings WHERE setting_key = ?',
        [key]
      );
      return rows[0] || null;
    } catch (error) {
      throw new Error('获取设置失败: ' + error.message);
    }
  }

  static async get(key) {
    try {
      const [rows] = await pool.execute(
        'SELECT setting_value FROM settings WHERE setting_key = ?',
        [key]
      );
      return rows[0] ? rows[0].setting_value : null;
    } catch (error) {
      throw new Error('获取设置失败: ' + error.message);
    }
  }

  static async update(key, value) {
    try {
      const [result] = await pool.execute(
        'UPDATE settings SET setting_value = ? WHERE setting_key = ?',
        [value, key]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error('更新设置失败: ' + error.message);
    }
  }

  static async set(key, value, description = null) {
    try {
      const [result] = await pool.execute(
        'INSERT INTO settings (setting_key, setting_value, description) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE setting_value = ?, description = COALESCE(?, description)',
        [key, value, description, value, description]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error('保存设置失败: ' + error.message);
    }
  }

  static async setBatch(settings) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      for (const [key, value] of Object.entries(settings)) {
        await connection.execute(
          'INSERT INTO settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
          [key, value, value]
        );
      }

      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw new Error('批量保存设置失败: ' + error.message);
    } finally {
      connection.release();
    }
  }

  static async delete(key) {
    try {
      const [result] = await pool.execute(
        'DELETE FROM settings WHERE setting_key = ?',
        [key]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error('删除设置失败: ' + error.message);
    }
  }
}

module.exports = Setting;