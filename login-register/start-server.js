// 直接启动服务器，不运行数据库初始化
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 静态文件服务
app.use(express.static(path.join(__dirname)));

// API路由
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/menu-categories', require('./src/routes/menu-categories'));
app.use('/api/menu-items', require('./src/routes/menu-items'));
app.use('/api/orders', require('./src/routes/orders'));
app.use('/api/users', require('./src/routes/users'));
app.use('/api/tables', require('./src/routes/tables'));
app.use('/api/settings', require('./src/routes/settings'));

// 默认路由 - 重定向到登录页面
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
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
  console.log('数据库已初始化，可以开始使用系统');
});

module.exports = app;
