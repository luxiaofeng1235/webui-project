/**
 * 图片管理模块
 * 负责图片懒加载、错误处理、画廊展示等功能
 */

class ImageManager {
    constructor() {
        this.lazyImages = [];
        this.imageCache = new Map();
        this.init();
    }

    init() {
        // 禁用懒加载，直接加载所有图片
        this.loadAllImages();
        this.setupImageErrorHandling();
        this.setupGalleryFeatures();
        console.log('✅ 图片管理模块初始化完成（懒加载已禁用）');
    }

    // 设置懒加载（已禁用）
    setupLazyLoading() {
        // 懒加载已禁用，直接加载所有图片
        this.loadAllImages();
        console.log('⚠️ 懒加载已禁用，所有图片将立即加载');
    }

    // 观察懒加载图片
    observeLazyImages() {
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            this.lazyImageObserver.observe(img);
        });
    }

    // 加载图片
    loadImage(img) {
        const src = img.dataset.src;
        if (src) {
            img.src = src;
            img.classList.add('loaded');
            img.removeAttribute('data-src');
        }
    }

    // 加载所有图片（立即加载）
    loadAllImages() {
        // 处理带有 data-src 的懒加载图片
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => this.loadImage(img));

        // 确保所有图片都有正确的 src 属性
        const allImages = document.querySelectorAll('img');
        allImages.forEach(img => {
            // 如果图片没有 src 但有 data-src，立即设置
            if (!img.src && img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            }

            // 移除 loading="lazy" 属性
            if (img.getAttribute('loading') === 'lazy') {
                img.removeAttribute('loading');
            }
        });

        console.log(`✅ 已处理 ${lazyImages.length} 个懒加载图片，${allImages.length} 个总图片`);
    }

    // 设置图片错误处理
    setupImageErrorHandling() {
        document.addEventListener('error', (e) => {
            if (e.target.tagName === 'IMG') {
                this.handleImageError(e.target);
            }
        }, true);
    }

    // 处理图片加载错误
    handleImageError(img) {
        const fallbackSrc = img.getAttribute('onerror');
        if (fallbackSrc && !img.dataset.errorHandled) {
            img.dataset.errorHandled = 'true';
            console.warn(`图片加载失败，使用备用图片: ${img.src}`);
            
            // 提取备用图片路径
            const match = fallbackSrc.match(/this\.src='([^']+)'/);
            if (match) {
                img.src = match[1];
            }
        } else if (!img.dataset.errorHandled) {
            // 如果没有备用图片，显示占位符
            this.showPlaceholder(img);
        }
    }

    // 显示占位符
    showPlaceholder(img) {
        img.dataset.errorHandled = 'true';
        img.style.backgroundColor = '#f0f0f0';
        img.style.display = 'flex';
        img.style.alignItems = 'center';
        img.style.justifyContent = 'center';
        img.style.color = '#999';
        img.style.fontSize = '14px';
        img.alt = '图片加载失败';
        
        // 创建占位符内容
        const placeholder = document.createElement('div');
        placeholder.innerHTML = '<i class="fas fa-image"></i><br>图片加载中...';
        placeholder.style.textAlign = 'center';
        
        // 替换图片为占位符
        img.parentNode.replaceChild(placeholder, img);
    }

    // 设置画廊功能
    setupGalleryFeatures() {
        this.setupEnvironmentGallery();
        this.setupFacilityHover();
    }

    // 设置环境画廊
    setupEnvironmentGallery() {
        const galleryItems = document.querySelectorAll('.environment-gallery .gallery-item');
        
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                this.openLightbox(item);
            });
            
            // 添加悬停效果
            item.addEventListener('mouseenter', () => {
                item.style.transform = 'scale(1.05)';
                item.style.transition = 'transform 0.3s ease';
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.transform = 'scale(1)';
            });
        });
    }

    // 设置设施悬停效果
    setupFacilityHover() {
        const facilityItems = document.querySelectorAll('.facility-item');
        
        facilityItems.forEach(item => {
            const overlay = item.querySelector('.facility-overlay');
            
            item.addEventListener('mouseenter', () => {
                if (overlay) {
                    overlay.style.opacity = '1';
                    overlay.style.transform = 'translateY(0)';
                }
            });
            
            item.addEventListener('mouseleave', () => {
                if (overlay) {
                    overlay.style.opacity = '0';
                    overlay.style.transform = 'translateY(20px)';
                }
            });
        });
    }

    // 打开灯箱
    openLightbox(galleryItem) {
        const img = galleryItem.querySelector('img');
        const title = galleryItem.querySelector('h4')?.textContent || '';
        const description = galleryItem.querySelector('p')?.textContent || '';
        
        if (!img) return;
        
        // 创建灯箱
        const lightbox = document.createElement('div');
        lightbox.className = 'image-lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-overlay">
                <div class="lightbox-content">
                    <button class="lightbox-close">&times;</button>
                    <img src="${img.src}" alt="${img.alt}">
                    <div class="lightbox-info">
                        <h3>${title}</h3>
                        <p>${description}</p>
                    </div>
                </div>
            </div>
        `;
        
        // 添加样式
        lightbox.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        const overlay = lightbox.querySelector('.lightbox-overlay');
        overlay.style.cssText = `
            position: relative;
            max-width: 90%;
            max-height: 90%;
            text-align: center;
        `;
        
        const content = lightbox.querySelector('.lightbox-content');
        content.style.cssText = `
            position: relative;
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        `;
        
        const closeBtn = lightbox.querySelector('.lightbox-close');
        closeBtn.style.cssText = `
            position: absolute;
            top: 10px;
            right: 15px;
            background: none;
            border: none;
            font-size: 30px;
            color: white;
            cursor: pointer;
            z-index: 1;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        const lightboxImg = lightbox.querySelector('img');
        lightboxImg.style.cssText = `
            max-width: 100%;
            max-height: 70vh;
            display: block;
        `;
        
        const info = lightbox.querySelector('.lightbox-info');
        info.style.cssText = `
            padding: 20px;
            background: white;
        `;
        
        // 添加到页面
        document.body.appendChild(lightbox);
        
        // 显示动画
        setTimeout(() => {
            lightbox.style.opacity = '1';
        }, 10);
        
        // 绑定关闭事件
        const closeLightbox = () => {
            lightbox.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(lightbox);
            }, 300);
        };
        
        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
        
        // ESC键关闭
        const handleKeydown = (e) => {
            if (e.key === 'Escape') {
                closeLightbox();
                document.removeEventListener('keydown', handleKeydown);
            }
        };
        document.addEventListener('keydown', handleKeydown);
    }

    // 预加载图片
    preloadImage(src) {
        return new Promise((resolve, reject) => {
            if (this.imageCache.has(src)) {
                resolve(this.imageCache.get(src));
                return;
            }
            
            const img = new Image();
            img.onload = () => {
                this.imageCache.set(src, img);
                resolve(img);
            };
            img.onerror = reject;
            img.src = src;
        });
    }

    // 批量预加载图片
    async preloadImages(srcArray) {
        const promises = srcArray.map(src => this.preloadImage(src));
        try {
            await Promise.all(promises);
            console.log('✅ 图片预加载完成');
        } catch (error) {
            console.warn('⚠️ 部分图片预加载失败:', error);
        }
    }

    // 优化图片显示（禁用懒加载）
    optimizeImageDisplay() {
        const images = document.querySelectorAll('img');

        images.forEach(img => {
            // 添加加载状态
            img.addEventListener('loadstart', () => {
                img.style.opacity = '0.5';
            });

            img.addEventListener('load', () => {
                img.style.opacity = '1';
                img.style.transition = 'opacity 0.3s ease';
            });

            // 移除懒加载属性，确保图片立即加载
            if (img.dataset.src && !img.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            }

            // 移除 loading="lazy" 属性
            if (img.getAttribute('loading') === 'lazy') {
                img.removeAttribute('loading');
            }
        });
    }

    // 响应式图片处理
    handleResponsiveImages() {
        const images = document.querySelectorAll('img[data-mobile-src]');
        
        const updateImageSrc = () => {
            const isMobile = window.innerWidth <= 768;
            
            images.forEach(img => {
                const mobileSrc = img.dataset.mobileSrc;
                const desktopSrc = img.dataset.desktopSrc || img.src;
                
                if (isMobile && mobileSrc) {
                    img.src = mobileSrc;
                } else {
                    img.src = desktopSrc;
                }
            });
        };
        
        // 初始化
        updateImageSrc();
        
        // 监听窗口大小变化
        window.addEventListener('resize', updateImageSrc);
    }

    // 销毁模块
    destroy() {
        if (this.lazyImageObserver) {
            this.lazyImageObserver.disconnect();
        }
        
        // 清除缓存
        this.imageCache.clear();
        
        console.log('🗑️ 图片管理模块已销毁');
    }
}

// 导出模块
window.ImageManager = ImageManager;