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
      // 构建动态更新查询，只更新传递的字段
      const updateFields = [];
      const updateValues = [];

      if (categoryData.name !== undefined) {
        updateFields.push('name = ?');
        updateValues.push(categoryData.name);
      }

      if (categoryData.description !== undefined) {
        updateFields.push('description = ?');
        updateValues.push(categoryData.description);
      }

      if (categoryData.status !== undefined) {
        updateFields.push('status = ?');
        updateValues.push(categoryData.status);
      }

      if (categoryData.sort_order !== undefined) {
        updateFields.push('sort_order = ?');
        updateValues.push(categoryData.sort_order);
      }

      if (categoryData.icon !== undefined) {
        updateFields.push('icon = ?');
        updateValues.push(categoryData.icon);
      }

      if (updateFields.length === 0) {
        throw new Error('没有要更新的字段');
      }

      // 添加WHERE条件的参数
      updateValues.push(id);

      const query = `UPDATE menu_categories SET ${updateFields.join(', ')} WHERE id = ?`;
      const [result] = await pool.execute(query, updateValues);

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