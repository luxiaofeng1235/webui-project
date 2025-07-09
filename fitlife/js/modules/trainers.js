/**
 * 教练管理模块
 * 负责教练数据管理和教练详情展示功能
 */

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

class TrainerManager {
    constructor() {
        this.trainersData = trainersData;
        this.init();
    }

    init() {
        this.initTrainerDetailButtons();
        this.initModalEvents();
    }

    // 初始化教练详情按钮
    initTrainerDetailButtons() {
        const detailButtons = document.querySelectorAll('.trainer-actions .btn-secondary');
        detailButtons.forEach((button, index) => {
            const trainerKeys = ['zhang', 'li', 'wang', 'chen'];
            button.addEventListener('click', () => {
                this.showTrainerDetail(trainerKeys[index]);
            });
        });
    }

    // 显示教练详情模态框
    showTrainerDetail(trainerId) {
        const trainer = this.trainersData[trainerId];
        if (!trainer) return;

        const modal = document.getElementById('trainer-modal');
        
        // 填充基本信息
        const nameElement = document.getElementById('modal-trainer-name');
        const titleElement = document.getElementById('modal-trainer-title');
        const imgElement = document.getElementById('modal-trainer-img');
        const descElement = document.getElementById('modal-trainer-desc');
        
        if (nameElement) nameElement.textContent = trainer.name;
        if (titleElement) titleElement.textContent = trainer.title;
        if (imgElement) {
            // 简单的图片加载错误处理
            imgElement.onerror = function() {
                console.warn(`教练图片加载失败: ${trainer.image}`);
                // 使用备用图片
                this.src = 'images/pexels-photo-1552242.webp';
                this.onerror = function() {
                    // 最终备用：显示默认图标
                    this.style.display = 'none';
                    console.error('备用图片也加载失败');
                    this.onerror = null;
                };
            };

            imgElement.onload = function() {
                console.log(`教练图片加载成功: ${trainer.image}`);
            };

            imgElement.src = trainer.image;
        }
        if (descElement) descElement.textContent = trainer.description;
        
        // 填充徽章
        const badgeElement = document.getElementById('modal-trainer-badge');
        if (badgeElement) {
            if (trainer.badge) {
                badgeElement.textContent = trainer.badge;
                badgeElement.style.display = 'inline-block';
            } else {
                badgeElement.style.display = 'none';
            }
        }
        
        // 填充认证信息
        const credentialsContainer = document.getElementById('modal-trainer-credentials');
        if (credentialsContainer && trainer.credentials) {
            credentialsContainer.innerHTML = trainer.credentials.map(cred => 
                `<span class="credential">${cred}</span>`
            ).join('');
        }
        
        // 填充专业领域
        const specialtiesContainer = document.getElementById('modal-trainer-specialties');
        if (specialtiesContainer && trainer.specialties) {
            specialtiesContainer.innerHTML = trainer.specialties.map(specialty => 
                `<span class="specialty">${specialty}</span>`
            ).join('');
        }
        
        // 填充经历
        const experienceContainer = document.getElementById('modal-trainer-experience');
        if (experienceContainer && trainer.experience) {
            experienceContainer.innerHTML = trainer.experience.map(exp => 
                `<li>${exp}</li>`
            ).join('');
        }
        
        // 填充成就
        const achievementsContainer = document.getElementById('modal-trainer-achievements');
        if (achievementsContainer && trainer.achievements) {
            achievementsContainer.innerHTML = trainer.achievements.map(achievement => 
                `<div class="achievement-item">
                    <i class="${achievement.icon}"></i>
                    <span>${achievement.text}</span>
                </div>`
            ).join('');
        }
        
        // 填充评分
        const ratingScoreElement = document.getElementById('modal-rating-score');
        if (ratingScoreElement && trainer.rating) {
            ratingScoreElement.textContent = trainer.rating.score;
        }
        
        const ratingCountElement = document.getElementById('modal-rating-count');
        if (ratingCountElement && trainer.rating) {
            ratingCountElement.textContent = `(${trainer.rating.count}条评价)`;
        }
        
        // 填充星级评分
        if (trainer.rating) {
            this.renderStarRating(trainer.rating.score);
        }
        
        // 填充价格
        const singlePriceElement = document.getElementById('modal-single-price');
        const packagePriceElement = document.getElementById('modal-package-price');
        const largePriceElement = document.getElementById('modal-large-package-price');
        
        if (singlePriceElement && trainer.pricing) {
            singlePriceElement.textContent = `${trainer.pricing.single}/课时`;
        }
        if (packagePriceElement && trainer.pricing) {
            packagePriceElement.textContent = trainer.pricing.package10;
        }
        if (largePriceElement && trainer.pricing) {
            largePriceElement.textContent = trainer.pricing.package20;
        }
        
        // 显示模态框
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }

    // 渲染星级评分
    renderStarRating(score) {
        const starsContainer = document.getElementById('modal-rating-stars');
        const fullStars = Math.floor(score);
        const hasHalfStar = score % 1 !== 0;
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
    }

    // 关闭模态框
    closeTrainerModal() {
        const modal = document.getElementById('trainer-modal');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // 初始化模态框事件
    initModalEvents() {
        const modal = document.getElementById('trainer-modal');
        if (!modal) return;

        const closeBtn = modal.querySelector('.close');
        
        // 关闭按钮
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeTrainerModal());
        }
        
        // 点击模态框外部关闭
        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                this.closeTrainerModal();
            }
        });
        
        // 预约试课按钮
        const bookTrialBtn = document.getElementById('modal-book-trial');
        if (bookTrialBtn) {
            bookTrialBtn.addEventListener('click', () => {
                alert('预约试课功能开发中，请联系客服：400-123-4567');
                this.closeTrainerModal();
            });
        }
        
        // 联系教练按钮
        const contactBtn = document.getElementById('modal-contact');
        if (contactBtn) {
            contactBtn.addEventListener('click', () => {
                alert('联系教练功能开发中，请联系客服：400-123-4567');
                this.closeTrainerModal();
            });
        }
    }

    // 获取教练数据
    getTrainerData(trainerId) {
        return this.trainersData[trainerId];
    }

    // 获取所有教练数据
    getAllTrainers() {
        return this.trainersData;
    }
}

// 导出模块
window.TrainerManager = TrainerManager;

// 全局函数兼容性
window.showTrainerDetail = function(trainerId) {
    if (window.trainerManager) {
        window.trainerManager.showTrainerDetail(trainerId);
    }
};

window.closeTrainerModal = function() {
    if (window.trainerManager) {
        window.trainerManager.closeTrainerModal();
    }
};