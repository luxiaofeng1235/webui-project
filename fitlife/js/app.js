/**
 * 主应用管理器
 * 统一管理所有功能模块的初始化和协调
 */

class FitnessApp {
    constructor() {
        this.modules = {};
        this.isInitialized = false;
        this.init();
    }

    async init() {
        console.log('🚀 健身应用初始化开始...');
        
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
            
            // 初始化各个模块
            this.initNavigationModule();
            this.initTrainerModule();
            this.initUtilsModule();
            this.initCommunityModule();
            this.initHeroSliderModule();
            this.initImageManagerModule();
            
            // 标记为已初始化
            this.isInitialized = true;
            
            console.log('✨ 健身应用初始化完成');
            
            // 触发应用初始化完成事件
            document.dispatchEvent(new CustomEvent('appInitialized'));
            
        } catch (error) {
            console.error('❌ 应用初始化失败:', error);
        }
    }

    // 等待组件加载完成
    waitForComponents() {
        return new Promise((resolve) => {
            if (document.querySelector('#header-container .navbar')) {
                resolve();
            } else {
                document.addEventListener('componentsLoaded', resolve, { once: true });
            }
        });
    }

    // 初始化导航模块
    initNavigationModule() {
        if (typeof NavigationManager !== 'undefined') {
            this.modules.navigation = new NavigationManager();
            window.navigationManager = this.modules.navigation;
            console.log('✅ 导航模块初始化完成');
        }
    }

    // 初始化教练模块
    initTrainerModule() {
        if (typeof TrainerManager !== 'undefined') {
            this.modules.trainer = new TrainerManager();
            window.trainerManager = this.modules.trainer;
            console.log('✅ 教练模块初始化完成');
        }
    }

    // 初始化工具模块
    initUtilsModule() {
        if (typeof UtilsManager !== 'undefined') {
            this.modules.utils = new UtilsManager();
            window.utilsManager = this.modules.utils;
            console.log('✅ 工具模块初始化完成');
        }
    }

    // 初始化社区模块
    initCommunityModule() {
        if (typeof CommunityManager !== 'undefined') {
            this.modules.community = new CommunityManager();
            window.communityManager = this.modules.community;
            console.log('✅ 社区模块初始化完成');
        }
    }

    // 初始化轮播图模块
    initHeroSliderModule() {
        // 延迟初始化轮播图，确保图片加载完成
        setTimeout(() => {
            if (typeof HeroSlider !== 'undefined') {
                this.modules.heroSlider = new HeroSlider();
                window.heroSlider = this.modules.heroSlider;
                console.log('✅ 轮播图模块初始化完成');
            }
        }, 200);
    }

    // 初始化图片管理模块
    initImageManagerModule() {
        if (typeof ImageManager !== 'undefined') {
            this.modules.imageManager = new ImageManager();
            window.imageManager = this.modules.imageManager;
            console.log('✅ 图片管理模块初始化完成');
        }
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
            case 'navigation':
                this.initNavigationModule();
                break;
            case 'trainer':
                this.initTrainerModule();
                break;
            case 'utils':
                this.initUtilsModule();
                break;
            case 'community':
                this.initCommunityModule();
                break;
            case 'heroSlider':
                this.initHeroSliderModule();
                break;
            case 'imageManager':
                this.initImageManagerModule();
                break;
            default:
                console.warn(`未知模块: ${moduleName}`);
        }
    }

    // 销毁应用
    destroy() {
        // 销毁各个模块
        Object.keys(this.modules).forEach(moduleName => {
            const module = this.modules[moduleName];
            if (module && typeof module.destroy === 'function') {
                module.destroy();
            }
        });
        
        this.modules = {};
        this.isInitialized = false;
        console.log('🗑️ 应用已销毁');
    }

    // 获取应用状态
    getStatus() {
        return {
            initialized: this.isInitialized,
            modules: Object.keys(this.modules),
            moduleCount: Object.keys(this.modules).length
        };
    }
}

// 创建全局应用实例
window.fitnessApp = new FitnessApp();

// 向后兼容的全局函数
window.initHeroSlider = function() {
    const app = window.fitnessApp;
    if (app && app.isInitialized) {
        app.reinitModule('heroSlider');
    }
};

window.initCountdownTimer = function() {
    const app = window.fitnessApp;
    if (app && app.isInitialized && app.modules.utils) {
        app.modules.utils.initCountdownTimer();
    }
};

// 应用初始化完成后的回调
document.addEventListener('appInitialized', function() {
    console.log('🎯 应用初始化完成，所有模块已就绪');
    
    // 可以在这里添加应用级别的初始化逻辑
    // 例如：用户状态检查、主题设置等
});

// 导出应用类
window.FitnessApp = FitnessApp;