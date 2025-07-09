/**
 * 工具函数模块
 * 包含BMI计算器、倒计时、动画效果等通用工具函数
 */

class UtilsManager {
    constructor() {
        this.init();
    }

    init() {
        this.initBMICalculator();
        this.initAnimations();
        this.initCountdownTimer();
    }

    // BMI计算器功能
    initBMICalculator() {
        const calculateBtn = document.querySelector('#calculate-bmi, .bmi-calculator button');
        if (calculateBtn) {
            calculateBtn.addEventListener('click', () => this.calculateBMI());
        }
    }

    calculateBMI() {
        const height = parseFloat(document.getElementById('height')?.value);
        const weight = parseFloat(document.getElementById('weight')?.value);
        
        if (!height || !weight || height <= 0 || weight <= 0) {
            alert('请输入有效的身高和体重数值！');
            return;
        }
        
        // 计算BMI
        const heightInMeters = height / 100;
        const bmi = weight / (heightInMeters * heightInMeters);
        
        // 确定BMI状态
        const bmiResult = this.getBMIStatus(bmi);
        
        // 显示结果
        this.displayBMIResult(bmi, bmiResult);
        
        // 高亮对应的BMI范围
        this.highlightBMIRange(bmiResult.statusClass);
    }

    getBMIStatus(bmi) {
        if (bmi < 18.5) {
            return { status: '偏瘦', statusClass: 'underweight' };
        } else if (bmi >= 18.5 && bmi < 25) {
            return { status: '正常', statusClass: 'normal' };
        } else if (bmi >= 25 && bmi < 30) {
            return { status: '超重', statusClass: 'overweight' };
        } else {
            return { status: '肥胖', statusClass: 'obese' };
        }
    }

    displayBMIResult(bmi, bmiResult) {
        const resultDiv = document.getElementById('bmi-result');
        if (resultDiv) {
            resultDiv.innerHTML = `
                <div class="bmi-value">${bmi.toFixed(1)}</div>
                <div class="bmi-status ${bmiResult.statusClass}">${bmiResult.status}</div>
            `;
        }
    }

    highlightBMIRange(statusClass) {
        // 移除所有高亮
        document.querySelectorAll('.bmi-range').forEach(range => {
            range.classList.remove('highlight');
        });
        
        // 高亮对应范围
        const targetRange = document.querySelector(`.bmi-range.${statusClass}`);
        if (targetRange) {
            targetRange.classList.add('highlight');
        }
    }

    // 动画效果
    initAnimations() {
        this.initScrollAnimations();
        this.initNumberAnimations();
    }

    initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // 观察需要动画的元素
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });
    }

    initNumberAnimations() {
        const numberElements = document.querySelectorAll('.animate-number');
        
        const numberObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateNumber(entry.target);
                    numberObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        numberElements.forEach(el => {
            numberObserver.observe(el);
        });
    }

    animateNumber(element) {
        const finalNumber = parseInt(element.textContent);
        const duration = 2000; // 2秒
        const steps = 60;
        const increment = finalNumber / steps;
        let current = 0;
        let step = 0;

        const timer = setInterval(() => {
            current += increment;
            step++;
            
            if (step >= steps) {
                current = finalNumber;
                clearInterval(timer);
            }
            
            element.textContent = Math.floor(current);
        }, duration / steps);
    }

    // 倒计时功能
    initCountdownTimer() {
        const daysElement = document.getElementById('days');
        const hoursElement = document.getElementById('hours');
        const minutesElement = document.getElementById('minutes');
        
        if (!daysElement || !hoursElement || !minutesElement) return;
        
        this.updateCountdown();
        // 每分钟更新一次
        setInterval(() => this.updateCountdown(), 60000);
    }

    updateCountdown() {
        // 设置结束时间（15天后）
        const endTime = new Date();
        endTime.setDate(endTime.getDate() + 15);
        
        const now = new Date();
        const timeLeft = endTime - now;
        
        if (timeLeft > 0) {
            const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            
            const daysElement = document.getElementById('days');
            const hoursElement = document.getElementById('hours');
            const minutesElement = document.getElementById('minutes');
            
            if (daysElement) daysElement.textContent = days.toString().padStart(2, '0');
            if (hoursElement) hoursElement.textContent = hours.toString().padStart(2, '0');
            if (minutesElement) minutesElement.textContent = minutes.toString().padStart(2, '0');
        }
    }

    // 工具函数：防抖
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // 工具函数：节流
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // 工具函数：格式化日期
    formatDate(date, format = 'YYYY-MM-DD') {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        
        return format
            .replace('YYYY', year)
            .replace('MM', month)
            .replace('DD', day);
    }

    // 工具函数：生成随机ID
    generateId(length = 8) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    // 工具函数：本地存储
    storage = {
        set: (key, value) => {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (e) {
                console.error('存储失败:', e);
                return false;
            }
        },
        
        get: (key, defaultValue = null) => {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch (e) {
                console.error('读取失败:', e);
                return defaultValue;
            }
        },
        
        remove: (key) => {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (e) {
                console.error('删除失败:', e);
                return false;
            }
        }
    };

    // 工具函数：验证邮箱
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // 工具函数：验证手机号
    validatePhone(phone) {
        const re = /^1[3-9]\d{9}$/;
        return re.test(phone);
    }
}

// 导出模块
window.UtilsManager = UtilsManager;

// 全局函数兼容性
window.calculateBMI = function() {
    if (window.utilsManager) {
        window.utilsManager.calculateBMI();
    }
};

window.initCountdownTimer = function() {
    if (window.utilsManager) {
        window.utilsManager.initCountdownTimer();
    }
};

window.animateOnScroll = function() {
    if (window.utilsManager) {
        window.utilsManager.initScrollAnimations();
    }
};

window.animateNumbers = function() {
    if (window.utilsManager) {
        window.utilsManager.initNumberAnimations();
    }
};