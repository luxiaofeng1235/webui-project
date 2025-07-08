const { pool } = require('../config/database');

class User {
  static async findByUsername(username) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM users WHERE username = ?',
        [username]
      );
      return rows[0] || null;
    } catch (error) {
      throw new Error('查找用户失败: ' + error.message);
    }
  }

  static async findByEmail(email) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
      return rows[0] || null;
    } catch (error) {
      throw new Error('查找用户失败: ' + error.message);
    }
  }

  static async create(userData) {
    try {
      const { username, email, password, role = 'staff' } = userData;
      const [result] = await pool.execute(
        'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
        [username, email, password, role]
      );
      return result.insertId;
    } catch (error) {
      throw new Error('创建用户失败: ' + error.message);
    }
  }

  static async findById(id) {
    try {
      const [rows] = await pool.execute(
        'SELECT id, username, email, role, created_at FROM users WHERE id = ?',
        [id]
      );
      return rows[0] || null;
    } catch (error) {
      throw new Error('查找用户失败: ' + error.message);
    }
  }

  static async getAll(role = null, status = null, limit = 50, offset = 0) {
    try {
      let query = 'SELECT id, username, email, role, created_at FROM users';
      let params = [];
      let conditions = [];

      if (role) {
        conditions.push('role = ?');
        params.push(role);
      }

      if (status) {
        conditions.push('status = ?');
        params.push(status);
      }

      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }

      query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
      params.push(limit, offset);

      const [rows] = await pool.execute(query, params);
      return rows;
    } catch (error) {
      throw new Error('获取用户列表失败: ' + error.message);
    }
  }

  static async update(id, userData) {
    try {
      const { username, email, role } = userData;
      const [result] = await pool.execute(
        'UPDATE users SET username = ?, email = ?, role = ? WHERE id = ?',
        [username, email, role, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error('更新用户失败: ' + error.message);
    }
  }

  static async delete(id) {
    try {
      const [result] = await pool.execute(
        'DELETE FROM users WHERE id = ?',
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error('删除用户失败: ' + error.message);
    }
  }
}

module.exports = User;