# Admin模块组件化系统使用说明

## 概述

我们已经为Admin模块创建了一个插件式的公共组件系统，大大减少了代码冗余，提高了开发效率。每个页面现在只需要专注于自己的业务逻辑，而不需要重复编写导航栏、侧边栏等公共部分。

## 系统架构

### 核心文件

1. **`../js/admin-layout.js`** - 布局管理器
   - 自动渲染顶部导航栏
   - 自动渲染侧边栏菜单
   - 自动渲染面包屑导航
   - 处理用户认证
   - 提供页面内容管理API

2. **`../css/admin/admin-common.css`** - 公共样式
   - 布局样式
   - 导航栏样式
   - 侧边栏样式
   - 响应式设计

### 页面结构

每个Admin页面现在只需要包含：
- 基本的HTML结构（head + body）
- CSS文件引用
- 布局管理器脚本引用
- 页面特定的业务逻辑

## 使用方法

### 1. 创建新页面

复制 `template.html` 作为起点：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>页面标题 - 餐饮管理系统</title>
    <link rel="stylesheet" href="../css/base.css">
    <link rel="stylesheet" href="../css/components.css">
    <link rel="stylesheet" href="../css/admin/admin-common.css">
</head>
<body>
    <!-- 引入布局管理器 -->
    <script src="../js/admin-layout.js"></script>
    
    <!-- 页面特定脚本 -->
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(() => {
                initPage();
            }, 100);
        });

        function initPage() {
            // 设置页面标题
            adminLayout.setPageTitle('页面标题');
            
            // 设置页面内容
            const content = `
                <div class="admin-content-card">
                    <div class="admin-content-card-header">
                        <h2 class="admin-content-card-title">页面标题</h2>
                    </div>
                    <div class="admin-content-card-body">
                        <!-- 页面内容 -->
                    </div>
                </div>
            `;
            
            adminLayout.setPageContent(content);
        }
    </script>
</body>
</html>
```

### 2. 布局管理器API

#### 页面内容管理

```javascript
// 设置页面标题（会更新浏览器标题和面包屑）
adminLayout.setPageTitle('页面标题');

// 设置页面内容
adminLayout.setPageContent(htmlContent);

// 显示加载状态
adminLayout.showLoading();

// 显示错误信息
adminLayout.showError('错误消息');
```

#### 用户信息管理

```javascript
// 更新用户信息显示
adminLayout.updateUserInfo('用户名');

// 退出登录
adminLayout.logout();
```

### 3. 可用的CSS类

#### 内容容器
- `.admin-content-card` - 主要内容卡片
- `.admin-content-card-header` - 卡片头部
- `.admin-content-card-body` - 卡片内容
- `.admin-content-card-footer` - 卡片底部

#### 统计卡片
- `.admin-stats-grid` - 统计卡片网格容器
- `.admin-stat-card` - 统计卡片
- `.admin-stat-card.primary/.success/.warning/.danger/.info` - 不同颜色的统计卡片
- `.admin-stat-title` - 统计标题
- `.admin-stat-number` - 统计数字

#### 工具栏
- `.admin-toolbar` - 工具栏容器
- `.admin-toolbar-left/.admin-toolbar-right` - 工具栏左右区域
- `.admin-search-box` - 搜索框容器
- `.admin-search-input` - 搜索输入框
- `.admin-filters` - 筛选器容器

#### 数据表格
- `.admin-data-table` - 数据表格
- `.admin-action-buttons` - 操作按钮容器
- `.admin-action-btn` - 操作按钮
- `.admin-action-btn.primary/.success/.warning/.danger` - 不同类型的操作按钮

#### 分页
- `.admin-pagination` - 分页容器
- `.admin-pagination-info` - 分页信息
- `.admin-pagination-btn` - 分页按钮

#### 状态显示
- `.admin-loading` - 加载状态
- `.admin-empty-state` - 空状态
- `.admin-empty-state-icon/.admin-empty-state-title/.admin-empty-state-description` - 空状态元素

### 4. 菜单配置

在 `admin-layout.js` 中的 `menuItems` 数组中配置菜单项：

```javascript
this.menuItems = [
    { id: 'dashboard', name: '仪表盘', icon: '📊', url: 'index.html' },
    { id: 'dishes', name: '菜品管理', icon: '🍽️', url: 'dishes.html' },
    // 添加更多菜单项...
];
```

### 5. 页面示例

#### 简单页面示例（index.html）
- 显示统计卡片
- 展示最近数据
- 提供快捷操作

#### 数据管理页面示例（dishes.html）
- 搜索和筛选功能
- 数据表格显示
- 增删改查操作

## 优势

1. **代码复用** - 公共组件只需维护一份代码
2. **开发效率** - 新页面开发时间大大减少
3. **一致性** - 所有页面保持统一的UI风格
4. **易维护** - 布局修改只需要改一个地方
5. **响应式** - 自动适配不同屏幕尺寸
6. **认证管理** - 自动处理用户登录状态检查

## 注意事项

1. 页面初始化需要等待布局渲染完成（使用setTimeout延迟100ms）
2. 所有页面都会自动进行用户认证检查
3. 菜单的当前页面高亮是自动处理的
4. 页面标题会同时更新浏览器标题和面包屑导航

## 扩展

如需添加新功能：

1. **新的公共组件** - 在 `admin-layout.js` 中添加
2. **新的样式** - 在 `admin-common.css` 中添加
3. **新的工具方法** - 在 `AdminLayout` 类中添加

这个组件化系统让Admin模块的开发变得更加高效和规范化！
