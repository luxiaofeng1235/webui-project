# 餐饮管理系统

基于Node.js + MySQL的餐饮管理系统，包含用户登录注册、菜品管理、桌台管理、订单管理等功能。

## 项目结构

```
login-register/
├── src/
│   ├── config/          # 配置文件
│   │   └── database.js  # 数据库配置
│   ├── models/          # 数据模型
│   │   ├── User.js
│   │   ├── MenuCategory.js
│   │   ├── MenuItem.js
│   │   ├── Table.js
│   │   ├── Order.js
│   │   └── Setting.js
│   ├── controllers/     # 控制器
│   │   ├── AuthController.js
│   │   └── MenuCategoryController.js
│   ├── routes/          # 路由
│   │   ├── auth.js
│   │   └── menu-categories.js
│   ├── middleware/      # 中间件
│   │   └── auth.js
│   └── utils/           # 工具函数
├── scripts/
│   └── init-database.js # 数据库初始化脚本
├── login.html           # 登录注册页面
├── admin.html           # 管理后台页面
├── server.js            # 服务器入口文件
├── package.json
└── .env                 # 环境配置
```

## 安装和运行

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

确保 `.env` 文件配置正确：

```
# 数据库配置
DB_HOST=172.20.0.1
DB_PORT=3306
DB_USER=wsl_user
DB_PASSWORD=123456
DB_NAME=restaurant

# JWT密钥
JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_secure

# 服务器配置
PORT=3000
NODE_ENV=development
```

### 3. 初始化数据库

```bash
npm run init-db
```

这将会：
- 创建数据库和所有必需的表
- 插入默认的管理员账户：`admin` / `admin123`
- 插入示例数据（菜品分类、菜品、桌台等）

### 4. 启动服务器

```bash
# 开发模式（热重载）
npm run dev

# 生产模式
npm start
```

### 5. 访问系统

打开浏览器访问：`http://localhost:3000`

## 功能模块

### 认证系统
- 用户注册和登录
- JWT token认证
- 权限控制

### 餐饮管理
- **菜品分类管理**：增删改查菜品分类
- **菜品管理**：管理菜品信息、价格、状态
- **桌台管理**：管理餐厅桌台、座位数、状态
- **订单管理**：处理点餐订单、状态跟踪
- **用户管理**：管理系统用户
- **系统设置**：餐厅基本信息、税率等设置

### 后台管理界面
- 响应式设计
- 实时数据统计
- 直观的操作界面

## API接口

### 认证接口
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/register` - 用户注册
- `GET /api/auth/me` - 获取当前用户信息

### 菜品分类接口
- `GET /api/menu-categories` - 获取所有分类
- `GET /api/menu-categories/:id` - 获取单个分类
- `POST /api/menu-categories` - 创建分类
- `PUT /api/menu-categories/:id` - 更新分类
- `DELETE /api/menu-categories/:id` - 删除分类

## 数据库表结构

- `users` - 用户表
- `menu_categories` - 菜品分类表
- `menu_items` - 菜品表
- `tables` - 桌台表
- `orders` - 订单表
- `order_items` - 订单详情表
- `settings` - 系统设置表

## 默认账户

- 用户名：`admin`
- 密码：`admin123`
- 权限：管理员

## 技术栈

- **后端**：Node.js + Express
- **数据库**：MySQL
- **认证**：JWT
- **前端**：原生HTML/CSS/JavaScript
- **其他**：bcryptjs（密码加密）、express-validator（数据验证）

## 开发说明

- 所有API接口返回标准JSON格式
- 使用JWT进行身份认证
- 密码使用bcrypt加密存储
- 支持数据验证和错误处理
- 模块化的代码结构，便于维护和扩展