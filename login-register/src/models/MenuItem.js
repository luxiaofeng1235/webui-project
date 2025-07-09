const { pool } = require('../config/database');

class MenuItem {
  static async getAll(categoryId = null, status = null) {
    try {
      let query = `
        SELECT mi.*, mc.name as category_name 
        FROM menu_items mi 
        LEFT JOIN menu_categories mc ON mi.category_id = mc.id
      `;
      let params = [];
      let conditions = [];

      if (categoryId) {
        conditions.push('mi.category_id = ?');
        params.push(categoryId);
      }

      if (status) {
        conditions.push('mi.status = ?');
        params.push(status);
      }

      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }

      query += ' ORDER BY mi.sort_order ASC, mi.created_at DESC';

      const [rows] = await pool.execute(query, params);
      return rows;
    } catch (error) {
      throw new Error('获取菜品列表失败: ' + error.message);
    }
  }

  static async findById(id) {
    try {
      const [rows] = await pool.execute(
        'SELECT mi.*, mc.name as category_name FROM menu_items mi LEFT JOIN menu_categories mc ON mi.category_id = mc.id WHERE mi.id = ?',
        [id]
      );
      return rows[0] || null;
    } catch (error) {
      throw new Error('查找菜品失败: ' + error.message);
    }
  }

  static async create(itemData) {
    try {
      const {
        category_id,
        name,
        description,
        price,
        image_url,
        status = 'available',
        sort_order = 0,
        stock_quantity = 0,
        unit = '份'
      } = itemData;

      // 将undefined转换为null，确保数据库兼容性
      const params = [
        category_id || null,
        name || null,
        description || null,
        price || null,
        image_url || null,
        status || 'available',
        sort_order || 0,
        stock_quantity || 0,
        unit || '份'
      ];

      const [result] = await pool.execute(
        'INSERT INTO menu_items (category_id, name, description, price, image_url, status, sort_order, stock_quantity, unit) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        params
      );
      return result.insertId;
    } catch (error) {
      throw new Error('创建菜品失败: ' + error.message);
    }
  }

  static async update(id, itemData) {
    try {
      const {
        category_id,
        name,
        description,
        price,
        image_url,
        status = 'available',
        sort_order = 0,
        stock_quantity = 0,
        unit = '份'
      } = itemData;

      // 将undefined转换为null，确保数据库兼容性
      const params = [
        category_id || null,
        name || null,
        description || null,
        price || null,
        image_url || null,
        status || 'available',
        sort_order || 0,
        stock_quantity || 0,
        unit || '份',
        id
      ];

      const [result] = await pool.execute(
        'UPDATE menu_items SET category_id = ?, name = ?, description = ?, price = ?, image_url = ?, status = ?, sort_order = ?, stock_quantity = ?, unit = ? WHERE id = ?',
        params
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error('更新菜品失败: ' + error.message);
    }
  }

  static async delete(id) {
    try {
      const [result] = await pool.execute(
        'DELETE FROM menu_items WHERE id = ?',
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error('删除菜品失败: ' + error.message);
    }
  }

  static async updateStatus(id, status) {
    try {
      const [result] = await pool.execute(
        'UPDATE menu_items SET status = ? WHERE id = ?',
        [status, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error('更新菜品状态失败: ' + error.message);
    }
  }

  static async updateStock(id, quantity) {
    try {
      const [result] = await pool.execute(
        'UPDATE menu_items SET stock_quantity = ? WHERE id = ?',
        [quantity, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error('更新库存失败: ' + error.message);
    }
  }

  static async decreaseStock(id, quantity) {
    try {
      const [result] = await pool.execute(
        'UPDATE menu_items SET stock_quantity = stock_quantity - ? WHERE id = ? AND stock_quantity >= ?',
        [quantity, id, quantity]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error('减少库存失败: ' + error.message);
    }
  }
}

module.exports = MenuItem;