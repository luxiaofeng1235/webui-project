const { pool } = require('../config/database');

class Table {
  static async getAll(status = null) {
    try {
      let query = 'SELECT * FROM tables';
      let params = [];

      if (status) {
        query += ' WHERE status = ?';
        params.push(status);
      }

      query += ' ORDER BY table_number ASC';

      const [rows] = await pool.execute(query, params);
      return rows;
    } catch (error) {
      throw new Error('获取桌台列表失败: ' + error.message);
    }
  }

  static async findById(id) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM tables WHERE id = ?',
        [id]
      );
      return rows[0] || null;
    } catch (error) {
      throw new Error('查找桌台失败: ' + error.message);
    }
  }

  static async findByTableNumber(tableNumber) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM tables WHERE table_number = ?',
        [tableNumber]
      );
      return rows[0] || null;
    } catch (error) {
      throw new Error('查找桌台失败: ' + error.message);
    }
  }

  static async create(tableData) {
    try {
      const {
        table_number,
        name,
        capacity,
        location,
        status = 'available'
      } = tableData;

      // 将undefined转换为null或默认值，确保数据库兼容性
      const params = [
        table_number || null,
        name || null,
        parseInt(capacity) || 4,
        location || null,
        status || 'available'
      ];

      console.log('创建桌台参数:', params);

      const [result] = await pool.execute(
        'INSERT INTO tables (table_number, name, capacity, location, status) VALUES (?, ?, ?, ?, ?)',
        params
      );
      return result.insertId;
    } catch (error) {
      throw new Error('创建桌台失败: ' + error.message);
    }
  }

  static async update(id, tableData) {
    try {
      const {
        table_number,
        name,
        capacity,
        location,
        status = 'available'
      } = tableData;

      // 将undefined转换为null或默认值，确保数据库兼容性
      const params = [
        table_number || null,
        name || null,
        parseInt(capacity) || 4,
        location || null,
        status || 'available',
        parseInt(id)
      ];

      console.log('更新桌台参数:', params);

      const [result] = await pool.execute(
        'UPDATE tables SET table_number = ?, name = ?, capacity = ?, location = ?, status = ? WHERE id = ?',
        params
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error('更新桌台失败: ' + error.message);
    }
  }

  static async delete(id) {
    try {
      const [result] = await pool.execute(
        'DELETE FROM tables WHERE id = ?',
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error('删除桌台失败: ' + error.message);
    }
  }

  static async updateStatus(id, status) {
    try {
      const [result] = await pool.execute(
        'UPDATE tables SET status = ? WHERE id = ?',
        [status, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error('更新桌台状态失败: ' + error.message);
    }
  }

  static async hasActiveOrders(tableId) {
    try {
      const [rows] = await pool.execute(
        'SELECT COUNT(*) as count FROM orders WHERE table_id = ? AND status IN (?, ?, ?)',
        [tableId, 'pending', 'preparing', 'ready']
      );
      return rows[0].count > 0;
    } catch (error) {
      throw new Error('检查桌台订单失败: ' + error.message);
    }
  }

  static async getStatusStats() {
    try {
      const [rows] = await pool.execute(`
        SELECT 
          status,
          COUNT(*) as count
        FROM tables 
        GROUP BY status
      `);
      
      const stats = {
        total: 0,
        available: 0,
        occupied: 0,
        reserved: 0,
        maintenance: 0
      };

      rows.forEach(row => {
        stats.total += row.count;
        stats[row.status] = row.count;
      });

      return stats;
    } catch (error) {
      throw new Error('获取桌台统计失败: ' + error.message);
    }
  }
}

module.exports = Table;