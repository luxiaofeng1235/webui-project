/**
 * 禁用懒加载脚本
 * 强制所有图片立即加载，移除懒加载相关属性
 */

console.log('🚫 开始禁用懒加载...');

// 禁用懒加载的主函数
function disableLazyLoading() {
    // 1. 处理所有带有 data-src 的图片
    const lazyImages = document.querySelectorAll('img[data-src]');
    console.log(`发现 ${lazyImages.length} 个懒加载图片`);
    
    lazyImages.forEach((img, index) => {
        const dataSrc = img.getAttribute('data-src');
        if (dataSrc) {
            console.log(`处理懒加载图片 ${index + 1}: ${dataSrc}`);
            img.src = dataSrc;
            img.removeAttribute('data-src');
        }
    });
    
    // 2. 移除所有 loading="lazy" 属性
    const lazyLoadingImages = document.querySelectorAll('img[loading="lazy"]');
    console.log(`发现 ${lazyLoadingImages.length} 个带有 loading="lazy" 的图片`);
    
    lazyLoadingImages.forEach((img, index) => {
        console.log(`移除 loading="lazy" 属性 ${index + 1}: ${img.src}`);
        img.removeAttribute('loading');
    });
    
    // 3. 确保所有图片都有正确的 src
    const allImages = document.querySelectorAll('img');
    console.log(`检查所有 ${allImages.length} 个图片`);
    
    allImages.forEach((img, index) => {
        // 如果图片没有 src 但有其他数据属性
        if (!img.src || img.src.includes('data:image/svg+xml')) {
            const possibleSources = [
                img.getAttribute('data-src'),
                img.getAttribute('data-original'),
                img.getAttribute('data-lazy'),
                img.getAttribute('data-image')
            ].filter(Boolean);
            
            if (possibleSources.length > 0) {
                console.log(`修复图片 ${index + 1}: ${possibleSources[0]}`);
                img.src = possibleSources[0];
                
                // 移除所有懒加载相关属性
                ['data-src', 'data-original', 'data-lazy', 'data-image'].forEach(attr => {
                    img.removeAttribute(attr);
                });
            }
        }
        
        // 移除懒加载相关的类
        const lazyClasses = ['lazy', 'lazyload', 'lazy-load', 'loading'];
        lazyClasses.forEach(className => {
            if (img.classList.contains(className)) {
                img.classList.remove(className);
            }
        });
        
        // 添加立即加载的类
        img.classList.add('no-lazy');
    });
    
    console.log('✅ 懒加载禁用完成');
}

// 禁用 Intersection Observer（如果存在）
function disableIntersectionObserver() {
    if (window.IntersectionObserver) {
        const originalIntersectionObserver = window.IntersectionObserver;
        
        // 重写 IntersectionObserver 构造函数
        window.IntersectionObserver = function(callback, options) {
            console.log('⚠️ 拦截 IntersectionObserver 创建，立即触发回调');
            
            // 创建一个假的观察器
            return {
                observe: function(target) {
                    // 立即触发回调，模拟元素进入视口
                    setTimeout(() => {
                        callback([{
                            target: target,
                            isIntersecting: true,
                            intersectionRatio: 1
                        }], this);
                    }, 0);
                },
                unobserve: function() {},
                disconnect: function() {}
            };
        };
        
        // 保留原始构造函数的属性
        Object.setPrototypeOf(window.IntersectionObserver, originalIntersectionObserver);
    }
}

// 监听图片加载错误
function setupImageErrorHandling() {
    document.addEventListener('error', function(e) {
        if (e.target.tagName === 'IMG') {
            const img = e.target;
            console.warn(`图片加载失败: ${img.src}`);
            
            // 尝试备用图片
            if (!img.dataset.errorHandled) {
                img.dataset.errorHandled = 'true';
                
                const fallbackImages = [
                    'images/pexels-photo-1552242.webp',
                    'images/hero-1.jpg',
                    'images/trainer-1.jpg'
                ];
                
                for (const fallback of fallbackImages) {
                    if (img.src !== fallback) {
                        console.log(`尝试备用图片: ${fallback}`);
                        img.src = fallback;
                        break;
                    }
                }
            }
        }
    }, true);
}

// 强制刷新所有图片
function forceRefreshImages() {
    const images = document.querySelectorAll('img');
    console.log(`强制刷新 ${images.length} 个图片`);
    
    images.forEach((img, index) => {
        if (img.src && !img.complete) {
            const originalSrc = img.src;
            img.src = '';
            setTimeout(() => {
                img.src = originalSrc;
                console.log(`刷新图片 ${index + 1}: ${originalSrc}`);
            }, 10);
        }
    });
}

// 主执行函数
function executeDisableLazyLoading() {
    console.log('🔧 执行懒加载禁用...');
    
    // 1. 禁用 Intersection Observer
    disableIntersectionObserver();
    
    // 2. 设置图片错误处理
    setupImageErrorHandling();
    
    // 3. 禁用懒加载
    disableLazyLoading();
    
    // 4. 强制刷新图片
    setTimeout(() => {
        forceRefreshImages();
    }, 100);
    
    console.log('🎉 懒加载禁用执行完成');
}

// 导出函数
window.disableLazyLoading = executeDisableLazyLoading;

// 页面加载时自动执行
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', executeDisableLazyLoading);
} else {
    executeDisableLazyLoading();
}

// 组件加载完成后再次执行
document.addEventListener('componentsLoaded', function() {
    console.log('组件加载完成，再次禁用懒加载');
    setTimeout(executeDisableLazyLoading, 500);
});

// 定期检查并禁用懒加载
setInterval(() => {
    const lazyImages = document.querySelectorAll('img[data-src], img[loading="lazy"]');
    if (lazyImages.length > 0) {
        console.log(`发现新的懒加载图片 ${lazyImages.length} 个，立即处理`);
        disableLazyLoading();
    }
}, 1000);

console.log('💡 懒加载禁用脚本已加载，可手动调用 disableLazyLoading()');
