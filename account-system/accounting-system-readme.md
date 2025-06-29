# 在线记账系统部署和使用说明

## 系统特性

- 📱 **移动端优化**：响应式设计，完美支持手机和平板
- 💰 **收支管理**：记录日常收入和支出
- 📊 **实时统计**：查看月度收支概览
- 🔔 **预算提醒**：设置月度预算并自动提醒
- 📈 **分类统计**：按类别查看收支分布
- 💾 **数据导出**：支持CSV格式导出

## 快速开始

### 1. 环境准备

需要安装：
- Node.js (v14或更高版本)
- npm 或 yarn
- MongoDB/MySQL/PostgreSQL（可选，用于数据持久化）

### 2. 后端部署

#### 本地开发环境

```bash
# 创建项目目录
mkdir accounting-system
cd accounting-system

# 创建后端文件
# 将提供的 server.js 代码保存到文件中

# 初始化项目
npm init -y

# 安装依赖
npm install express cors body-parser uuid
npm install -D nodemon

# 启动服务
npm start
# 或使用开发模式（自动重启）
npm run dev
```

#### 生产环境部署

**选项1：使用云服务（推荐）**

1. **Heroku部署**：
```bash
# 安装Heroku CLI
# 创建Heroku应用
heroku create your-accounting-app

# 添加环境变量
heroku config:set NODE_ENV=production

# 部署
git add .
git commit -m "Initial commit"
git push heroku main
```

2. **阿里云/腾讯云部署**：
- 购买云服务器（ECS/CVM）
- 安装Node.js环境
- 使用PM2管理进程：
```bash
npm install -g pm2
pm2 start server.js --name accounting-api
pm2 save
pm2 startup
```

**选项2：使用Docker**

创建 `Dockerfile`：
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

构建和运行：
```bash
docker build -t accounting-system .
docker run -p 3000:3000 -d accounting-system
```

### 3. 数据库配置

#### MongoDB配置

1. 安装MongoDB或使用MongoDB Atlas云服务
2. 修改server.js，取消注释数据库相关代码
3. 更新连接字符串：

```javascript
mongoose.connect('mongodb://username:password@host:port/database', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
```

#### MySQL配置

```javascript
const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'accounting'
});

// 创建表
const createTables = `
CREATE TABLE IF NOT EXISTS transactions (
    id VARCHAR(36) PRIMARY KEY,
    type ENUM('income', 'expense'),
    category VARCHAR(50),
    amount DECIMAL(10, 2),
    description TEXT,
    date DATETIME
);

CREATE TABLE IF NOT EXISTS budget (
    id INT PRIMARY KEY AUTO_INCREMENT,
    amount DECIMAL(10, 2),
    threshold INT
);
`;
```

### 4. 前端部署

#### 本地测试
1. 将HTML文件保存为 `index.html`
2. 修改API地址（如果后端不在localhost:3000）：
```javascript
const API_BASE = 'http://your-api-server.com/api';
```
3. 使用本地服务器打开（避免CORS问题）：
```bash
# 使用Python
python -m http.server 8080

# 或使用Node.js的http-server
npm install -g http-server
http-server -p 8080
```

#### 生产部署

**选项1：静态网站托管**
- GitHub Pages
- Netlify
- Vercel
- 阿里云OSS + CDN

**选项2：与后端一起部署**
修改server.js添加静态文件服务：
```javascript
app.use(express.static('public'));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
```

### 5. HTTPS配置（生产环境必需）

使用Let's Encrypt免费证书：
```bash
# 使用Certbot
sudo apt-get install certbot
sudo certbot certonly --standalone -d your-domain.com
```

或使用Nginx反向代理：
```nginx
server {
    listen 443 ssl;
    server_name your-domain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 功能扩展建议

### 1. 用户认证系统
```javascript
// 使用JWT实现
const jwt = require('jsonwebtoken');

app.post('/api/login', async (req, res) => {
    // 验证用户
    const token = jwt.sign({ userId }, SECRET_KEY, { expiresIn: '7d' });
    res.json({ token });
});

// 认证中间件
const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: '未授权' });
    
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ error: '无效的令牌' });
    }
};
```

### 2. 数据可视化
- 添加Chart.js或ECharts图表库
- 实现收支趋势图、分类饼图等

### 3. 定时任务
```javascript
const cron = require('node-cron');

// 每天凌晨发送预算提醒
cron.schedule('0 0 * * *', async () => {
    // 检查预算并发送通知
});
```

### 4. 数据备份
```javascript
// 自动备份到云存储
const backup = async () => {
    const data = {
        transactions,
        budget,
        timestamp: new Date()
    };
    // 上传到OSS/S3
};
```

## 安全建议

1. **API安全**
   - 添加请求限流（rate limiting）
   - 实施CORS策略
   - 使用HTTPS

2. **数据验证**
   - 服务端验证所有输入
   - 防止SQL注入
   - XSS防护

3. **敏感信息**
   - 使用环境变量存储密钥
   - 不要在代码中硬编码密码
   - 定期更新依赖包

## 维护和监控

1. **日志记录**
```javascript
const winston = require('winston');
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});
```

2. **性能监控**
   - 使用PM2监控
   - 接入阿里云ARMS或腾讯云监控

3. **错误追踪**
   - Sentry错误追踪
   - 自定义错误报警

## 常见问题

**Q: CORS错误怎么解决？**
A: 确保后端正确配置了CORS，或使用同源部署。

**Q: 如何处理时区问题？**
A: 统一使用UTC时间存储，前端显示时转换为本地时间。

**Q: 如何优化性能？**
A: 
- 添加数据缓存（Redis）
- 实现分页加载
- 使用数据库索引

**Q: 如何实现实时通知？**
A: 可以集成WebSocket或使用推送服务（如极光推送）。

## 技术支持

如有问题，可以：
1. 查看错误日志
2. 检查网络请求
3. 确认数据库连接
4. 验证环境配置

祝您使用愉快！💰📊