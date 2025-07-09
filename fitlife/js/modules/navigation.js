/**
 * 导航模块
 * 负责导航栏滚动效果、移动端菜单切换等导航相关功能
 */

class NavigationManager {
    constructor() {
        this.init();
    }

    init() {
        this.initMobileMenu();
        this.initScrollEffect();
        this.initSmoothScroll();
    }

    // 移动端导航菜单切换
    initMobileMenu() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (!hamburger || !navMenu) return;
        
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // 点击菜单项后关闭移动端菜单
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // 导航栏滚动效果
    initScrollEffect() {
        window.addEventListener('scroll', () => {
            const navbar = document.querySelector('.navbar');
            if (!navbar) return;

            if (window.scrollY > 100) {
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            }
        });
    }

    // 平滑滚动
    initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href').substring(1);
                this.smoothScrollTo(targetId);
            });
        });
    }

    // 平滑滚动到目标元素
    smoothScrollTo(targetId) {
        const targetElement = document.getElementById(targetId);
        if (!targetElement) return;

        const offsetTop = targetElement.offsetTop - 80; // 考虑导航栏高度
        
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }

    // 高亮当前导航项
    highlightCurrentNav() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
        
        window.addEventListener('scroll', () => {
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                const sectionHeight = section.offsetHeight;
                
                if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }
}

// 导出模块
window.NavigationManager = NavigationManager;

// 全局函数兼容性
window.smoothScrollTo = function(targetId) {
    if (window.navigationManager) {
        window.navigationManager.smoothScrollTo(targetId);
    }
};