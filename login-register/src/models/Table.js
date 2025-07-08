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
      const { table_number, name, capacity, location, status = 'available' } = tableData;
      const [result] = await pool.execute(
        'INSERT INTO tables (table_number, name, capacity, location, status) VALUES (?, ?, ?, ?, ?)',
        [table_number, name, capacity, location, status]
      );
      return result.insertId;
    } catch (error) {
      throw new Error('创建桌台失败: ' + error.message);
    }
  }

  static async update(id, tableData) {
    try {
      const { table_number, name, capacity, location, status } = tableData;
      const [result] = await pool.execute(
        'UPDATE tables SET table_number = ?, name = ?, capacity = ?, location = ?, status = ? WHERE id = ?',
        [table_number, name, capacity, location, status, id]
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