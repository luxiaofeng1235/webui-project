/**
 * 主页轮播图模块
 * 负责首页Hero区域的图片轮播功能
 */

class HeroSlider {
    constructor() {
        this.currentSlide = 0;
        this.images = [];
        this.dots = [];
        this.autoPlayInterval = null;
        this.init();
    }

    init() {
        this.images = document.querySelectorAll('.hero-img');
        this.dots = document.querySelectorAll('.dot');
        
        console.log('轮播图初始化:', this.images.length, '张图片,', this.dots.length, '个圆点');
        
        if (this.images.length === 0 || this.dots.length === 0) {
            console.error('轮播图元素未找到');
            return;
        }

        this.setupEventListeners();
        this.preloadImages();
        this.fixEdgeImageLoading();
        
        // 延迟初始化确保图片加载完成
        setTimeout(() => {
            this.showSlide(0);
            this.startAutoPlay();
        }, 100);
    }

    // 设置事件监听器
    setupEventListeners() {
        // 点击圆点切换图片
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                console.log('点击圆点:', index + 1);
                this.currentSlide = index;
                this.showSlide(this.currentSlide);
                this.resetAutoPlay();
            });
        });

        // 键盘控制
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.previousSlide();
            } else if (e.key === 'ArrowRight') {
                this.nextSlide();
            }
        });

        // 鼠标悬停暂停自动播放
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            heroSection.addEventListener('mouseenter', () => this.pauseAutoPlay());
            heroSection.addEventListener('mouseleave', () => this.startAutoPlay());
        }
    }

    // 显示指定幻灯片
    showSlide(index) {
        console.log('切换到图片:', index + 1);
        
        // 隐藏所有图片
        this.images.forEach((img, i) => {
            img.classList.remove('active');
            img.style.opacity = '0';
            img.style.zIndex = '1';
        });
        
        this.dots.forEach(dot => dot.classList.remove('active'));
        
        // 显示当前图片
        this.images[index].classList.add('active');
        this.images[index].style.opacity = '1';
        this.images[index].style.zIndex = '2';
        this.dots[index].classList.add('active');
        
        // Edge浏览器兼容性修复
        this.fixEdgeImageDisplay(this.images[index]);
    }

    // Edge浏览器图片显示修复
    fixEdgeImageDisplay(currentImg) {
        if (!currentImg.complete || currentImg.naturalWidth === 0) {
            const tempImg = new Image();
            tempImg.onload = function() {
                currentImg.src = this.src;
                currentImg.style.opacity = '1';
            };
            tempImg.onerror = function() {
                console.error('图片加载失败:', currentImg.src);
            };
            tempImg.src = currentImg.src.split('?')[0] + '?t=' + Date.now();
        }
    }

    // 下一张幻灯片
    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.images.length;
        this.showSlide(this.currentSlide);
    }

    // 上一张幻灯片
    previousSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.images.length) % this.images.length;
        this.showSlide(this.currentSlide);
    }

    // 开始自动播放
    startAutoPlay() {
        this.pauseAutoPlay(); // 先清除现有的定时器
        this.autoPlayInterval = setInterval(() => this.nextSlide(), 4000);
        console.log('轮播图自动播放已启动，间隔4秒');
    }

    // 暂停自动播放
    pauseAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }

    // 重置自动播放
    resetAutoPlay() {
        this.startAutoPlay();
    }

    // Edge浏览器图片加载修复
    fixEdgeImageLoading() {
        this.images.forEach((img, index) => {
            img.style.position = 'absolute';
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover';
            
            // 检查图片是否加载
            if (img.complete && img.naturalWidth > 0) {
                console.log('图片已加载:', index + 1);
            } else {
                console.log('重新加载图片:', index + 1);
                const originalSrc = img.src;
                img.src = '';
                setTimeout(() => {
                    img.src = originalSrc;
                }, 50);
            }
        });
    }

    // 预加载所有图片
    preloadImages() {
        this.images.forEach((img, index) => {
            if (!img.complete || img.naturalWidth === 0) {
                const tempImg = new Image();
                tempImg.onload = function() {
                    console.log('图片预加载完成:', index + 1);
                };
                tempImg.onerror = function() {
                    console.error('图片预加载失败:', index + 1, img.src);
                };
                tempImg.src = img.src;
            }
        });
    }

    // 跳转到指定幻灯片
    goToSlide(index) {
        if (index >= 0 && index < this.images.length) {
            this.currentSlide = index;
            this.showSlide(this.currentSlide);
            this.resetAutoPlay();
        }
    }

    // 获取当前幻灯片索引
    getCurrentSlide() {
        return this.currentSlide;
    }

    // 获取幻灯片总数
    getTotalSlides() {
        return this.images.length;
    }

    // 销毁轮播图
    destroy() {
        this.pauseAutoPlay();
        // 移除事件监听器等清理工作
    }
}

// 导出模块
window.HeroSlider = HeroSlider;

// 全局函数兼容性
window.initHeroSlider = function() {
    if (!window.heroSlider) {
        window.heroSlider = new HeroSlider();
    }
};