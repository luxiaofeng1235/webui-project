/**
 * 验证码管理模块
 * 负责验证码生成、发送、验证等功能
 */

class VerificationManager {
    constructor() {
        this.verificationCodes = new Map();
        this.init();
    }

    init() {
        this.initPasswordStrength();
    }

    // 初始化密码强度检测
    initPasswordStrength() {
        const passwordInput = document.getElementById('registerPassword');
        if (passwordInput) {
            passwordInput.addEventListener('input', (e) => {
                this.checkPasswordStrength(e.target.value);
            });
        }
        
        const newPasswordInput = document.getElementById('newPasswordSettings');
        if (newPasswordInput) {
            newPasswordInput.addEventListener('input', (e) => {
                this.checkPasswordStrength(e.target.value, 'newPasswordStrength');
            });
        }
    }

    // 检查密码强度
    checkPasswordStrength(password, indicatorId = 'passwordStrength') {
        const strengthIndicator = document.getElementById(indicatorId);
        if (!strengthIndicator) return;

        let strength = 0;
        const checks = [
            password.length >= 8,
            /[a-z]/.test(password),
            /[A-Z]/.test(password),
            /[0-9]/.test(password),
            /[^A-Za-z0-9]/.test(password)
        ];

        strength = checks.filter(check => check).length;

        strengthIndicator.className = 'password-strength';
        if (strength < 3) {
            strengthIndicator.classList.add('weak');
        } else if (strength < 5) {
            strengthIndicator.classList.add('medium');
        } else {
            strengthIndicator.classList.add('strong');
        }
    }

    // 生成验证码
    generateVerificationCode() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    // 发送验证码
    async sendVerificationCode() {
        const emailInput = document.getElementById('registerEmail');
        const sendBtn = document.getElementById('sendCodeBtn');
        
        if (!emailInput || !emailInput.value) {
            if (window.utilsManager) {
                window.utilsManager.showToast('请先输入邮箱地址', 'error');
            }
            return;
        }

        const email = emailInput.value;
        if (!this.validateEmail(email)) {
            if (window.utilsManager) {
                window.utilsManager.showToast('请输入有效的邮箱地址', 'error');
            }
            return;
        }

        // 禁用按钮并开始倒计时
        sendBtn.disabled = true;
        let countdown = 60;
        
        const updateButton = () => {
            sendBtn.textContent = `${countdown}秒后重发`;
            countdown--;
            
            if (countdown < 0) {
                sendBtn.disabled = false;
                sendBtn.textContent = '发送验证码';
                return;
            }
            
            setTimeout(updateButton, 1000);
        };
        
        updateButton();

        // 生成并存储验证码
        const code = this.generateVerificationCode();
        this.verificationCodes.set(email, {
            code: code,
            timestamp: Date.now(),
            attempts: 0
        });

        // 模拟发送邮件
        try {
            await this.simulateEmailSend(email, code);
            if (window.utilsManager) {
                window.utilsManager.showToast('验证码已生成（开发模式：请查看弹窗显示的验证码）', 'success');
            }
        } catch (error) {
            if (window.utilsManager) {
                window.utilsManager.showToast('验证码发送失败，请稍后重试', 'error');
            }
            sendBtn.disabled = false;
            sendBtn.textContent = '发送验证码';
        }
    }

    // 模拟邮件发送
    async simulateEmailSend(email, code) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log(`验证码已发送到 ${email}: ${code}`);
                this.showVerificationCodeModal(email, code);
                resolve();
            }, 1000);
        });
    }

    // 显示验证码模态框
    showVerificationCodeModal(email, code) {
        const existingModal = document.getElementById('verificationCodeDisplay');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.id = 'verificationCodeDisplay';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            font-family: Arial, sans-serif;
        `;
        
        const content = document.createElement('div');
        content.style.cssText = `
            background: white;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
            text-align: center;
            max-width: 400px;
            width: 90%;
            border: 3px solid #ff6b35;
        `;
        
        content.innerHTML = `
            <div style="color: #ff6b35; font-size: 24px; margin-bottom: 10px;">
                <i class="fas fa-envelope" style="margin-right: 10px;"></i>
                验证码
            </div>
            <p style="margin: 15px 0; color: #333;">
                邮箱: <strong>${email}</strong>
            </p>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0; color: #666; font-size: 14px;">您的验证码是：</p>
                <div style="font-size: 32px; font-weight: bold; color: #ff6b35; letter-spacing: 4px; margin: 10px 0;">
                    ${code}
                </div>
                <p style="margin: 0; color: #666; font-size: 12px;">验证码5分钟内有效</p>
            </div>
            <div style="background: #fff3cd; padding: 10px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #ffc107;">
                <p style="margin: 0; color: #856404; font-size: 13px;">
                    <strong>开发提示：</strong>当前为开发模式，验证码显示在此处。<br>
                    实际部署时，验证码将发送到您的邮箱。
                </p>
            </div>
            <button onclick="this.closest('#verificationCodeDisplay').remove()" 
                    style="background: #ff6b35; color: white; border: none; padding: 12px 24px; 
                           border-radius: 6px; cursor: pointer; font-size: 16px; margin-top: 10px;">
                <i class="fas fa-check" style="margin-right: 8px;"></i>我知道了
            </button>
        `;
        
        modal.appendChild(content);
        document.body.appendChild(modal);
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        setTimeout(() => {
            if (modal.parentElement) {
                modal.remove();
            }
        }, 15000);
    }

    // 验证邮箱格式
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // 验证手机号格式
    validatePhone(phone) {
        const re = /^1[3-9]\d{9}$/;
        return re.test(phone);
    }

    // 验证验证码
    verifyCode(email, inputCode) {
        const stored = this.verificationCodes.get(email);
        if (!stored) {
            return { valid: false, message: '请先获取验证码' };
        }

        // 检查是否过期（5分钟）
        if (Date.now() - stored.timestamp > 5 * 60 * 1000) {
            this.verificationCodes.delete(email);
            return { valid: false, message: '验证码已过期，请重新获取' };
        }

        // 检查尝试次数
        if (stored.attempts >= 3) {
            this.verificationCodes.delete(email);
            return { valid: false, message: '验证码错误次数过多，请重新获取' };
        }

        // 验证码码
        if (stored.code !== inputCode) {
            stored.attempts++;
            return { valid: false, message: '验证码错误' };
        }

        return { valid: true, message: '验证成功' };
    }

    // 发送个人资料验证码
    sendProfileVerificationCode() {
        const emailInput = document.getElementById('settingsEmail');
        const sendBtn = document.getElementById('sendProfileCodeBtn');
        
        if (!emailInput || !emailInput.value) {
            if (window.utilsManager) {
                window.utilsManager.showToast('请先输入新邮箱地址', 'error');
            }
            return;
        }

        const email = emailInput.value;
        if (!this.validateEmail(email)) {
            if (window.utilsManager) {
                window.utilsManager.showToast('请输入有效的邮箱地址', 'error');
            }
            return;
        }

        // 检查是否与当前邮箱相同
        if (window.authCore && window.authCore.currentUser && email === window.authCore.currentUser.email) {
            if (window.utilsManager) {
                window.utilsManager.showToast('新邮箱不能与当前邮箱相同', 'error');
            }
            return;
        }

        // 禁用按钮并开始倒计时
        sendBtn.disabled = true;
        let countdown = 60;
        
        const updateButton = () => {
            sendBtn.textContent = `${countdown}秒后重发`;
            countdown--;
            
            if (countdown < 0) {
                sendBtn.disabled = false;
                sendBtn.textContent = '发送验证码';
                return;
            }
            
            setTimeout(updateButton, 1000);
        };
        
        updateButton();

        // 生成并存储验证码
        const code = this.generateVerificationCode();
        this.verificationCodes.set(email, {
            code: code,
            timestamp: Date.now(),
            attempts: 0
        });

        // 模拟发送邮件
        this.simulateEmailSend(email, code).then(() => {
            if (window.utilsManager) {
                window.utilsManager.showToast('验证码已发送到新邮箱', 'success');
            }
        }).catch(() => {
            if (window.utilsManager) {
                window.utilsManager.showToast('验证码发送失败，请稍后重试', 'error');
            }
            sendBtn.disabled = false;
            sendBtn.textContent = '发送验证码';
        });
    }
}

// 导出模块
window.VerificationManager = VerificationManager;