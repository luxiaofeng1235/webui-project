// 教练详情数据
const trainersData = {
    'zhang': {
        name: '张强',
        title: '首席力量教练',
        image: 'images/hero-1.jpg',
        badge: '⭐ 金牌教练',
        credentials: ['ACSM认证', 'NSCA-CPT', '8年经验'],
        specialties: ['力量训练', '体能提升', '运动康复'],
        description: '北京体育大学运动训练专业毕业，专精力量训练和体能提升。曾担任多名职业运动员体能教练，帮助500+学员实现健身目标。擅长制定个性化训练计划，注重动作标准和安全性。',
        experience: [
            '北京体育大学运动训练专业硕士学位',
            '曾任国家举重队体能教练助理',
            '拥有ACSM、NSCA双重国际认证',
            '8年专业健身指导经验',
            '成功指导500+学员达成健身目标'
        ],
        achievements: [
            { icon: 'fas fa-trophy', text: '2023年度最佳教练' },
            { icon: 'fas fa-users', text: '500+成功学员' },
            { icon: 'fas fa-medal', text: '国际认证教练' },
            { icon: 'fas fa-star', text: '学员满意度98%' }
        ],
        rating: { score: 4.9, count: 128 },
        pricing: { single: '¥200', package10: '¥1800', package20: '¥3400' }
    },
    'li': {
        name: '李美丽',
        title: '瑜伽&普拉提导师',
        image: 'images/trainer-1.jpg',
        badge: '⭐ 明星教练',
        credentials: ['RYT500认证', '普拉提认证', '10年经验'],
        specialties: ['哈他瑜伽', '普拉提', '冥想指导'],
        description: '国际瑜伽联盟RYT500认证导师，印度瑞诗凯诗瑜伽学院进修。擅长哈他瑜伽、阿斯汤加瑜伽和普拉提训练。注重身心平衡，帮助学员在练习中找到内心的宁静与力量。',
        experience: [
            '国际瑜伽联盟RYT500认证导师',
            '印度瑞诗凯诗瑜伽学院进修经历',
            '普拉提国际认证导师',
            '10年瑜伽教学经验',
            '帮助300+学员改善身心健康'
        ],
        achievements: [
            { icon: 'fas fa-medal', text: '瑜伽大赛金奖' },
            { icon: 'fas fa-heart', text: '300+忠实学员' },
            { icon: 'fas fa-spa', text: '身心平衡专家' },
            { icon: 'fas fa-lotus', text: '冥想指导师' }
        ],
        rating: { score: 5.0, count: 89 },
        pricing: { single: '¥180', package10: '¥1600', package20: '¥3000' }
    },
    'wang': {
        name: '王健',
        title: '有氧训练专家',
        image: 'images/trainer-2.jpg',
        badge: '',
        credentials: ['NASM认证', 'HIIT认证', '6年经验'],
        specialties: ['有氧燃脂', 'HIIT训练', '体重管理'],
        description: '专业有氧训练指导师，擅长高强度间歇训练(HIIT)和有氧燃脂课程。曾帮助200+学员成功减脂塑形，平均减重15-30斤。课程氛围活跃，深受学员喜爱。',
        experience: [
            'NASM国际认证私人教练',
            'HIIT高强度间歇训练专家认证',
            '6年有氧训练指导经验',
            '成功指导200+学员减脂塑形',
            '擅长制定个性化减脂方案'
        ],
        achievements: [
            { icon: 'fas fa-fire', text: '燃脂训练专家' },
            { icon: 'fas fa-chart-line', text: '200+减脂成功案例' },
            { icon: 'fas fa-heartbeat', text: 'HIIT训练认证' },
            { icon: 'fas fa-trophy', text: '最受欢迎教练' }
        ],
        rating: { score: 4.8, count: 76 },
        pricing: { single: '¥160', package10: '¥1400', package20: '¥2600' }
    },
    'chen': {
        name: '陈雪',
        title: '女性塑形专家',
        image: 'images/trainer-1.jpg',
        badge: '',
        credentials: ['ACE认证', '产后康复', '7年经验'],
        specialties: ['女性塑形', '产后恢复', '核心训练'],
        description: '专注女性健身领域，擅长女性塑形和产后康复训练。深谙女性生理特点，制定科学有效的训练方案。已帮助300+女性学员重塑完美身材，重拾自信。',
        experience: [
            'ACE美国运动委员会认证',
            '产后康复训练专业认证',
            '7年女性健身指导经验',
            '帮助300+女性学员塑形成功',
            '专业核心训练课程设计师'
        ],
        achievements: [
            { icon: 'fas fa-venus', text: '女性健身专家' },
            { icon: 'fas fa-baby', text: '产后康复认证' },
            { icon: 'fas fa-heart', text: '300+成功案例' },
            { icon: 'fas fa-female', text: '女性塑形专家' }
        ],
        rating: { score: 4.9, count: 95 },
        pricing: { single: '¥190', package10: '¥1700', package20: '¥3200' }
    }
};

// 移动端导航菜单切换
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', function() {
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

    // 教练详情按钮事件监听
    initTrainerDetailButtons();
});

// 初始化教练详情按钮
function initTrainerDetailButtons() {
    const detailButtons = document.querySelectorAll('.trainer-actions .btn-secondary');
    detailButtons.forEach((button, index) => {
        const trainerKeys = ['zhang', 'li', 'wang', 'chen'];
        button.addEventListener('click', () => {
            showTrainerDetail(trainerKeys[index]);
        });
    });
}

// 显示教练详情模态框
function showTrainerDetail(trainerId) {
    const trainer = trainersData[trainerId];
    if (!trainer) return;

    const modal = document.getElementById('trainer-modal');
    
    // 填充基本信息
    document.getElementById('modal-trainer-name').textContent = trainer.name;
    document.getElementById('modal-trainer-title').textContent = trainer.title;
    document.getElementById('modal-trainer-img').src = trainer.image;
    document.getElementById('modal-trainer-desc').textContent = trainer.description;
    
    // 填充徽章
    const badgeElement = document.getElementById('modal-trainer-badge');
    if (trainer.badge) {
        badgeElement.textContent = trainer.badge;
        badgeElement.style.display = 'inline-block';
    } else {
        badgeElement.style.display = 'none';
    }
    
    // 填充认证信息
    const credentialsContainer = document.getElementById('modal-trainer-credentials');
    credentialsContainer.innerHTML = trainer.credentials.map(cred => 
        `<span class="credential">${cred}</span>`
    ).join('');
    
    // 填充专长
    const specialtiesContainer = document.getElementById('modal-trainer-specialties');
    specialtiesContainer.innerHTML = trainer.specialties.map(specialty => 
        `<span class="specialty">${specialty}</span>`
    ).join('');
    
    // 填充经历
    const experienceContainer = document.getElementById('modal-trainer-experience');
    experienceContainer.innerHTML = trainer.experience.map(exp => 
        `<li>${exp}</li>`
    ).join('');
    
    // 填充成就
    const achievementsContainer = document.getElementById('modal-trainer-achievements');
    achievementsContainer.innerHTML = trainer.achievements.map(achievement => 
        `<div class="achievement-item">
            <i class="${achievement.icon}"></i>
            <span>${achievement.text}</span>
        </div>`
    ).join('');
    
    // 填充评分
    document.getElementById('modal-rating-score').textContent = trainer.rating.score;
    document.getElementById('modal-rating-count').textContent = `(${trainer.rating.count}条评价)`;
    
    // 填充星级评分
    const starsContainer = document.getElementById('modal-rating-stars');
    const fullStars = Math.floor(trainer.rating.score);
    const hasHalfStar = trainer.rating.score % 1 !== 0;
    let starsHTML = '';
    
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star"></i>';
    }
    if (hasHalfStar) {
        starsHTML += '<i class="fas fa-star-half-alt"></i>';
    }
    for (let i = fullStars + (hasHalfStar ? 1 : 0); i < 5; i++) {
        starsHTML += '<i class="far fa-star"></i>';
    }
    starsContainer.innerHTML = starsHTML;
    
    // 填充价格
    document.getElementById('modal-single-price').textContent = `${trainer.pricing.single}/课时`;
    document.getElementById('modal-package-price').textContent = trainer.pricing.package10;
    document.getElementById('modal-large-package-price').textContent = trainer.pricing.package20;
    
    // 显示模态框
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// 关闭模态框
function closeTrainerModal() {
    const modal = document.getElementById('trainer-modal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// 模态框事件监听
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('trainer-modal');
    const closeBtn = modal.querySelector('.close');
    
    // 关闭按钮
    closeBtn.addEventListener('click', closeTrainerModal);
    
    // 点击模态框外部关闭
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeTrainerModal();
        }
    });
    
    // 预约试课按钮
    document.getElementById('modal-book-trial').addEventListener('click', function() {
        alert('预约试课功能开发中，请联系客服：400-123-4567');
        closeTrainerModal();
    });
    
    // 联系教练按钮
    document.getElementById('modal-contact').addEventListener('click', function() {
        alert('联系教练功能开发中，请联系客服：400-123-4567');
        closeTrainerModal();
    });
});

// 导航栏滚动效果
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }
});

// BMI计算器功能
function calculateBMI() {
    const height = parseFloat(document.getElementById('height').value);
    const weight = parseFloat(document.getElementById('weight').value);
    
    if (!height || !weight || height <= 0 || weight <= 0) {
        alert('请输入有效的身高和体重数值！');
        return;
    }
    
    // 计算BMI
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    
    // 确定BMI状态
    let status = '';
    let statusClass = '';
    
    if (bmi < 18.5) {
        status = '偏瘦';
        statusClass = 'underweight';
    } else if (bmi >= 18.5 && bmi < 25) {
        status = '正常';
        statusClass = 'normal';
    } else if (bmi >= 25 && bmi < 30) {
        status = '超重';
        statusClass = 'overweight';
    } else {
        status = '肥胖';
        statusClass = 'obese';
    }
    
    // 显示结果
    const resultDiv = document.getElementById('bmi-result');
    resultDiv.innerHTML = `
        <div class="bmi-value">${bmi.toFixed(1)}</div>
        <div class="bmi-status ${statusClass}">${status}</div>
    `;
    
    // 高亮对应的BMI范围
    document.querySelectorAll('.scale-item').forEach(item => {
        item.classList.remove('active');
    });
    
    const activeScale = document.querySelector(`.scale-item.${statusClass}`);
    if (activeScale) {
        activeScale.classList.add('active');
        activeScale.style.background = 'rgba(255, 107, 107, 0.2)';
        activeScale.style.transform = 'scale(1.05)';
        
        // 2秒后恢复原样
        setTimeout(() => {
            activeScale.style.background = 'rgba(255, 255, 255, 0.1)';
            activeScale.style.transform = 'scale(1)';
        }, 2000);
    }
    
    // 添加建议
    let advice = '';
    switch(statusClass) {
        case 'underweight':
            advice = '建议增加营养摄入，进行适量的力量训练来增加肌肉量。';
            break;
        case 'normal':
            advice = '恭喜！您的体重在健康范围内，继续保持良好的生活习惯。';
            break;
        case 'overweight':
            advice = '建议控制饮食，增加有氧运动，逐步减重至健康范围。';
            break;
        case 'obese':
            advice = '建议咨询专业医生，制定科学的减重计划，结合饮食控制和运动。';
            break;
    }
    
    // 显示建议（如果不存在advice元素则创建）
    let adviceElement = document.querySelector('.bmi-advice');
    if (!adviceElement) {
        adviceElement = document.createElement('div');
        adviceElement.className = 'bmi-advice';
        adviceElement.style.cssText = `
            margin-top: 1rem;
            padding: 1rem;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            font-size: 0.9rem;
            line-height: 1.5;
        `;
        resultDiv.appendChild(adviceElement);
    }
    adviceElement.textContent = advice;
}

// 表单提交处理
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('.contact-form form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 获取表单数据
            const formData = new FormData(this);
            const name = this.querySelector('input[type="text"]').value;
            const phone = this.querySelector('input[type="tel"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const course = this.querySelector('select').value;
            const message = this.querySelector('textarea').value;
            
            // 简单验证
            if (!name || !phone || !email || !course) {
                alert('请填写所有必填字段！');
                return;
            }
            
            // 模拟提交成功
            alert(`感谢 ${name} 的预约！我们会尽快联系您安排试课。`);
            
            // 清空表单
            this.reset();
        });
    }
});

// 平滑滚动到指定部分
function smoothScrollTo(targetId) {
    const target = document.querySelector(targetId);
    if (target) {
        const offsetTop = target.offsetTop - 80; // 考虑导航栏高度
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// 为所有内部链接添加平滑滚动
document.addEventListener('DOMContentLoaded', function() {
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            smoothScrollTo(targetId);
        });
    });
});

// 滚动动画效果
function animateOnScroll() {
    const elements = document.querySelectorAll('.feature, .program-card, .contact-item');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('fade-in-up');
        }
    });
}

window.addEventListener('scroll', animateOnScroll);

// 数字动画效果
function animateNumbers() {
    const numbers = document.querySelectorAll('.program-price');
    
    numbers.forEach(number => {
        const finalNumber = parseInt(number.textContent.replace(/[^\d]/g, ''));
        let currentNumber = 0;
        const increment = finalNumber / 50;
        
        const timer = setInterval(() => {
            currentNumber += increment;
            if (currentNumber >= finalNumber) {
                currentNumber = finalNumber;
                clearInterval(timer);
            }
            number.textContent = `¥${Math.floor(currentNumber)}/月`;
        }, 30);
    });
}

// 页面加载完成后执行动画
window.addEventListener('load', function() {
    // 延迟执行数字动画
    setTimeout(animateNumbers, 1000);
    
    // 初始检查滚动动画
    animateOnScroll();
});

// 添加键盘支持
document.addEventListener('keydown', function(e) {
    // ESC键关闭移动端菜单
    if (e.key === 'Escape') {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }
    
    // Enter键触发BMI计算
    if (e.key === 'Enter' && (e.target.id === 'height' || e.target.id === 'weight')) {
        calculateBMI();
    }
});

// 添加加载动画
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease-in-out';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// 添加鼠标悬停效果
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.program-card, .feature, .contact-item');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            if (this.classList.contains('featured')) {
                this.style.transform = 'scale(1.05)';
            } else {
                this.style.transform = 'translateY(0) scale(1)';
            }
        });
    });
});

// 添加点击反馈效果
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // 创建波纹效果
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // 添加CSS动画
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
});

// 互动社区功能
document.addEventListener('DOMContentLoaded', function() {
    // 社区标签切换
    const communityTabs = document.querySelectorAll('.community-tab');
    const communityContents = document.querySelectorAll('.community-content');
    
    communityTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // 移除所有活动状态
            communityTabs.forEach(t => t.classList.remove('active'));
            communityContents.forEach(c => c.classList.remove('active'));
            
            // 添加活动状态
            this.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
    
    // 健身挑战功能
    const challengeJoinButtons = document.querySelectorAll('.challenge-join');
    challengeJoinButtons.forEach(button => {
        button.addEventListener('click', function() {
            const challengeCard = this.closest('.challenge-card');
            const challengeName = challengeCard.querySelector('h4').textContent;
            
            if (this.textContent === '加入挑战') {
                this.textContent = '继续挑战';
                this.classList.remove('btn-secondary');
                this.classList.add('btn-primary');
                
                // 更新进度条
                const progressFill = challengeCard.querySelector('.progress-fill');
                const progressText = challengeCard.querySelector('.challenge-progress span');
                progressFill.style.width = '5%';
                progressText.textContent = '1/21 天';
                
                // 更新参与人数
                const participantsSpan = challengeCard.querySelector('.challenge-participants span');
                const currentCount = parseInt(participantsSpan.textContent.match(/\d+/)[0]);
                participantsSpan.innerHTML = `<i class="fas fa-users"></i> ${currentCount + 1}人参与`;
                
                alert(`恭喜您成功加入"${challengeName}"！坚持就是胜利！`);
            } else {
                alert(`继续加油！您在"${challengeName}"中的表现很棒！`);
            }
        });
    });
    
    // 星级评分功能
    const starRatings = document.querySelectorAll('.star-rating');
    starRatings.forEach(rating => {
        const stars = rating.querySelectorAll('i');
        let selectedRating = 0;
        
        stars.forEach((star, index) => {
            star.addEventListener('mouseenter', function() {
                highlightStars(stars, index + 1);
            });
            
            star.addEventListener('mouseleave', function() {
                highlightStars(stars, selectedRating);
            });
            
            star.addEventListener('click', function() {
                selectedRating = index + 1;
                highlightStars(stars, selectedRating);
                rating.setAttribute('data-rating', selectedRating);
            });
        });
    });
    
    function highlightStars(stars, count) {
        stars.forEach((star, index) => {
            if (index < count) {
                star.classList.remove('far');
                star.classList.add('fas', 'active');
            } else {
                star.classList.remove('fas', 'active');
                star.classList.add('far');
            }
        });
    }
    
    // 评价表单提交
    const reviewForm = document.querySelector('.review-form');
    if (reviewForm) {
        reviewForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const target = document.getElementById('review-target').value;
            const rating = document.querySelector('.star-rating').getAttribute('data-rating');
            const content = document.getElementById('review-content').value;
            
            if (!target || !rating || !content) {
                alert('请填写完整的评价信息！');
                return;
            }
            
            // 创建新的评价项
            const newReview = createReviewItem(target, rating, content);
            const reviewsList = document.querySelector('.reviews-list');
            reviewsList.insertBefore(newReview, reviewsList.firstChild);
            
            // 重置表单
            this.reset();
            const stars = document.querySelectorAll('.star-rating i');
            stars.forEach(star => {
                star.classList.remove('fas', 'active');
                star.classList.add('far');
            });
            document.querySelector('.star-rating').removeAttribute('data-rating');
            
            alert('感谢您的评价！您的反馈对我们很重要。');
        });
    }
    
    function createReviewItem(target, rating, content) {
        const reviewItem = document.createElement('div');
        reviewItem.className = 'review-item';
        
        const targetNames = {
            'strength': '力量训练',
            'cardio': '有氧训练',
            'yoga': '瑜伽课程',
            'coach-zhang': '张教练',
            'coach-li': '李教练'
        };
        
        const starsHtml = Array.from({length: 5}, (_, i) => 
            i < rating ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>'
        ).join('');
        
        const currentDate = new Date().toLocaleDateString('zh-CN');
        
        reviewItem.innerHTML = `
            <div class="review-header">
                <div class="reviewer-info">
                    <div class="reviewer-avatar">
                        <i class="fas fa-user"></i>
                    </div>
                    <div class="reviewer-details">
                        <h5>匿名用户</h5>
                        <div class="review-stars">
                            ${starsHtml}
                        </div>
                    </div>
                </div>
                <div class="review-date">${currentDate}</div>
            </div>
            <div class="review-content">
                <div class="review-target">${targetNames[target] || target}</div>
                <p>${content}</p>
            </div>
            <div class="review-actions">
                <button class="review-like"><i class="far fa-thumbs-up"></i> 有用 (0)</button>
                <button class="review-reply">回复</button>
            </div>
        `;
        
        return reviewItem;
    }
    
    // 评价点赞功能
    document.addEventListener('click', function(e) {
        if (e.target.closest('.review-like')) {
            const button = e.target.closest('.review-like');
            const icon = button.querySelector('i');
            const text = button.textContent;
            const currentLikes = parseInt(text.match(/\d+/)[0]);
            
            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                button.innerHTML = `<i class="fas fa-thumbs-up"></i> 有用 (${currentLikes + 1})`;
                button.style.color = '#ffd700';
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                button.innerHTML = `<i class="far fa-thumbs-up"></i> 有用 (${currentLikes - 1})`;
                button.style.color = '';
            }
        }
    });
    
    // 论坛功能
    const newPostBtn = document.getElementById('new-post-btn');
    const newPostForm = document.getElementById('new-post-form');
    const cancelPostBtn = document.getElementById('cancel-post');
    
    if (newPostBtn) {
        newPostBtn.addEventListener('click', function() {
            newPostForm.style.display = 'block';
            newPostForm.scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    if (cancelPostBtn) {
        cancelPostBtn.addEventListener('click', function() {
            newPostForm.style.display = 'none';
            newPostForm.querySelector('form').reset();
        });
    }
    
    // 论坛表单提交
    const forumForm = document.querySelector('.new-post-form form');
    if (forumForm) {
        forumForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const category = this.querySelector('select').value;
            const title = this.querySelector('input[type="text"]').value;
            const content = this.querySelector('textarea').value;
            
            if (!category || !title || !content) {
                alert('请填写完整的话题信息！');
                return;
            }
            
            // 创建新的论坛帖子
            const newPost = createForumPost(category, title, content);
            const forumPosts = document.querySelector('.forum-posts');
            forumPosts.insertBefore(newPost, forumPosts.firstChild);
            
            // 隐藏表单并重置
            newPostForm.style.display = 'none';
            this.reset();
            
            alert('话题发布成功！感谢您的分享。');
        });
    }
    
    function createForumPost(category, title, content) {
        const postElement = document.createElement('div');
        postElement.className = 'forum-post';
        postElement.setAttribute('data-category', category);
        
        const categoryNames = {
            'training': '训练技巧',
            'nutrition': '营养饮食',
            'equipment': '器械使用',
            'motivation': '健身心得',
            'question': '新手问答'
        };
        
        postElement.innerHTML = `
            <div class="post-header">
                <div class="post-category ${category}">${categoryNames[category]}</div>
                <h4>${title}</h4>
                <div class="post-meta">
                    <span class="post-author"><i class="fas fa-user"></i> 匿名用户</span>
                    <span class="post-time"><i class="fas fa-clock"></i> 刚刚</span>
                </div>
            </div>
            <div class="post-content">
                <p>${content}</p>
            </div>
            <div class="post-stats">
                <span><i class="fas fa-eye"></i> 1 浏览</span>
                <span><i class="fas fa-comment"></i> 0 回复</span>
                <span><i class="fas fa-thumbs-up"></i> 0 点赞</span>
            </div>
            <div class="post-actions">
                <button class="post-like"><i class="far fa-thumbs-up"></i> 点赞</button>
                <button class="post-comment"><i class="far fa-comment"></i> 回复</button>
                <button class="post-share"><i class="fas fa-share"></i> 分享</button>
            </div>
        `;
        
        return postElement;
    }
    
    // 论坛筛选功能
    const filterBtns = document.querySelectorAll('.filter-btn');
    const forumPosts = document.querySelectorAll('.forum-post');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // 更新按钮状态
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // 筛选帖子
            forumPosts.forEach(post => {
                if (filter === 'all' || post.getAttribute('data-category') === filter) {
                    post.style.display = 'block';
                } else {
                    post.style.display = 'none';
                }
            });
        });
    });
    
    // 论坛帖子交互
    document.addEventListener('click', function(e) {
        if (e.target.closest('.post-like')) {
            const button = e.target.closest('.post-like');
            const icon = button.querySelector('i');
            const statsSpan = button.closest('.forum-post').querySelector('.post-stats span:last-child');
            const currentLikes = parseInt(statsSpan.textContent.match(/\d+/)[0]);
            
            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                button.style.background = 'rgba(255, 107, 107, 0.2)';
                button.style.borderColor = '#ff6b6b';
                statsSpan.innerHTML = `<i class="fas fa-thumbs-up"></i> ${currentLikes + 1} 点赞`;
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                button.style.background = '';
                button.style.borderColor = '';
                statsSpan.innerHTML = `<i class="fas fa-thumbs-up"></i> ${currentLikes - 1} 点赞`;
            }
        }
        
        if (e.target.closest('.post-comment')) {
            alert('回复功能开发中，敬请期待！');
        }
        
        if (e.target.closest('.post-share')) {
            alert('分享功能开发中，敬请期待！');
        }
    });
    
    // 挑战进度动画
    function animateChallengeProgress() {
        const progressBars = document.querySelectorAll('.progress-fill');
        progressBars.forEach(bar => {
            const targetWidth = bar.style.width;
            bar.style.width = '0%';
            
            setTimeout(() => {
                bar.style.width = targetWidth;
            }, 500);
        });
    }
    
    // 页面加载时执行进度动画
    setTimeout(animateChallengeProgress, 1000);
    
    // Edge浏览器图片加载修复
    function fixEdgeImageLoading() {
        const heroImages = document.querySelectorAll('.hero-img');
        heroImages.forEach((img, index) => {
            // 强制设置图片属性
            img.style.display = 'block';
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
    
    // 在DOM完全加载后修复图片
    fixEdgeImageLoading();
    
    // 初始化新功能
    setTimeout(() => {
        initHeroSlider();
        initCountdownTimer();
    }, 200);
});

// 主页图片轮播
function initHeroSlider() {
    const images = document.querySelectorAll('.hero-img');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    
    console.log('轮播图初始化:', images.length, '张图片,', dots.length, '个圆点');
    
    if (images.length === 0 || dots.length === 0) {
        console.error('轮播图元素未找到');
        return;
    }
    
    function showSlide(index) {
        console.log('切换到图片:', index + 1);
        
        // 隐藏所有图片
        images.forEach((img, i) => {
            img.classList.remove('active');
            img.style.opacity = '0';
            img.style.zIndex = '1';
        });
        
        dots.forEach(dot => dot.classList.remove('active'));
        
        // 显示当前图片
        images[index].classList.add('active');
        images[index].style.opacity = '1';
        images[index].style.zIndex = '2';
        dots[index].classList.add('active');
        
        // Edge浏览器兼容性修复
        const currentImg = images[index];
        
        // 预加载图片确保在Edge中正常显示
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
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % images.length;
        showSlide(currentSlide);
    }
    
    // 点击圆点切换图片
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            console.log('点击圆点:', index + 1);
            currentSlide = index;
            showSlide(currentSlide);
        });
    });
    
    // Edge浏览器预加载所有图片
    function preloadImages() {
        images.forEach((img, index) => {
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
    
    // 预加载图片后初始化
    preloadImages();
    
    // 延迟初始化确保图片加载完成
    setTimeout(() => {
        showSlide(0);
    }, 100);
    
    // 自动轮播
    const autoPlayInterval = setInterval(nextSlide, 4000);
    console.log('轮播图自动播放已启动，间隔4秒');
    
    // 添加键盘控制
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            currentSlide = (currentSlide - 1 + images.length) % images.length;
            showSlide(currentSlide);
        } else if (e.key === 'ArrowRight') {
            currentSlide = (currentSlide + 1) % images.length;
            showSlide(currentSlide);
        }
    });
}

// 倒计时功能
function initCountdownTimer() {
    const daysElement = document.getElementById('days');
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    
    if (!daysElement || !hoursElement || !minutesElement) return;
    
    function updateCountdown() {
        // 设置结束时间（15天后）
        const endTime = new Date();
        endTime.setDate(endTime.getDate() + 15);
        
        const now = new Date();
        const timeLeft = endTime - now;
        
        if (timeLeft > 0) {
            const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            
            daysElement.textContent = days.toString().padStart(2, '0');
            hoursElement.textContent = hours.toString().padStart(2, '0');
            minutesElement.textContent = minutes.toString().padStart(2, '0');
        }
    }
    
    // 每分钟更新一次
    updateCountdown();
    setInterval(updateCountdown, 60000);
}