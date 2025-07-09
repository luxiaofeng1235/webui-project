const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API路由 (必须在静态文件服务之前)
console.log('正在加载API路由...');
app.use('/api/auth', require('./src/routes/auth'));
console.log('✅ auth路由已加载');
app.use('/api/menu-categories', require('./src/routes/menu-categories'));
console.log('✅ menu-categories路由已加载');
app.use('/api/menu-items', require('./src/routes/menu-items'));
console.log('✅ menu-items路由已加载');
app.use('/api/orders', require('./src/routes/orders'));
console.log('✅ orders路由已加载');
app.use('/api/users', require('./src/routes/users'));
console.log('✅ users路由已加载');
app.use('/api/tables', require('./src/routes/tables'));
console.log('✅ tables路由已加载');
app.use('/api/settings', require('./src/routes/settings'));
console.log('✅ settings路由已加载');
app.use('/api/upload', require('./src/routes/upload'));
console.log('✅ upload路由已加载');

// 顾客端API路由
console.log('正在加载customer路由...');
try {
  const customerRoutes = require('./src/routes/customer');
  app.use('/api/customer', customerRoutes);
  console.log('✅ customer路由加载成功');
} catch (error) {
  console.error('❌ customer路由加载失败:', error);
}

// 默认路由 - 跳转到顾客端
app.get('/', (req, res) => {
  res.redirect('/customer/');
});

// 静态文件服务 (必须在API路由之后)
app.use(express.static(path.join(__dirname)));

// 顾客端路由重定向
app.get('/customer', (req, res) => {
  res.redirect('/customer/');
});

app.get('/customer/', (req, res) => {
  res.sendFile(path.join(__dirname, 'customer', 'index.html'));
});

// 商家端路由重定向
app.get('/admin', (req, res) => {
  res.redirect('/admin/');
});

app.get('/admin/', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'login.html'));
});

// 健康检查API
app.get('/api/health', async (req, res) => {
  try {
    const pool = require('./src/config/database');

    // 测试数据库连接
    const [rows] = await pool.execute('SELECT 1 as test');

    res.json({
      success: true,
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      version: '1.0.0',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: error.message
    });
  }
});

// 404处理
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'API接口不存在'
  });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('服务器错误:', err);
  res.status(500).json({
    success: false,
    message: '服务器内部错误'
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
  console.log('请先运行 npm run init-db 初始化数据库');
});

module.exports = app;