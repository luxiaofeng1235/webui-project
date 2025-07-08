const mysql = require('mysql2/promise');
require('dotenv').config();

async function initDatabase() {
  let connection;
  
  try {
    // 先连接到MySQL服务器（不指定数据库）
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    });

    // 创建数据库
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    console.log('数据库创建成功');

    // 关闭连接
    await connection.end();

    // 重新连接到指定数据库
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    // 创建用户表
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'staff') DEFAULT 'staff',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // 创建菜品分类表
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS menu_categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        description TEXT,
        icon VARCHAR(10) DEFAULT '🍜',
        status ENUM('active', 'inactive') DEFAULT 'active',
        sort_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // 如果icon字段不存在，添加它
    try {
      await connection.execute(`
        ALTER TABLE menu_categories ADD COLUMN icon VARCHAR(10) DEFAULT '🍜'
      `);
      console.log('menu_categories 表添加 icon 字段成功');
    } catch (error) {
      if (error.code !== 'ER_DUP_FIELDNAME') {
        console.log('icon 字段已存在或添加失败:', error.message);
      }
    }

    // 创建菜品表
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS menu_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        category_id INT,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        image_url VARCHAR(255),
        status ENUM('available', 'unavailable') DEFAULT 'available',
        sort_order INT DEFAULT 0,
        stock_quantity INT DEFAULT 0 COMMENT '库存数量',
        unit VARCHAR(20) DEFAULT '份' COMMENT '单位',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES menu_categories(id) ON DELETE SET NULL,
        INDEX idx_category_id (category_id),
        INDEX idx_status (status)
      )
    `);

    // 如果菜品表已存在，添加新字段
    try {
      await connection.execute(`
        ALTER TABLE menu_items ADD COLUMN stock_quantity INT DEFAULT 0 COMMENT '库存数量'
      `);
      console.log('menu_items 表添加 stock_quantity 字段成功');
    } catch (error) {
      if (error.code !== 'ER_DUP_FIELDNAME') {
        console.log('stock_quantity 字段已存在或添加失败:', error.message);
      }
    }

    try {
      await connection.execute(`
        ALTER TABLE menu_items ADD COLUMN unit VARCHAR(20) DEFAULT '份' COMMENT '单位'
      `);
      console.log('menu_items 表添加 unit 字段成功');
    } catch (error) {
      if (error.code !== 'ER_DUP_FIELDNAME') {
        console.log('unit 字段已存在或添加失败:', error.message);
      }
    }

    // 创建桌台表
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS tables (
        id INT AUTO_INCREMENT PRIMARY KEY,
        table_number VARCHAR(20) UNIQUE NOT NULL,
        name VARCHAR(50) NOT NULL,
        capacity INT NOT NULL,
        status ENUM('available', 'occupied', 'reserved', 'maintenance') DEFAULT 'available',
        location VARCHAR(100) COMMENT '位置描述',
        qr_code VARCHAR(255) COMMENT '二维码链接',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_status (status),
        INDEX idx_table_number (table_number)
      )
    `);

    // 如果桌台表已存在，添加新字段
    try {
      await connection.execute(`
        ALTER TABLE tables ADD COLUMN location VARCHAR(100) COMMENT '位置描述'
      `);
      console.log('tables 表添加 location 字段成功');
    } catch (error) {
      if (error.code !== 'ER_DUP_FIELDNAME') {
        console.log('location 字段已存在或添加失败:', error.message);
      }
    }

    try {
      await connection.execute(`
        ALTER TABLE tables ADD COLUMN qr_code VARCHAR(255) COMMENT '二维码链接'
      `);
      console.log('tables 表添加 qr_code 字段成功');
    } catch (error) {
      if (error.code !== 'ER_DUP_FIELDNAME') {
        console.log('qr_code 字段已存在或添加失败:', error.message);
      }
    }

    // 更新桌台状态枚举值
    try {
      await connection.execute(`
        ALTER TABLE tables MODIFY COLUMN status ENUM('available', 'occupied', 'reserved', 'maintenance') DEFAULT 'available'
      `);
      console.log('tables 表更新 status 枚举值成功');
    } catch (error) {
      console.log('status 枚举值更新失败:', error.message);
    }

    // 创建订单表
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_number VARCHAR(50) UNIQUE NOT NULL,
        table_id INT,
        customer_name VARCHAR(50) COMMENT '客户姓名',
        customer_phone VARCHAR(20) COMMENT '客户电话',
        total_amount DECIMAL(10,2) NOT NULL,
        discount_amount DECIMAL(10,2) DEFAULT 0 COMMENT '折扣金额',
        tax_amount DECIMAL(10,2) DEFAULT 0 COMMENT '税费',
        service_charge DECIMAL(10,2) DEFAULT 0 COMMENT '服务费',
        final_amount DECIMAL(10,2) NOT NULL COMMENT '最终金额',
        payment_method ENUM('cash', 'card', 'alipay', 'wechat') COMMENT '支付方式',
        payment_status ENUM('unpaid', 'paid', 'refunded') DEFAULT 'unpaid',
        status ENUM('pending', 'preparing', 'ready', 'completed', 'cancelled') DEFAULT 'pending',
        notes TEXT COMMENT '备注',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (table_id) REFERENCES tables(id) ON DELETE SET NULL,
        INDEX idx_order_number (order_number),
        INDEX idx_status (status),
        INDEX idx_payment_status (payment_status),
        INDEX idx_created_at (created_at)
      )
    `);

    // 创建订单详情表
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        menu_item_id INT NOT NULL,
        quantity INT NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        subtotal DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE
      )
    `);

    // 创建系统设置表
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        setting_key VARCHAR(100) UNIQUE NOT NULL,
        setting_value TEXT,
        description VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // 插入默认数据
    await insertDefaultData(connection);

    console.log('数据库表创建成功！');
  } catch (error) {
    console.error('数据库初始化失败:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

async function insertDefaultData(connection) {
  try {
    // 插入默认管理员用户
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    try {
      await connection.execute(
        'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
        ['admin', 'admin@restaurant.com', hashedPassword, 'admin']
      );
      console.log('默认管理员用户创建成功');
    } catch (error) {
      if (error.code !== 'ER_DUP_ENTRY') {
        throw error;
      }
      console.log('默认管理员用户已存在');
    }

    // 插入默认菜品分类
    const categories = [
      [1, '热菜', '各种炒菜、炖菜等热菜', '🍜'],
      [2, '凉菜', '各种凉拌菜、冷菜', '🥗'],
      [3, '汤类', '各种汤品', '🍲'],
      [4, '饮品', '各种饮料、茶水', '🥤']
    ];

    for (const [id, name, description, icon] of categories) {
      try {
        await connection.execute(
          'INSERT INTO menu_categories (id, name, description, icon) VALUES (?, ?, ?, ?)',
          [id, name, description, icon]
        );
      } catch (error) {
        if (error.code !== 'ER_DUP_ENTRY') {
          throw error;
        }
      }
    }
    console.log('默认菜品分类创建成功');

    // 插入默认菜品
    const menuItems = [
      [1, 1, '红烧肉', '经典红烧肉，肥瘦相间，入口即化', 38.00, 50, '份'],
      [2, 1, '糖醋排骨', '酸甜可口的糖醋排骨', 42.00, 30, '份'],
      [3, 1, '宫保鸡丁', '川菜经典，麻辣鲜香', 32.00, 40, '份'],
      [4, 2, '凉拌黄瓜', '清爽爽口的凉拌黄瓜', 12.00, 20, '份'],
      [5, 2, '拍黄瓜', '爽脆开胃小菜', 10.00, 25, '份'],
      [6, 3, '西红柿鸡蛋汤', '营养丰富的家常汤', 18.00, 15, '份'],
      [7, 3, '紫菜蛋花汤', '清淡鲜美', 16.00, 20, '份'],
      [8, 4, '鲜榨橙汁', '新鲜橙子榨制的果汁', 15.00, 30, '杯'],
      [9, 4, '柠檬蜂蜜茶', '酸甜解腻', 12.00, 25, '杯'],
      [10, 4, '可乐', '经典碳酸饮料', 8.00, 50, '瓶']
    ];

    for (const [id, category_id, name, description, price, stock_quantity, unit] of menuItems) {
      try {
        await connection.execute(
          'INSERT INTO menu_items (id, category_id, name, description, price, stock_quantity, unit) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [id, category_id, name, description, price, stock_quantity, unit]
        );
      } catch (error) {
        if (error.code !== 'ER_DUP_ENTRY') {
          throw error;
        }
      }
    }
    console.log('默认菜品创建成功');

    // 插入默认桌台
    const tables = [
      [1, '001', '一号桌', 4, '大厅靠窗'],
      [2, '002', '二号桌', 2, '大厅中央'],
      [3, '003', '三号桌', 6, '包间A'],
      [4, '004', '四号桌', 4, '大厅角落'],
      [5, '005', '五号桌', 8, '包间B'],
      [6, '006', '六号桌', 2, '吧台区'],
      [7, '007', '七号桌', 4, '大厅中央'],
      [8, '008', '八号桌', 6, '大厅靠墙']
    ];

    for (const [id, table_number, name, capacity, location] of tables) {
      try {
        await connection.execute(
          'INSERT INTO tables (id, table_number, name, capacity, location) VALUES (?, ?, ?, ?, ?)',
          [id, table_number, name, capacity, location]
        );
      } catch (error) {
        if (error.code !== 'ER_DUP_ENTRY') {
          throw error;
        }
      }
    }
    console.log('默认桌台创建成功');

    // 插入默认系统设置
    const settings = [
      ['restaurant_name', '美味餐厅', '餐厅名称'],
      ['restaurant_address', '北京市朝阳区某某街道123号', '餐厅地址'],
      ['restaurant_phone', '010-12345678', '餐厅电话'],
      ['business_hours', '09:00-22:00', '营业时间'],
      ['tax_rate', '0.06', '税率'],
      ['service_charge', '0.10', '服务费率']
    ];

    for (const [setting_key, setting_value, description] of settings) {
      try {
        await connection.execute(
          'INSERT INTO settings (setting_key, setting_value, description) VALUES (?, ?, ?)',
          [setting_key, setting_value, description]
        );
      } catch (error) {
        if (error.code !== 'ER_DUP_ENTRY') {
          throw error;
        }
      }
    }
    console.log('默认系统设置创建成功');

    console.log('默认数据插入成功！');
  } catch (error) {
    console.error('插入默认数据失败:', error);
  }
}

if (require.main === module) {
  initDatabase();
}

module.exports = { initDatabase };