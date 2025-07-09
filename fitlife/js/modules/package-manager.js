/**
 * 套餐管理模块
 * 负责套餐报名、管理等功能
 */

class PackageManager {
    constructor() {
        this.init();
    }

    init() {
        // 初始化时不需要特别的设置
    }

    // 套餐报名功能
    enrollPackage(packageId, packageName, packagePrice) {
        // 检查用户是否已登录
        if (!window.authCore || !window.authCore.currentUser) {
            if (window.utilsManager) {
                window.utilsManager.showToast('请先登录后再报名套餐', 'error');
            }
            setTimeout(() => {
                if (window.modalManager) {
                    window.modalManager.openLoginModal();
                }
            }, 1000);
            return;
        }
        
        // 检查用户是否已经报名了套餐
        if (window.authCore.currentUser.enrolledPackage) {
            if (window.utilsManager) {
                window.utilsManager.showToast(`您已报名了${window.authCore.currentUser.enrolledPackage.name}，如需更换请联系客服`, 'warning');
            }
            return;
        }
        
        // 确认报名
        if (confirm(`确认报名 ${packageName} (${packagePrice}) 吗？`)) {
            // 模拟报名处理
            setTimeout(() => {
                // 更新用户信息
                window.authCore.currentUser.enrolledPackage = {
                    id: packageId,
                    name: packageName,
                    price: packagePrice,
                    enrollDate: new Date().toISOString(),
                    status: 'active'
                };
                
                // 更新存储的用户信息
                const userDataToSave = {
                    ...window.authCore.currentUser,
                    lastUpdated: new Date().toISOString()
                };
                
                if (localStorage.getItem('fitlife_user')) {
                    localStorage.setItem('fitlife_user', JSON.stringify(userDataToSave));
                } else {
                    sessionStorage.setItem('fitlife_user', JSON.stringify(userDataToSave));
                }
                
                // 显示成功消息
                if (window.utilsManager) {
                    window.utilsManager.showToast(`🎉 恭喜您！成功报名 ${packageName}`, 'success');
                }
                
                // 更新个人中心显示
                this.updateProfilePackageDisplay();
                
            }, 500);
        }
    }

    // 更新个人中心的套餐显示
    updateProfilePackageDisplay() {
        const packageDisplay = document.getElementById('profileEnrolledPackage');
        if (!packageDisplay) return;

        if (window.authCore && window.authCore.currentUser) {
            if (window.authCore.currentUser.enrolledPackage) {
                const enrollDate = new Date(window.authCore.currentUser.enrolledPackage.enrollDate);
                const formattedDate = enrollDate.toLocaleDateString('zh-CN');
                packageDisplay.innerHTML = `
                    <div style="color: #28a745; font-weight: 600;">
                        ${window.authCore.currentUser.enrolledPackage.name}
                    </div>
                    <div style="font-size: 12px; color: #666; margin-top: 4px;">
                        价格: ${window.authCore.currentUser.enrolledPackage.price} | 报名时间: ${formattedDate}
                    </div>
                `;
            } else {
                packageDisplay.textContent = '暂无报名套餐';
            }
        }
    }

    // 显示我的计划
    showMyPlans() {
        if (!window.authCore || !window.authCore.currentUser) {
            if (window.utilsManager) {
                window.utilsManager.showToast('请先登录', 'error');
            }
            return;
        }
        
        if (window.authCore.currentUser.enrolledPackage) {
            if (window.utilsManager) {
                window.utilsManager.showToast(`您已报名：${window.authCore.currentUser.enrolledPackage.name}`, 'info');
            }
        } else {
            if (window.utilsManager) {
                window.utilsManager.showToast('您还没有报名任何套餐', 'info');
            }
        }
    }

    // 取消套餐报名
    cancelEnrollment() {
        if (!window.authCore || !window.authCore.currentUser) {
            if (window.utilsManager) {
                window.utilsManager.showToast('请先登录', 'error');
            }
            return;
        }

        if (!window.authCore.currentUser.enrolledPackage) {
            if (window.utilsManager) {
                window.utilsManager.showToast('您还没有报名任何套餐', 'info');
            }
            return;
        }

        const packageName = window.authCore.currentUser.enrolledPackage.name;
        
        if (confirm(`确认取消报名 ${packageName} 吗？`)) {
            // 模拟取消报名处理
            setTimeout(() => {
                // 清除用户套餐信息
                delete window.authCore.currentUser.enrolledPackage;
                
                // 更新存储的用户信息
                const userDataToSave = {
                    ...window.authCore.currentUser,
                    lastUpdated: new Date().toISOString()
                };
                
                if (localStorage.getItem('fitlife_user')) {
                    localStorage.setItem('fitlife_user', JSON.stringify(userDataToSave));
                } else {
                    sessionStorage.setItem('fitlife_user', JSON.stringify(userDataToSave));
                }
                
                // 显示成功消息
                if (window.utilsManager) {
                    window.utilsManager.showToast(`已取消报名 ${packageName}`, 'success');
                }
                
                // 更新个人中心显示
                this.updateProfilePackageDisplay();
                
            }, 500);
        }
    }

    // 获取用户已报名的套餐信息
    getUserEnrolledPackage() {
        if (window.authCore && window.authCore.currentUser) {
            return window.authCore.currentUser.enrolledPackage || null;
        }
        return null;
    }

    // 检查用户是否已报名指定套餐
    isUserEnrolledInPackage(packageId) {
        const enrolledPackage = this.getUserEnrolledPackage();
        return enrolledPackage && enrolledPackage.id === packageId;
    }

    // 获取套餐报名状态
    getEnrollmentStatus() {
        if (!window.authCore || !window.authCore.currentUser) {
            return 'not_logged_in';
        }

        if (window.authCore.currentUser.enrolledPackage) {
            return 'enrolled';
        }

        return 'not_enrolled';
    }

    // 更新套餐状态显示
    updatePackageStatusDisplay() {
        const status = this.getEnrollmentStatus();
        const enrolledPackage = this.getUserEnrolledPackage();

        // 更新所有套餐卡片的状态
        document.querySelectorAll('.package-card').forEach(card => {
            const packageId = card.dataset.packageId;
            const enrollBtn = card.querySelector('.enroll-btn');
            
            if (!enrollBtn) return;

            switch (status) {
                case 'not_logged_in':
                    enrollBtn.textContent = '立即报名';
                    enrollBtn.disabled = false;
                    enrollBtn.classList.remove('enrolled', 'disabled');
                    break;
                    
                case 'enrolled':
                    if (this.isUserEnrolledInPackage(packageId)) {
                        enrollBtn.textContent = '已报名';
                        enrollBtn.disabled = true;
                        enrollBtn.classList.add('enrolled');
                    } else {
                        enrollBtn.textContent = '已报名其他套餐';
                        enrollBtn.disabled = true;
                        enrollBtn.classList.add('disabled');
                    }
                    break;
                    
                case 'not_enrolled':
                    enrollBtn.textContent = '立即报名';
                    enrollBtn.disabled = false;
                    enrollBtn.classList.remove('enrolled', 'disabled');
                    break;
            }
        });
    }

    // 初始化套餐页面
    initPackagePage() {
        // 更新套餐状态显示
        this.updatePackageStatusDisplay();

        // 监听用户登录状态变化
        document.addEventListener('userStatusChanged', () => {
            this.updatePackageStatusDisplay();
        });
    }
}

// 导出模块
window.PackageManager = PackageManager;