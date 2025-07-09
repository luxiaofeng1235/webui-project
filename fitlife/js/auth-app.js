/**
 * 认证应用管理器
 * 统一管理所有认证相关模块的初始化和协调
 */

class AuthApp {
    constructor() {
        this.modules = {};
        this.isInitialized = false;
        this.init();
    }

    async init() {
        console.log('🔐 认证系统初始化开始...');
        
        // 等待DOM加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeModules());
        } else {
            this.initializeModules();
        }
    }

    async initializeModules() {
        try {
            // 等待组件加载完成
            await this.waitForComponents();
            
            // 初始化各个认证模块
            this.initAuthCore();
            this.initVerificationManager();
            this.initUserManager();
            this.initAvatarManager();
            this.initModalManager();
            this.initPackageManager();
            
            // 设置全局函数
            this.setupGlobalFunctions();
            
            // 标记为已初始化
            this.isInitialized = true;
            
            console.log('✨ 认证系统初始化完成');
            
            // 触发认证系统初始化完成事件
            document.dispatchEvent(new CustomEvent('authAppInitialized'));
            
        } catch (error) {
            console.error('❌ 认证系统初始化失败:', error);
        }
    }

    // 等待组件加载完成
    waitForComponents() {
        return new Promise((resolve) => {
            if (document.querySelector('#loginModal') || document.querySelector('#registerModal')) {
                resolve();
            } else {
                document.addEventListener('componentsLoaded', resolve, { once: true });
            }
        });
    }

    // 初始化认证核心模块
    initAuthCore() {
        if (typeof AuthCore !== 'undefined') {
            this.modules.authCore = new AuthCore();
            window.authCore = this.modules.authCore;
            console.log('✅ 认证核心模块初始化完成');
        }
    }

    // 初始化验证码管理模块
    initVerificationManager() {
        if (typeof VerificationManager !== 'undefined') {
            this.modules.verificationManager = new VerificationManager();
            window.verificationManager = this.modules.verificationManager;
            console.log('✅ 验证码管理模块初始化完成');
        }
    }

    // 初始化用户管理模块
    initUserManager() {
        if (typeof UserManager !== 'undefined') {
            this.modules.userManager = new UserManager();
            window.userManager = this.modules.userManager;
            console.log('✅ 用户管理模块初始化完成');
        }
    }

    // 初始化头像管理模块
    initAvatarManager() {
        if (typeof AvatarManager !== 'undefined') {
            this.modules.avatarManager = new AvatarManager();
            window.avatarManager = this.modules.avatarManager;
            console.log('✅ 头像管理模块初始化完成');
        }
    }

    // 初始化模态框管理模块
    initModalManager() {
        if (typeof ModalManager !== 'undefined') {
            this.modules.modalManager = new ModalManager();
            window.modalManager = this.modules.modalManager;
            console.log('✅ 模态框管理模块初始化完成');
        }
    }

    // 初始化套餐管理模块
    initPackageManager() {
        if (typeof PackageManager !== 'undefined') {
            this.modules.packageManager = new PackageManager();
            window.packageManager = this.modules.packageManager;
            console.log('✅ 套餐管理模块初始化完成');
        }
    }

    // 设置全局函数（向后兼容）
    setupGlobalFunctions() {
        // 模态框相关
        window.openLoginModal = () => this.modules.modalManager?.openLoginModal();
        window.openRegisterModal = () => this.modules.modalManager?.openRegisterModal();
        window.openForgotPasswordModal = () => this.modules.modalManager?.openForgotPasswordModal();
        window.closeModal = (modalId) => this.modules.modalManager?.closeModal(modalId);
        window.closeAllModals = () => this.modules.modalManager?.closeAllModals();
        window.switchToRegister = () => this.modules.modalManager?.switchToRegister();
        window.switchToLogin = () => this.modules.modalManager?.switchToLogin();
        
        // 用户相关
        window.showProfile = () => {
            if (!this.modules.authCore?.currentUser) {
                this.modules.modalManager?.openLoginModal();
                return;
            }
            this.modules.modalManager?.openProfileModal();
        };
        
        window.showMyPlans = () => this.modules.packageManager?.showMyPlans();
        
        window.showSettings = () => {
            if (!this.modules.authCore?.currentUser) {
                this.modules.modalManager?.openLoginModal();
                return;
            }
            this.modules.modalManager?.openSettingsModal();
        };
        
        window.logout = () => this.modules.authCore?.logout();
        
        // 用户菜单
        window.showUserMenu = () => this.modules.modalManager?.showUserMenu();
        
        // 表单处理
        window.handleLogin = (event) => this.modules.userManager?.handleLogin(event);
        window.handleRegister = (event) => this.modules.userManager?.handleRegister(event);
        window.handleProfileUpdate = (event) => this.modules.userManager?.handleProfileUpdate(event);
        window.handlePasswordUpdate = (event) => this.modules.userManager?.handlePasswordUpdate(event);
        
        // 验证码相关
        window.sendVerificationCode = () => this.modules.verificationManager?.sendVerificationCode();
        window.sendProfileVerificationCode = () => this.modules.verificationManager?.sendProfileVerificationCode();
        window.sendResetCode = (event) => this.modules.modalManager?.sendResetCode(event);
        window.resetPassword = (event) => this.modules.modalManager?.resetPassword(event);
        window.resendResetCode = () => this.modules.modalManager?.resendResetCode();
        
        // 头像相关
        window.openAvatarUploadModal = () => this.modules.avatarManager?.openUploadModal();
        window.triggerFileSelect = () => this.modules.avatarManager?.triggerFileSelect();
        window.openCameraCapture = () => this.modules.avatarManager?.openCameraCapture();
        window.capturePhoto = () => this.modules.avatarManager?.capturePhoto();
        window.closeCameraCapture = () => this.modules.avatarManager?.closeCameraCapture();
        window.saveAvatar = () => this.modules.avatarManager?.saveAvatar();
        window.updateAvatarDisplay = (avatarUrl) => this.modules.avatarManager?.updateDisplay(avatarUrl);
        
        // 设置相关
        window.showSettingsTab = (tabName) => this.modules.modalManager?.showSettingsTab(tabName);
        window.resetProfileForm = () => this.modules.modalManager?.resetProfileForm();
        window.resetPasswordForm = () => this.modules.modalManager?.resetPasswordForm();
        window.checkEmailChange = () => this.modules.modalManager?.checkEmailChange();
        
        // 密码切换
        window.togglePassword = (inputId) => this.modules.modalManager?.togglePassword(inputId);
        
        // 套餐相关
        window.enrollPackage = (packageId, packageName, packagePrice) => 
            this.modules.packageManager?.enrollPackage(packageId, packageName, packagePrice);
        
        // 条款和隐私
        window.showTerms = () => this.modules.modalManager?.showTerms();
        window.showPrivacy = () => this.modules.modalManager?.showPrivacy();
        
        console.log('🌐 全局函数设置完成');
    }

    // 获取模块实例
    getModule(moduleName) {
        return this.modules[moduleName];
    }

    // 检查模块是否已加载
    isModuleLoaded(moduleName) {
        return !!this.modules[moduleName];
    }

    // 重新初始化指定模块
    reinitModule(moduleName) {
        switch (moduleName) {
            case 'authCore':
                this.initAuthCore();
                break;
            case 'verificationManager':
                this.initVerificationManager();
                break;
            case 'userManager':
                this.initUserManager();
                break;
            case 'avatarManager':
                this.initAvatarManager();
                break;
            case 'modalManager':
                this.initModalManager();
                break;
            case 'packageManager':
                this.initPackageManager();
                break;
            default:
                console.warn(`未知认证模块: ${moduleName}`);
        }
    }

    // 销毁认证应用
    destroy() {
        // 销毁各个模块
        Object.keys(this.modules).forEach(moduleName => {
            const module = this.modules[moduleName];
            if (module && typeof module.destroy === 'function') {
                module.destroy();
            }
        });
        
        // 清除全局函数
        const globalFunctions = [
            'openLoginModal', 'openRegisterModal', 'openForgotPasswordModal',
            'closeModal', 'closeAllModals', 'switchToRegister', 'switchToLogin',
            'showProfile', 'showMyPlans', 'showSettings', 'logout', 'showUserMenu',
            'handleLogin', 'handleRegister', 'handleProfileUpdate', 'handlePasswordUpdate',
            'sendVerificationCode', 'sendProfileVerificationCode', 'sendResetCode',
            'resetPassword', 'resendResetCode', 'openAvatarUploadModal',
            'triggerFileSelect', 'openCameraCapture', 'capturePhoto', 'closeCameraCapture',
            'saveAvatar', 'updateAvatarDisplay', 'showSettingsTab', 'resetProfileForm',
            'resetPasswordForm', 'checkEmailChange', 'togglePassword', 'enrollPackage',
            'showTerms', 'showPrivacy'
        ];
        
        globalFunctions.forEach(funcName => {
            if (window[funcName]) {
                delete window[funcName];
            }
        });
        
        this.modules = {};
        this.isInitialized = false;
        console.log('🗑️ 认证应用已销毁');
    }

    // 获取认证应用状态
    getStatus() {
        return {
            initialized: this.isInitialized,
            modules: Object.keys(this.modules),
            moduleCount: Object.keys(this.modules).length,
            currentUser: this.modules.authCore?.currentUser || null
        };
    }
}

// 创建全局认证应用实例
window.authApp = new AuthApp();

// 认证应用初始化完成后的回调
document.addEventListener('authAppInitialized', function() {
    console.log('🎯 认证应用初始化完成，所有认证功能已就绪');
    
    // 可以在这里添加认证应用级别的初始化逻辑
    // 例如：自动登录检查、权限验证等
});

// 导出认证应用类
window.AuthApp = AuthApp;