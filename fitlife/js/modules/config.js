/**
 * 模块配置文件
 * 定义各个模块的配置选项和常量
 */

window.ModuleConfig = {
    // 应用全局配置
    app: {
        name: '健身俱乐部',
        version: '2.0.0',
        debug: true, // 开发模式
        loadTimeout: 10000 // 模块加载超时时间(ms)
    },

    // 轮播图配置
    heroSlider: {
        autoPlay: true,
        interval: 4000, // 自动播放间隔(ms)
        enableKeyboard: true, // 启用键盘控制
        enableTouch: true, // 启用触摸控制
        pauseOnHover: true // 鼠标悬停暂停
    },

    // 导航配置
    navigation: {
        scrollOffset: 80, // 滚动偏移量
        highlightCurrent: true, // 高亮当前导航项
        smoothScroll: true, // 平滑滚动
        mobileBreakpoint: 768 // 移动端断点
    },

    // 动画配置
    animations: {
        scrollThreshold: 0.1, // 滚动动画触发阈值
        numberAnimationDuration: 2000, // 数字动画持续时间
        enableIntersectionObserver: true // 启用交叉观察器
    },

    // BMI计算器配置
    bmi: {
        ranges: {
            underweight: { min: 0, max: 18.5, label: '偏瘦', color: '#3498db' },
            normal: { min: 18.5, max: 25, label: '正常', color: '#2ecc71' },
            overweight: { min: 25, max: 30, label: '超重', color: '#f39c12' },
            obese: { min: 30, max: 100, label: '肥胖', color: '#e74c3c' }
        }
    },

    // 社区功能配置
    community: {
        maxPostLength: 500, // 最大帖子长度
        maxReviewLength: 200, // 最大评价长度
        enableLikes: true, // 启用点赞功能
        enableComments: true, // 启用评论功能
        autoSave: true, // 自动保存草稿
        autoSaveInterval: 30000 // 自动保存间隔(ms)
    },

    // 教练模块配置
    trainers: {
        enableBooking: true, // 启用预约功能
        enableContact: true, // 启用联系功能
        showRatings: true, // 显示评分
        showPricing: true // 显示价格
    },

    // 倒计时配置
    countdown: {
        endDate: null, // 结束日期，null表示15天后
        daysToAdd: 15, // 添加的天数
        updateInterval: 60000, // 更新间隔(ms)
        showSeconds: false // 是否显示秒数
    },

    // 本地存储配置
    storage: {
        prefix: 'fitness_app_', // 存储键前缀
        version: '1.0', // 存储版本
        expiry: 7 * 24 * 60 * 60 * 1000 // 过期时间(7天)
    },

    // API配置（如果有后端服务）
    api: {
        baseUrl: '/api',
        timeout: 5000,
        retryAttempts: 3,
        retryDelay: 1000
    },

    // 错误处理配置
    errorHandling: {
        enableGlobalHandler: true, // 启用全局错误处理
        logErrors: true, // 记录错误
        showUserFriendlyMessages: true // 显示用户友好的错误信息
    },

    // 性能监控配置
    performance: {
        enableMonitoring: true, // 启用性能监控
        logLoadTimes: true, // 记录加载时间
        trackUserInteractions: false // 跟踪用户交互
    },

    // 主题配置
    theme: {
        default: 'light',
        enableDarkMode: false, // 暂未实现
        enableCustomThemes: false
    },

    // 可访问性配置
    accessibility: {
        enableKeyboardNavigation: true, // 启用键盘导航
        enableScreenReader: true, // 启用屏幕阅读器支持
        enableHighContrast: false, // 启用高对比度模式
        enableReducedMotion: false // 启用减少动画模式
    }
};

// 获取配置的辅助函数
window.getConfig = function(path, defaultValue = null) {
    const keys = path.split('.');
    let current = window.ModuleConfig;
    
    for (const key of keys) {
        if (current && typeof current === 'object' && key in current) {
            current = current[key];
        } else {
            return defaultValue;
        }
    }
    
    return current;
};

// 设置配置的辅助函数
window.setConfig = function(path, value) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    let current = window.ModuleConfig;
    
    for (const key of keys) {
        if (!(key in current) || typeof current[key] !== 'object') {
            current[key] = {};
        }
        current = current[key];
    }
    
    current[lastKey] = value;
};

// 验证配置的辅助函数
window.validateConfig = function() {
    const requiredPaths = [
        'app.name',
        'app.version',
        'heroSlider.interval',
        'navigation.scrollOffset'
    ];
    
    const missing = [];
    
    for (const path of requiredPaths) {
        if (getConfig(path) === null) {
            missing.push(path);
        }
    }
    
    if (missing.length > 0) {
        console.warn('缺少必需的配置项:', missing);
        return false;
    }
    
    return true;
};

// 初始化时验证配置
if (getConfig('app.debug')) {
    console.log('📋 模块配置已加载');
    validateConfig();
}