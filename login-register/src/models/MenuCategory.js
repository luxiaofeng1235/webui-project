const { pool } = require('../config/database');

class MenuCategory {
  static async getAll() {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM menu_categories ORDER BY sort_order ASC, created_at DESC'
      );
      return rows;
    } catch (error) {
      throw new Error('获取分类列表失败: ' + error.message);
    }
  }

  static async findById(id) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM menu_categories WHERE id = ?',
        [id]
      );
      return rows[0] || null;
    } catch (error) {
      throw new Error('查找分类失败: ' + error.message);
    }
  }

  static async create(categoryData) {
    try {
      const { name, description, status = 'active', sort_order = 0, icon = '🍜' } = categoryData;
      const [result] = await pool.execute(
        'INSERT INTO menu_categories (name, description, status, sort_order, icon) VALUES (?, ?, ?, ?, ?)',
        [name, description, status, sort_order, icon]
      );
      return result.insertId;
    } catch (error) {
      throw new Error('创建分类失败: ' + error.message);
    }
  }

  static async update(id, categoryData) {
    try {
      const { name, description, status, sort_order, icon } = categoryData;
      const [result] = await pool.execute(
        'UPDATE menu_categories SET name = ?, description = ?, status = ?, sort_order = ?, icon = ? WHERE id = ?',
        [name, description, status, sort_order, icon, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error('更新分类失败: ' + error.message);
    }
  }

  static async delete(id) {
    try {
      const [result] = await pool.execute(
        'DELETE FROM menu_categories WHERE id = ?',
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error('删除分类失败: ' + error.message);
    }
  }

  static async getItemCount(categoryId) {
    try {
      const [rows] = await pool.execute(
        'SELECT COUNT(*) as count FROM menu_items WHERE category_id = ?',
        [categoryId]
      );
      return rows[0].count;
    } catch (error) {
      throw new Error('获取分类菜品数量失败: ' + error.message);
    }
  }
}

module.exports = MenuCategory;