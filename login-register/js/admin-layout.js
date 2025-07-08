/**
 * Admin布局管理器
 * 负责渲染公共的头部导航和侧边栏菜单
 */
class AdminLayout {
    constructor() {
        this.currentPage = '';
        this.menuItems = [
            { id: 'dashboard', name: '仪表盘', icon: '📊', url: 'index.html' },
            { id: 'categories', name: '菜品分类', icon: '🗂️', url: 'categories.html' },
            { id: 'dishes', name: '菜品管理', icon: '🍽️', url: 'dishes.html' },
            { id: 'orders', name: '订单管理', icon: '📋', url: 'orders.html' },
            { id: 'customers', name: '客户管理', icon: '👥', url: 'customers.html' },
            { id: 'reports', name: '营业报表', icon: '📈', url: 'reports.html' },
            { id: 'users', name: '用户管理', icon: '👤', url: 'users.html' },
            { id: 'settings', name: '系统设置', icon: '⚙️', url: 'settings.html' }
        ];
        this.init();
    }

    init() {
        this.detectCurrentPage();
        this.renderLayout();
        this.bindEvents();
        this.checkAuth();
    }

    // 检测当前页面
    detectCurrentPage() {
        const path = window.location.pathname;
        const filename = path.split('/').pop();
        
        // 根据文件名确定当前页面
        if (filename === 'index.html' || filename === '') {
            this.currentPage = 'dashboard';
        } else {
            this.currentPage = filename.replace('.html', '');
        }
    }

    // 渲染完整布局
    renderLayout() {
        const body = document.body;
        body.className = 'admin-subpage';
        
        // 创建主要布局结构
        const layoutHTML = `
            ${this.renderNavbar()}
            <div class="admin-main-content">
                ${this.renderBreadcrumb()}
                <div class="admin-content-wrapper">
                    ${this.renderSidebar()}
                    <main class="admin-page-content" id="admin-page-content">
                        <!-- 页面内容将在这里渲染 -->
                    </main>
                </div>
            </div>
        `;
        
        body.innerHTML = layoutHTML;
    }

    // 渲染顶部导航栏
    renderNavbar() {
        return `
            <nav class="admin-navbar">
                <div class="admin-navbar-content">
                    <div class="admin-navbar-brand">
                        <span>🍽️</span>
                        餐饮管理系统
                    </div>
                    <div class="admin-navbar-user">
                        <div class="admin-user-dropdown" onclick="adminLayout.toggleUserDropdown()">
                            <div class="admin-user-avatar">
                                <span id="user-avatar-text">A</span>
                            </div>
                            <span id="username">Admin</span>
                            <span class="dropdown-arrow">▼</span>
                            <div class="admin-dropdown-menu" id="user-dropdown">
                                <a href="#" class="admin-dropdown-item">
                                    <span>👤</span> 个人资料
                                </a>
                                <a href="#" class="admin-dropdown-item">
                                    <span>⚙️</span> 账户设置
                                </a>
                                <div class="admin-dropdown-divider"></div>
                                <a href="#" class="admin-dropdown-item" onclick="adminLayout.logout()">
                                    <span>🚪</span> 退出登录
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        `;
    }

    // 渲染面包屑导航
    renderBreadcrumb() {
        const currentMenuItem = this.menuItems.find(item => item.id === this.currentPage);
        const pageName = currentMenuItem ? currentMenuItem.name : '未知页面';
        
        return `
            <div class="admin-breadcrumb">
                <span class="admin-breadcrumb-item">
                    <a href="index.html">首页</a>
                </span>
                <span class="admin-breadcrumb-separator">/</span>
                <span class="admin-breadcrumb-item active">${pageName}</span>
            </div>
        `;
    }

    // 渲染侧边栏
    renderSidebar() {
        const menuHTML = this.menuItems.map(item => {
            const isActive = item.id === this.currentPage ? 'active' : '';
            return `
                <li class="admin-sidebar-item">
                    <a href="${item.url}" class="admin-sidebar-link ${isActive}">
                        <span class="menu-icon">${item.icon}</span>
                        <span class="menu-text">${item.name}</span>
                    </a>
                </li>
            `;
        }).join('');

        return `
            <aside class="admin-sidebar">
                <div class="admin-sidebar-header">
                    <h3>功能菜单</h3>
                </div>
                <nav class="admin-sidebar-nav">
                    <ul class="admin-sidebar-menu">
                        ${menuHTML}
                    </ul>
                </nav>
            </aside>
        `;
    }

    // 绑定事件
    bindEvents() {
        // 点击页面其他地方关闭下拉菜单
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.admin-user-dropdown')) {
                this.closeUserDropdown();
            }
        });

        // 侧边栏菜单点击事件
        document.addEventListener('click', (e) => {
            if (e.target.closest('.admin-sidebar-link')) {
                const link = e.target.closest('.admin-sidebar-link');
                const href = link.getAttribute('href');
                
                // 如果是当前页面，阻止默认跳转
                if (href === window.location.pathname.split('/').pop()) {
                    e.preventDefault();
                }
            }
        });
    }

    // 检查用户认证
    async checkAuth() {
        const token = localStorage.getItem('token');
        const isLoggedIn = sessionStorage.getItem('isLoggedIn');
        
        if (!token || !isLoggedIn || isLoggedIn !== 'true') {
            this.redirectToLogin();
            return false;
        }

        try {
            // 这里可以调用API验证token
            const username = sessionStorage.getItem('username') || 'Admin';
            this.updateUserInfo(username);
            return true;
        } catch (error) {
            console.error('认证检查失败:', error);
            this.redirectToLogin();
            return false;
        }
    }

    // 更新用户信息显示
    updateUserInfo(username) {
        const usernameElement = document.getElementById('username');
        const avatarElement = document.getElementById('user-avatar-text');
        
        if (usernameElement) {
            usernameElement.textContent = username;
        }
        
        if (avatarElement) {
            avatarElement.textContent = username.charAt(0).toUpperCase();
        }
    }

    // 切换用户下拉菜单
    toggleUserDropdown() {
        const dropdown = document.getElementById('user-dropdown');
        if (dropdown) {
            dropdown.classList.toggle('show');
        }
    }

    // 关闭用户下拉菜单
    closeUserDropdown() {
        const dropdown = document.getElementById('user-dropdown');
        if (dropdown) {
            dropdown.classList.remove('show');
        }
    }

    // 退出登录
    logout() {
        if (confirm('确定要退出登录吗？')) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            sessionStorage.removeItem('isLoggedIn');
            sessionStorage.removeItem('username');
            this.redirectToLogin();
        }
    }

    // 跳转到登录页面
    redirectToLogin() {
        window.location.href = '../login.html';
    }

    // 设置页面内容
    setPageContent(content) {
        const contentContainer = document.getElementById('admin-page-content');
        if (contentContainer) {
            contentContainer.innerHTML = content;
        }
    }

    // 设置页面标题
    setPageTitle(title) {
        document.title = `${title} - 餐饮管理系统`;
        
        // 更新面包屑
        const breadcrumbActive = document.querySelector('.admin-breadcrumb-item.active');
        if (breadcrumbActive) {
            breadcrumbActive.textContent = title;
        }
    }

    // 显示加载状态
    showLoading() {
        this.setPageContent(`
            <div class="admin-loading">
                <div class="admin-loading-spinner"></div>
                <p>加载中...</p>
            </div>
        `);
    }

    // 显示错误信息
    showError(message) {
        this.setPageContent(`
            <div class="admin-empty-state">
                <div class="admin-empty-state-icon">❌</div>
                <h3 class="admin-empty-state-title">加载失败</h3>
                <p class="admin-empty-state-description">${message}</p>
                <button class="btn btn-primary" onclick="location.reload()">重新加载</button>
            </div>
        `);
    }
}

// 全局变量
let adminLayout;

// 页面加载完成后初始化布局
document.addEventListener('DOMContentLoaded', function() {
    adminLayout = new AdminLayout();
});

// 导出给其他脚本使用
window.AdminLayout = AdminLayout;
