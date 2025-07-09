/**
 * 模态框管理模块
 * 负责各种模态框的打开、关闭和管理
 */

class ModalManager {
    constructor() {
        this.init();
    }

    init() {
        // 初始化时不需要特别的设置
    }

    // 打开登录模态框
    openLoginModal() {
        const modal = document.getElementById('loginModal');
        if (modal) {
            modal.style.display = 'flex';
            modal.classList.add('show');
        }
    }

    // 打开注册模态框
    openRegisterModal() {
        const modal = document.getElementById('registerModal');
        if (modal) {
            modal.style.display = 'flex';
            modal.classList.add('show');
        }
    }

    // 打开忘记密码模态框
    openForgotPasswordModal() {
        this.closeAllModals();
        const modal = document.getElementById('forgotPasswordModal');
        if (modal) {
            modal.style.display = 'flex';
            modal.classList.add('show');
        }
    }

    // 打开个人资料模态框
    openProfileModal() {
        const modal = document.getElementById('profileModal');
        if (!modal) return;

        const nameDisplay = document.getElementById('profileDisplayName');
        const emailDisplay = document.getElementById('profileDisplayEmail');
        const lastLoginDisplay = document.getElementById('profileLastLogin');
        
        // 填充当前用户信息（只读显示）
        if (window.authCore && window.authCore.currentUser) {
            if (nameDisplay) nameDisplay.textContent = window.authCore.currentUser.name || '-';
            if (emailDisplay) emailDisplay.textContent = window.authCore.currentUser.email || '-';
            
            // 显示手机号
            const phoneDisplay = document.getElementById('profileDisplayPhone');
            if (phoneDisplay) {
                phoneDisplay.textContent = window.authCore.currentUser.phone || '-';
            }
            
            // 加载用户头像
            if (window.authCore.currentUser.avatar && window.avatarManager) {
                window.avatarManager.updateDisplay(window.authCore.currentUser.avatar);
            } else if (window.avatarManager) {
                window.avatarManager.updateDisplay(null);
            }
            
            // 格式化最后登录时间
            const loginTime = window.authCore.currentUser.loginTime;
            if (loginTime && lastLoginDisplay) {
                const date = new Date(loginTime);
                const formattedTime = date.toLocaleString('zh-CN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                });
                lastLoginDisplay.textContent = formattedTime;
            } else if (lastLoginDisplay) {
                lastLoginDisplay.textContent = '暂无记录';
            }
            
            // 更新套餐显示
            this.updateProfilePackageDisplay();
        }
        
        modal.style.display = 'flex';
        modal.classList.add('show');
    }

    // 打开设置模态框
    openSettingsModal() {
        const modal = document.getElementById('settingsModal');
        if (!modal) return;
        
        // 填充当前用户信息到表单
        if (window.authCore && window.authCore.currentUser) {
            const nameInput = document.getElementById('settingsName');
            const emailInput = document.getElementById('settingsEmail');
            const phoneInput = document.getElementById('settingsPhone');
            
            if (nameInput) nameInput.value = window.authCore.currentUser.name || '';
            if (emailInput) emailInput.value = window.authCore.currentUser.email || '';
            if (phoneInput) phoneInput.value = window.authCore.currentUser.phone || '';
            
            // 初始化时隐藏邮箱验证区域
            const emailVerificationSection = document.getElementById('emailVerificationSection');
            if (emailVerificationSection) {
                emailVerificationSection.style.display = 'none';
            }
            
            // 加载用户头像
            if (window.avatarManager) {
                window.avatarManager.loadUserAvatar();
            }
        }
        
        // 显示个人资料标签
        this.showSettingsTab('profile');
        
        modal.style.display = 'flex';
        modal.classList.add('show');
    }

    // 显示设置标签
    showSettingsTab(tabName) {
        // 隐藏所有标签内容
        document.querySelectorAll('.settings-tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        // 移除所有标签按钮的激活状态
        document.querySelectorAll('.tab-button').forEach(button => {
            button.classList.remove('active');
        });
        
        // 显示选中的标签内容
        const targetContent = document.getElementById(tabName + 'Settings');
        if (targetContent) {
            targetContent.classList.add('active');
        }
        
        // 激活对应的标签按钮
        const activeButton = document.querySelector(`[onclick="showSettingsTab('${tabName}')"]`);
        if (activeButton) {
            activeButton.classList.add('active');
        }
    }

    // 关闭模态框
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        }
    }

    // 关闭所有模态框
    closeAllModals() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        });
    }

    // 切换到注册模态框
    switchToRegister() {
        this.closeModal('loginModal');
        setTimeout(() => this.openRegisterModal(), 300);
    }

    // 切换到登录模态框
    switchToLogin() {
        this.closeAllModals();
        setTimeout(() => this.openLoginModal(), 300);
    }

    // 显示用户菜单
    showUserMenu() {
        const menu = document.getElementById('userMenu');
        if (menu) {
            menu.classList.toggle('show');
        }
    }

    // 密码显示/隐藏切换
    togglePassword(inputId) {
        const input = document.getElementById(inputId);
        if (!input) return;

        const button = input.nextElementSibling;
        if (!button) return;

        const icon = button.querySelector('i');
        if (!icon) return;

        if (input.type === 'password') {
            input.type = 'text';
            icon.className = 'fas fa-eye-slash';
        } else {
            input.type = 'password';
            icon.className = 'fas fa-eye';
        }
    }

    // 重置个人资料表单
    resetProfileForm() {
        if (window.authCore && window.authCore.currentUser) {
            const nameInput = document.getElementById('settingsName');
            const emailInput = document.getElementById('settingsEmail');
            const phoneInput = document.getElementById('settingsPhone');
            
            if (nameInput) nameInput.value = window.authCore.currentUser.name || '';
            if (emailInput) emailInput.value = window.authCore.currentUser.email || '';
            if (phoneInput) phoneInput.value = window.authCore.currentUser.phone || '';
        }
        
        // 隐藏邮箱验证部分
        const emailVerificationSection = document.getElementById('emailVerificationSection');
        const verificationCodeInput = document.getElementById('profileVerificationCode');
        
        if (emailVerificationSection) emailVerificationSection.style.display = 'none';
        if (verificationCodeInput) verificationCodeInput.value = '';
        
        // 重新检查邮箱变化状态
        this.checkEmailChange();
    }

    // 重置密码表单
    resetPasswordForm() {
        const currentPasswordInput = document.getElementById('currentPassword');
        const newPasswordInput = document.getElementById('newPasswordSettings');
        const confirmPasswordInput = document.getElementById('confirmNewPasswordSettings');
        
        if (currentPasswordInput) currentPasswordInput.value = '';
        if (newPasswordInput) newPasswordInput.value = '';
        if (confirmPasswordInput) confirmPasswordInput.value = '';
        
        // 重置密码强度指示器
        const strengthIndicator = document.getElementById('newPasswordStrength');
        if (strengthIndicator) {
            strengthIndicator.className = 'password-strength';
        }
    }

    // 检查邮箱是否发生变化
    checkEmailChange() {
        const emailInput = document.getElementById('settingsEmail');
        const emailVerificationSection = document.getElementById('emailVerificationSection');
        
        if (!emailInput || !emailVerificationSection) return;
        
        if (window.authCore && window.authCore.currentUser && emailInput.value !== window.authCore.currentUser.email) {
            // 邮箱发生变化，显示验证码区域
            emailVerificationSection.style.display = 'block';
        } else {
            // 邮箱未变化，隐藏验证码区域
            emailVerificationSection.style.display = 'none';
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

    // 发送重置密码验证码
    async sendResetCode(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const email = formData.get('email');

        if (!window.verificationManager.validateEmail(email)) {
            if (window.utilsManager) {
                window.utilsManager.showToast('请输入有效的邮箱地址', 'error');
            }
            return;
        }

        try {
            // 生成并发送验证码
            const code = window.verificationManager.generateVerificationCode();
            window.verificationManager.verificationCodes.set(email, {
                code: code,
                timestamp: Date.now(),
                attempts: 0
            });

            await window.verificationManager.simulateEmailSend(email, code);
            
            // 切换到第二步
            const step1 = document.getElementById('forgotStep1');
            const step2 = document.getElementById('forgotStep2');
            if (step1) step1.style.display = 'none';
            if (step2) step2.style.display = 'block';
            
            if (window.utilsManager) {
                window.utilsManager.showToast('验证码已发送到您的邮箱', 'success');
            }
        } catch (error) {
            if (window.utilsManager) {
                window.utilsManager.showToast('发送失败，请稍后重试', 'error');
            }
        }
    }

    // 重置密码
    async resetPassword(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const resetCode = formData.get('resetCode');
        const newPassword = formData.get('newPassword');
        const confirmNewPassword = formData.get('confirmNewPassword');
        const emailInput = document.getElementById('forgotEmail');
        const email = emailInput ? emailInput.value : '';

        if (newPassword.length < 8) {
            if (window.utilsManager) {
                window.utilsManager.showToast('密码长度至少8位', 'error');
            }
            return;
        }

        if (newPassword !== confirmNewPassword) {
            if (window.utilsManager) {
                window.utilsManager.showToast('两次输入的密码不一致', 'error');
            }
            return;
        }

        // 验证验证码
        const codeVerification = window.verificationManager.verifyCode(email, resetCode);
        if (!codeVerification.valid) {
            if (window.utilsManager) {
                window.utilsManager.showToast(codeVerification.message, 'error');
            }
            return;
        }

        try {
            // 模拟重置密码API调用
            const response = await this.simulatePasswordReset(email, newPassword);
            
            if (response.success) {
                window.verificationManager.verificationCodes.delete(email);
                this.closeModal('forgotPasswordModal');
                if (window.utilsManager) {
                    window.utilsManager.showToast('密码重置成功！请重新登录', 'success');
                }
                setTimeout(() => this.openLoginModal(), 1000);
            } else {
                if (window.utilsManager) {
                    window.utilsManager.showToast(response.message || '重置失败', 'error');
                }
            }
        } catch (error) {
            if (window.utilsManager) {
                window.utilsManager.showToast('网络错误，请稍后重试', 'error');
            }
        }
    }

    // 模拟密码重置API
    async simulatePasswordReset(email, newPassword) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    message: '密码重置成功'
                });
            }, 1000);
        });
    }

    // 重新发送重置验证码
    resendResetCode() {
        const emailInput = document.getElementById('forgotEmail');
        if (emailInput && emailInput.value && window.verificationManager) {
            window.verificationManager.sendVerificationCode();
        }
    }

    // 显示条款
    showTerms() {
        if (window.utilsManager) {
            window.utilsManager.showToast('用户协议功能开发中...', 'info');
        }
    }

    // 显示隐私政策
    showPrivacy() {
        if (window.utilsManager) {
            window.utilsManager.showToast('隐私政策功能开发中...', 'info');
        }
    }
}

// 导出模块
window.ModalManager = ModalManager;