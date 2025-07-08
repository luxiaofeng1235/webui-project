const { pool } = require('../config/database');

class Order {
  static async getAll(status = null, limit = 50, offset = 0) {
    try {
      let query = `
        SELECT o.*, t.table_number, t.name as table_name,
               COUNT(oi.id) as item_count
        FROM orders o
        LEFT JOIN tables t ON o.table_id = t.id
        LEFT JOIN order_items oi ON o.id = oi.order_id
      `;
      let params = [];

      if (status) {
        query += ' WHERE o.status = ?';
        params.push(status);
      }

      query += ' GROUP BY o.id ORDER BY o.created_at DESC LIMIT ? OFFSET ?';
      params.push(limit, offset);

      const [rows] = await pool.execute(query, params);
      return rows;
    } catch (error) {
      throw new Error('获取订单列表失败: ' + error.message);
    }
  }

  static async findById(id) {
    try {
      const [orderRows] = await pool.execute(`
        SELECT o.*, t.table_number, t.name as table_name
        FROM orders o
        LEFT JOIN tables t ON o.table_id = t.id
        WHERE o.id = ?
      `, [id]);

      if (orderRows.length === 0) {
        return null;
      }

      const order = orderRows[0];

      const [itemRows] = await pool.execute(`
        SELECT oi.*, mi.name as item_name
        FROM order_items oi
        LEFT JOIN menu_items mi ON oi.menu_item_id = mi.id
        WHERE oi.order_id = ?
      `, [id]);

      order.items = itemRows;
      return order;
    } catch (error) {
      throw new Error('查找订单失败: ' + error.message);
    }
  }

  static async create(orderData) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const { table_id, items } = orderData;

      // 生成订单号
      const orderNumber = 'D' + Date.now().toString().slice(-6);

      // 计算总金额
      let totalAmount = 0;
      for (const item of items) {
        totalAmount += item.price * item.quantity;
      }

      // 创建订单
      const [orderResult] = await connection.execute(
        'INSERT INTO orders (order_number, table_id, total_amount, status) VALUES (?, ?, ?, ?)',
        [orderNumber, table_id, totalAmount, 'pending']
      );

      const orderId = orderResult.insertId;

      // 创建订单详情
      for (const item of items) {
        const subtotal = item.price * item.quantity;
        await connection.execute(
          'INSERT INTO order_items (order_id, menu_item_id, quantity, price, subtotal) VALUES (?, ?, ?, ?, ?)',
          [orderId, item.menu_item_id, item.quantity, item.price, subtotal]
        );
      }

      // 更新桌台状态
      if (table_id) {
        await connection.execute(
          'UPDATE tables SET status = ? WHERE id = ?',
          ['occupied', table_id]
        );
      }

      await connection.commit();
      return orderId;
    } catch (error) {
      await connection.rollback();
      throw new Error('创建订单失败: ' + error.message);
    } finally {
      connection.release();
    }
  }

  static async updateStatus(id, status) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const [result] = await connection.execute(
        'UPDATE orders SET status = ? WHERE id = ?',
        [status, id]
      );

      // 如果订单完成，释放桌台
      if (status === 'completed') {
        const [orderRows] = await connection.execute(
          'SELECT table_id FROM orders WHERE id = ?',
          [id]
        );

        if (orderRows.length > 0 && orderRows[0].table_id) {
          await connection.execute(
            'UPDATE tables SET status = ? WHERE id = ?',
            ['available', orderRows[0].table_id]
          );
        }
      }

      await connection.commit();
      return result.affectedRows > 0;
    } catch (error) {
      await connection.rollback();
      throw new Error('更新订单状态失败: ' + error.message);
    } finally {
      connection.release();
    }
  }

  static async getTodayStats() {
    try {
      const [rows] = await pool.execute(`
        SELECT 
          COUNT(*) as total_orders,
          SUM(total_amount) as total_revenue,
          SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_orders,
          SUM(CASE WHEN status = 'preparing' THEN 1 ELSE 0 END) as preparing_orders,
          SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_orders
        FROM orders 
        WHERE DATE(created_at) = CURDATE()
      `);

      return rows[0] || {
        total_orders: 0,
        total_revenue: 0,
        pending_orders: 0,
        preparing_orders: 0,
        completed_orders: 0
      };
    } catch (error) {
      throw new Error('获取今日统计失败: ' + error.message);
    }
  }
}

module.exports = Order;