/**
 * 组件加载器 - 用于动态加载HTML组件
 */
class ComponentLoader {
    constructor() {
        this.loadedComponents = new Set();
    }

    /**
     * 加载单个组件
     * @param {string} componentName - 组件名称
     * @param {string} targetSelector - 目标容器选择器
     */
    async loadComponent(componentName, targetSelector) {
        try {
            const response = await fetch(`components/${componentName}.html`);
            if (!response.ok) {
                throw new Error(`Failed to load component: ${componentName}`);
            }
            
            const html = await response.text();
            const targetElement = document.querySelector(targetSelector);
            
            if (targetElement) {
                targetElement.innerHTML = html;
                this.loadedComponents.add(componentName);
                console.log(`✅ 组件加载成功: ${componentName}`);
            } else {
                console.error(`❌ 目标容器未找到: ${targetSelector}`);
            }
        } catch (error) {
            console.error(`❌ 组件加载失败: ${componentName}`, error);
        }
    }

    /**
     * 批量加载组件
     * @param {Array} components - 组件配置数组 [{name: 'header', target: '#header-container'}]
     */
    async loadComponents(components) {
        const loadPromises = components.map(component => 
            this.loadComponent(component.name, component.target)
        );
        
        await Promise.all(loadPromises);
        console.log('🎉 所有组件加载完成');
        
        // 触发组件加载完成事件
        document.dispatchEvent(new CustomEvent('componentsLoaded'));
    }

    /**
     * 检查组件是否已加载
     * @param {string} componentName - 组件名称
     */
    isLoaded(componentName) {
        return this.loadedComponents.has(componentName);
    }

    /**
     * 获取已加载的组件列表
     */
    getLoadedComponents() {
        return Array.from(this.loadedComponents);
    }
}

// 创建全局组件加载器实例
window.componentLoader = new ComponentLoader();

// 页面加载完成后自动加载组件
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 开始加载页面组件...');
    
    // 定义要加载的组件
    const components = [
        { name: 'header', target: '#header-container' },
        { name: 'hero', target: '#hero-container' },
        { name: 'about', target: '#about-container' },
        { name: 'trainers', target: '#trainers-container' },
        { name: 'programs', target: '#programs-container' },
        { name: 'success-stories', target: '#success-stories-container' },
        { name: 'facilities', target: '#facilities-container' },
        { name: 'community', target: '#community-container' },
        { name: 'contact', target: '#contact-container' },
        { name: 'modals', target: '#modals-container' }
    ];
    
    // 加载所有组件
    await window.componentLoader.loadComponents(components);
});

// 组件加载完成后的回调
document.addEventListener('componentsLoaded', function() {
    console.log('🎯 组件加载完成，等待应用初始化...');
    
    // 组件加载完成后，应用会自动初始化各个模块
    // 不需要在这里手动初始化功能
});