/**
 * 认证核心模块
 * 负责用户登录、注册、退出等核心认证功能
 */

class AuthCore {
    constructor() {
        this.currentUser = null;
        this.verificationCodes = new Map();
        this.registeredUsers = new Map();
        this.init();
    }

    init() {
        this.loadRegisteredUsers();
        this.checkLoginStatus();
        this.bindEvents();
        this.startLoginStatusMonitor();
    }

    // 检查登录状态
    checkLoginStatus() {
        let savedUser = localStorage.getItem('fitlife_user');
        if (!savedUser) {
            savedUser = sessionStorage.getItem('fitlife_user');
        }
        
        if (savedUser) {
            try {
                this.currentUser = JSON.parse(savedUser);
                this.showUserInfo();
                
                if (this.currentUser.avatar && window.avatarManager) {
                    window.avatarManager.updateDisplay(this.currentUser.avatar);
                }
                
                console.log('用户登录状态已恢复:', this.currentUser.name);
            } catch (error) {
                console.error('解析用户数据失败:', error);
                localStorage.removeItem('fitlife_user');
                sessionStorage.removeItem('fitlife_user');
            }
        }
    }

    // 绑定事件
    bindEvents() {
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target.id);
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
    }

    // 启动登录状态监控
    startLoginStatusMonitor() {
        setInterval(() => {
            this.validateLoginStatus();
        }, 30000);
        
        window.addEventListener('storage', (e) => {
            if (e.key === 'fitlife_user') {
                if (e.newValue) {
                    try {
                        this.currentUser = JSON.parse(e.newValue);
                        this.showUserInfo();
                        
                        if (this.currentUser.avatar && window.avatarManager) {
                            window.avatarManager.updateDisplay(this.currentUser.avatar);
                        }
                        
                        console.log('检测到其他标签页登录，已同步登录状态');
                    } catch (error) {
                        console.error('同步登录状态失败:', error);
                    }
                } else {
                    this.currentUser = null;
                    this.hideUserInfo();
                    console.log('检测到其他标签页退出，已同步退出状态');
                }
            }
        });
    }

    // 验证登录状态有效性
    validateLoginStatus() {
        if (!this.currentUser) return;
        
        const storedUser = localStorage.getItem('fitlife_user') || sessionStorage.getItem('fitlife_user');
        if (!storedUser) {
            this.currentUser = null;
            this.hideUserInfo();
            console.log('检测到登录状态已失效，自动退出');
            return;
        }
        
        try {
            const userData = JSON.parse(storedUser);
            if (!userData.id || !userData.email || !userData.name) {
                throw new Error('用户数据不完整');
            }
            
            this.currentUser = userData;
            
            if (userData.avatar && window.avatarManager) {
                window.avatarManager.updateDisplay(userData.avatar);
            }
        } catch (error) {
            console.error('用户数据验证失败:', error);
            localStorage.removeItem('fitlife_user');
            sessionStorage.removeItem('fitlife_user');
            this.currentUser = null;
            this.hideUserInfo();
        }
    }

    // 显示用户信息
    showUserInfo() {
        const authButtons = document.querySelectorAll('.btn-auth');
        const userInfo = document.getElementById('userInfo');
        const userName = document.getElementById('userName');

        authButtons.forEach(btn => {
            btn.style.display = 'none';
        });
        
        if (userInfo && userName && this.currentUser) {
            userName.textContent = this.currentUser.name;
            userInfo.style.display = 'flex';
            
            if (this.currentUser.avatar && window.avatarManager) {
                window.avatarManager.updateDisplay(this.currentUser.avatar);
            } else if (window.avatarManager) {
                window.avatarManager.updateDisplay(null);
            }
            
            console.log('用户界面已更新，显示用户:', this.currentUser.name);
        }
    }

    // 隐藏用户信息
    hideUserInfo() {
        const authButtons = document.querySelectorAll('.btn-auth');
        const userInfo = document.getElementById('userInfo');

        authButtons.forEach(btn => {
            btn.style.display = 'flex';
        });
        
        if (userInfo) {
            userInfo.style.display = 'none';
        }
    }

    // 保存注册用户到localStorage
    saveRegisteredUsers() {
        try {
            const usersData = Array.from(this.registeredUsers.entries());
            const dataToSave = {
                users: usersData,
                timestamp: new Date().toISOString(),
                version: '1.0'
            };
            localStorage.setItem('fitlife_registered_users', JSON.stringify(dataToSave));
            console.log('用户数据已保存，当前注册用户数量:', usersData.length);
        } catch (error) {
            console.error('保存用户数据失败:', error);
            if (window.utilsManager) {
                window.utilsManager.showToast('保存用户数据失败', 'error');
            }
        }
    }

    // 加载已注册用户
    loadRegisteredUsers() {
        try {
            const savedData = localStorage.getItem('fitlife_registered_users');
            if (savedData) {
                const parsedData = JSON.parse(savedData);
                
                if (Array.isArray(parsedData)) {
                    this.registeredUsers = new Map(parsedData);
                } else if (parsedData.users && Array.isArray(parsedData.users)) {
                    this.registeredUsers = new Map(parsedData.users);
                    console.log('加载用户数据版本:', parsedData.version);
                    console.log('数据时间戳:', parsedData.timestamp);
                }
                
                console.log('已加载注册用户数量:', this.registeredUsers.size);
                console.log('注册用户列表:', Array.from(this.registeredUsers.keys()));
            } else {
                console.log('没有找到已保存的用户数据');
            }
        } catch (error) {
            console.error('加载用户数据失败:', error);
            localStorage.removeItem('fitlife_registered_users');
            this.registeredUsers = new Map();
        }
    }

    // 模态框控制
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        }
    }

    closeAllModals() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        });
    }

    // 退出登录
    logout() {
        this.currentUser = null;
        
        localStorage.removeItem('fitlife_user');
        sessionStorage.removeItem('fitlife_user');
        
        this.hideUserInfo();
        
        if (window.avatarManager) {
            window.avatarManager.updateDisplay(null);
        }
        
        const userMenu = document.getElementById('userMenu');
        if (userMenu) {
            userMenu.classList.remove('show');
        }
        
        console.log('用户已退出登录，所有登录状态已清除');
        if (window.utilsManager) {
            window.utilsManager.showToast('已退出登录', 'success');
        }
    }
}

// 导出模块
window.AuthCore = AuthCore;