// 管理后台主要功能
class AdminManager {
    constructor() {
        this.currentPage = 'dashboard';
        this.init();
    }

    async init() {
        // 检查认证
        const isAuthenticated = await this.checkAuth();
        if (!isAuthenticated) return;

        // 绑定事件
        this.bindEvents();
        
        // 加载默认页面数据
        await this.loadDashboard();
    }

    // 检查用户认证
    async checkAuth() {
        const token = localStorage.getItem('token');
        const isLoggedIn = sessionStorage.getItem('isLoggedIn');
        
        if (!token || !isLoggedIn || isLoggedIn !== 'true') {
            alert('您还未登录，请先登录！');
            window.location.href = 'login.html';
            return false;
        }

        try {
            const result = await AuthAPI.getCurrentUser();
            if (result.success && result.data.user) {
                document.getElementById('username').textContent = result.data.user.username;
                return true;
            }
            
            // Token无效，清除存储并跳转登录
            this.logout();
            return false;
        } catch (error) {
            console.error('认证检查失败:', error);
            // 网络错误时使用fallback
            const username = sessionStorage.getItem('username');
            if (username) {
                document.getElementById('username').textContent = username;
                return true;
            }
            
            alert('您还未登录，请先登录！');
            window.location.href = 'login.html';
            return false;
        }
    }

    // 绑定事件
    bindEvents() {
        // 菜单点击事件
        document.querySelectorAll('.admin-menu-link').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const pageId = item.getAttribute('onclick').match(/showPage\('([^']+)'/)[1];
                this.showPage(pageId, item);
            });
        });

        // 系统设置表单提交事件
        const settingsForm = document.getElementById('settings-form');
        if (settingsForm) {
            settingsForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveSettings();
            });
        }
    }

    // 显示页面
    async showPage(pageId, element) {
        // 隐藏所有页面
        document.querySelectorAll('.admin-page-container').forEach(page => {
            page.classList.remove('active');
        });

        // 移除所有菜单项的active类
        document.querySelectorAll('.admin-menu-link').forEach(item => {
            item.classList.remove('active');
        });

        // 显示选中的页面
        document.getElementById(pageId).classList.add('active');

        // 为选中的菜单项添加active类
        if (element) {
            element.classList.add('active');
        }

        // 加载页面数据
        this.currentPage = pageId;
        await this.loadPageData(pageId);
    }

    // 加载页面数据
    async loadPageData(pageId) {
        try {
            switch (pageId) {
                case 'dashboard':
                    await this.loadDashboard();
                    break;
                case 'menu-categories':
                    await this.loadMenuCategories();
                    break;
                case 'menu-items':
                    await this.loadMenuItems();
                    break;
                case 'tables':
                    await this.loadTables();
                    break;
                case 'dining-orders':
                    await this.loadOrders();
                    break;
                case 'users':
                    await this.loadUsers();
                    break;
                case 'settings':
                    await this.loadSettings();
                    break;
            }
        } catch (error) {
            console.error('加载页面数据失败:', error);
            this.showError('加载数据失败: ' + error.message);
        }
    }

    // 加载仪表盘数据
    async loadDashboard() {
        try {
            // 加载统计数据
            const result = await OrderAPI.getStats();
            if (result.success) {
                this.renderDashboardStats(result.data.stats);
            }
        } catch (error) {
            console.error('加载仪表盘数据失败:', error);
            // 如果API调用失败，保持现有的静态数据显示
        }
    }

    // 渲染仪表盘统计数据
    renderDashboardStats(stats) {
        // 更新统计卡片
        const statCards = document.querySelectorAll('#dashboard .admin-stat-number');
        if (statCards.length >= 4) {
            statCards[0].textContent = `¥${stats.total_revenue || 0}`;
            statCards[1].textContent = stats.total_orders || 0;
            statCards[2].textContent = stats.total_menu_items || 0;
            statCards[3].textContent = stats.total_tables || 0;
        }
    }

    // 加载菜品分类
    async loadMenuCategories() {
        try {
            const result = await MenuCategoryAPI.getAll();
            if (result.success) {
                this.renderMenuCategories(result.data.categories);
            }
        } catch (error) {
            console.error('加载菜品分类失败:', error);
            this.showError('加载菜品分类失败');
        }
    }

    // 渲染菜品分类表格
    renderMenuCategories(categories) {
        const tbody = document.querySelector('#menu-categories tbody');
        if (!tbody) return;

        tbody.innerHTML = categories.map(category => `
            <tr>
                <td>${category.id}</td>
                <td>${category.icon || '🍜'} ${category.name}</td>
                <td>${category.item_count || 0}</td>
                <td>${category.status === 'active' ? '启用' : '禁用'}</td>
                <td>${new Date(category.created_at).toLocaleDateString()}</td>
                <td>
                    <button class="btn btn-primary" onclick="adminManager.editCategory(${category.id})">编辑</button>
                    <button class="btn btn-danger" onclick="adminManager.deleteCategory(${category.id})">删除</button>
                </td>
            </tr>
        `).join('');
    }

    // 加载菜品
    async loadMenuItems() {
        try {
            const result = await MenuItemAPI.getAll();
            if (result.success) {
                this.renderMenuItems(result.data.items);
            }
        } catch (error) {
            console.error('加载菜品失败:', error);
            this.showError('加载菜品失败');
        }
    }

    // 渲染菜品表格
    renderMenuItems(items) {
        const tbody = document.querySelector('#menu-items tbody');
        if (!tbody) return;

        tbody.innerHTML = items.map(item => `
            <tr>
                <td>${item.id}</td>
                <td>${item.name}</td>
                <td>${item.category_name || '未分类'}</td>
                <td>¥${item.price}</td>
                <td>${item.stock_quantity || 0}${item.unit || '份'}</td>
                <td>${item.status === 'available' ? '上架' : '下架'}</td>
                <td>
                    <button class="btn btn-primary" onclick="adminManager.editMenuItem(${item.id})">编辑</button>
                    <button class="btn btn-danger" onclick="adminManager.deleteMenuItem(${item.id})">删除</button>
                </td>
            </tr>
        `).join('');
    }

    // 加载桌台
    async loadTables() {
        try {
            const result = await TableAPI.getAll();
            if (result.success) {
                this.renderTables(result.data.tables);
            }
        } catch (error) {
            console.error('加载桌台失败:', error);
            this.showError('加载桌台失败');
        }
    }

    // 渲染桌台表格
    renderTables(tables) {
        const tbody = document.querySelector('#tables tbody');
        if (!tbody) return;

        const statusMap = {
            'available': '空闲',
            'occupied': '占用',
            'reserved': '预订',
            'maintenance': '维护'
        };

        tbody.innerHTML = tables.map(table => `
            <tr>
                <td>${table.id}</td>
                <td>${table.table_number}</td>
                <td>${table.name}</td>
                <td>${table.capacity}人</td>
                <td>${table.location || '-'}</td>
                <td>${statusMap[table.status] || table.status}</td>
                <td>
                    <button class="btn btn-primary" onclick="adminManager.editTable(${table.id})">编辑</button>
                    <button class="btn btn-danger" onclick="adminManager.deleteTable(${table.id})">删除</button>
                </td>
            </tr>
        `).join('');
    }

    // 加载订单
    async loadOrders() {
        try {
            const result = await OrderAPI.getAll();
            if (result.success) {
                this.renderOrders(result.data.orders);
            }
        } catch (error) {
            console.error('加载订单失败:', error);
            this.showError('加载订单失败');
        }
    }

    // 渲染订单表格
    renderOrders(orders) {
        const tbody = document.querySelector('#dining-orders tbody');
        if (!tbody) return;

        const statusMap = {
            'pending': '待处理',
            'preparing': '制作中',
            'ready': '已完成',
            'completed': '已完成',
            'cancelled': '已取消'
        };

        tbody.innerHTML = orders.map(order => `
            <tr>
                <td>${order.id}</td>
                <td>${order.order_number}</td>
                <td>${order.table_id || '-'}</td>
                <td>¥${order.total_amount}</td>
                <td>${statusMap[order.status] || order.status}</td>
                <td>${new Date(order.created_at).toLocaleString()}</td>
                <td>
                    <button class="btn btn-primary" onclick="adminManager.viewOrder(${order.id})">查看</button>
                    <button class="btn btn-success" onclick="adminManager.updateOrderStatus(${order.id})">更新状态</button>
                </td>
            </tr>
        `).join('');
    }

    // 加载用户
    async loadUsers() {
        try {
            const result = await UserAPI.getAll();
            if (result.success) {
                this.renderUsers(result.data.users);
            }
        } catch (error) {
            console.error('加载用户失败:', error);
            this.showError('加载用户失败');
        }
    }

    // 渲染用户表格
    renderUsers(users) {
        const tbody = document.querySelector('#users tbody');
        if (!tbody) return;

        tbody.innerHTML = users.map(user => `
            <tr>
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>${new Date(user.created_at).toLocaleDateString()}</td>
                <td>${user.role === 'admin' ? '管理员' : '员工'}</td>
                <td>
                    <button class="btn btn-primary" onclick="adminManager.editUser(${user.id})">编辑</button>
                    <button class="btn btn-danger" onclick="adminManager.deleteUser(${user.id})">删除</button>
                </td>
            </tr>
        `).join('');
    }

    // 加载系统设置
    async loadSettings() {
        try {
            const result = await SettingAPI.getAll();
            if (result.success) {
                this.renderSettings(result.data.settings);
            }
        } catch (error) {
            console.error('加载系统设置失败:', error);
            this.showError('加载系统设置失败');
        }
    }

    // 渲染系统设置
    renderSettings(settings) {
        const form = document.querySelector('#settings-form');
        if (!form) return;

        // 填充表单数据
        Object.keys(settings).forEach(key => {
            const input = form.querySelector(`#${key.replace(/_/g, '-')}`);
            if (input) {
                input.value = settings[key].value || '';
            }
        });
    }

    // 保存系统设置
    async saveSettings() {
        try {
            const form = document.getElementById('settings-form');
            const formData = new FormData(form);
            const settings = {};

            // 转换表单数据为设置对象
            for (const [key, value] of formData.entries()) {
                settings[key] = value;
            }

            const result = await SettingAPI.batchUpdate(settings);
            if (result.success) {
                alert('设置保存成功');
            } else {
                this.showError('保存设置失败');
            }
        } catch (error) {
            console.error('保存设置失败:', error);
            this.showError('保存设置失败: ' + error.message);
        }
    }

    // 显示错误信息
    showError(message) {
        alert('错误: ' + message);
    }

    // 退出登录
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.removeItem('isLoggedIn');
        sessionStorage.removeItem('username');
        window.location.href = 'login.html';
    }

    // 编辑分类
    editCategory(id) {
        // TODO: 实现编辑分类功能
        console.log('编辑分类:', id);
    }

    // 删除分类
    async deleteCategory(id) {
        if (!confirm('确定要删除这个分类吗？')) return;
        
        try {
            const result = await MenuCategoryAPI.delete(id);
            if (result.success) {
                alert('删除成功');
                await this.loadMenuCategories();
            }
        } catch (error) {
            this.showError('删除失败: ' + error.message);
        }
    }

    // 编辑菜品
    editMenuItem(id) {
        // TODO: 实现编辑菜品功能
        console.log('编辑菜品:', id);
    }

    // 删除菜品
    async deleteMenuItem(id) {
        if (!confirm('确定要删除这个菜品吗？')) return;
        
        try {
            const result = await MenuItemAPI.delete(id);
            if (result.success) {
                alert('删除成功');
                await this.loadMenuItems();
            }
        } catch (error) {
            this.showError('删除失败: ' + error.message);
        }
    }

    // 编辑桌台
    editTable(id) {
        // TODO: 实现编辑桌台功能
        console.log('编辑桌台:', id);
    }

    // 删除桌台
    async deleteTable(id) {
        if (!confirm('确定要删除这个桌台吗？')) return;
        
        try {
            const result = await TableAPI.delete(id);
            if (result.success) {
                alert('删除成功');
                await this.loadTables();
            }
        } catch (error) {
            this.showError('删除失败: ' + error.message);
        }
    }

    // 查看订单
    viewOrder(id) {
        // TODO: 实现查看订单详情功能
        console.log('查看订单:', id);
    }

    // 更新订单状态
    updateOrderStatus(id) {
        // TODO: 实现更新订单状态功能
        console.log('更新订单状态:', id);
    }

    // 编辑用户
    editUser(id) {
        // TODO: 实现编辑用户功能
        console.log('编辑用户:', id);
    }

    // 删除用户
    async deleteUser(id) {
        if (!confirm('确定要删除这个用户吗？')) return;
        
        try {
            const result = await UserAPI.delete(id);
            if (result.success) {
                alert('删除成功');
                await this.loadUsers();
            }
        } catch (error) {
            this.showError('删除失败: ' + error.message);
        }
    }
}

// 全局变量
let adminManager;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    adminManager = new AdminManager();
});

// 全局函数（保持向后兼容）
function showPage(pageId, element) {
    if (adminManager) {
        adminManager.showPage(pageId, element);
    }
}

function logout() {
    if (adminManager) {
        adminManager.logout();
    }
}
