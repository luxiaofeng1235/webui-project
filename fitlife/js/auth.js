// 认证系统 JavaScript
class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.verificationCodes = new Map();
        this.registeredUsers = new Map(); // 存储注册用户
        this.loadRegisteredUsers(); // 加载已注册用户
        this.init();
    }

    init() {
        // 检查是否有已登录的用户
        this.checkLoginStatus();
        
        // 绑定事件监听器
        this.bindEvents();
        
        // 初始化密码强度检测
        this.initPasswordStrength();
        
        // 定期检查登录状态（防止数据不一致）
        this.startLoginStatusMonitor();
    }

    // 检查登录状态
    checkLoginStatus() {
        // 优先检查localStorage（记住我功能）
        let savedUser = localStorage.getItem('fitlife_user');
        if (!savedUser) {
            // 如果localStorage没有，检查sessionStorage
            savedUser = sessionStorage.getItem('fitlife_user');
        }
        
        if (savedUser) {
            try {
                this.currentUser = JSON.parse(savedUser);
                this.showUserInfo();
                
                // 恢复用户头像显示
                if (this.currentUser.avatar) {
                    updateAvatarDisplay(this.currentUser.avatar);
                }
                
                console.log('用户登录状态已恢复:', this.currentUser.name);
            } catch (error) {
                console.error('解析用户数据失败:', error);
                // 清除损坏的数据
                localStorage.removeItem('fitlife_user');
                sessionStorage.removeItem('fitlife_user');
            }
        }
    }

    // 绑定事件
    bindEvents() {
        // 点击模态框外部关闭
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target.id);
            }
        });

        // ESC键关闭模态框
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
    }

    // 初始化密码强度检测
    initPasswordStrength() {
        const passwordInput = document.getElementById('registerPassword');
        if (passwordInput) {
            passwordInput.addEventListener('input', (e) => {
                this.checkPasswordStrength(e.target.value);
            });
        }
        
        // 设置页面的新密码强度检测
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

    // 显示消息提示
    showToast(message, type = 'success') {
        const toast = document.getElementById('messageToast');
        const icon = toast.querySelector('.toast-icon');
        const messageEl = toast.querySelector('.toast-message');

        // 设置图标
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };

        icon.className = `toast-icon ${icons[type] || icons.success}`;
        messageEl.textContent = message;
        
        toast.className = `toast ${type}`;
        toast.classList.add('show');

        // 3秒后自动隐藏
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
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
            this.showToast('请先输入邮箱地址', 'error');
            return;
        }

        const email = emailInput.value;
        if (!this.validateEmail(email)) {
            this.showToast('请输入有效的邮箱地址', 'error');
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
            this.showToast('验证码已生成（开发模式：请查看弹窗显示的验证码）', 'success');
        } catch (error) {
            this.showToast('验证码发送失败，请稍后重试', 'error');
            sendBtn.disabled = false;
            sendBtn.textContent = '发送验证码';
        }
    }

    // 模拟邮件发送 - 改进版本，在页面显示验证码
    async simulateEmailSend(email, code) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log(`验证码已发送到 ${email}: ${code}`);
                
                // 在页面上显示验证码（开发模式）
                this.showVerificationCodeModal(email, code);
                
                // 在实际应用中，这里应该调用真实的邮件发送API
                resolve();
            }, 1000);
        });
    }

    // 在页面上显示验证码的模态框
    showVerificationCodeModal(email, code) {
        // 移除已存在的验证码显示框
        const existingModal = document.getElementById('verificationCodeDisplay');
        if (existingModal) {
            existingModal.remove();
        }

        // 创建验证码显示模态框
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
        
        // 点击背景关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        // 15秒后自动关闭
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


    // 保存注册用户到localStorage
    saveRegisteredUsers() {
        try {
            const usersData = Array.from(this.registeredUsers.entries());
            const dataToSave = {
                users: usersData,
                timestamp: new Date().toISOString(),
                version: '1.0'
            };
            localStorage.setItem('fitlife_registered_users', JSON.stringify(dataToSave));
            console.log('用户数据已保存，当前注册用户数量:', usersData.length);
        } catch (error) {
            console.error('保存用户数据失败:', error);
            this.showToast('保存用户数据失败', 'error');
        }
    }

    // 加载已注册用户（优化版本）
    loadRegisteredUsers() {
        try {
            const savedData = localStorage.getItem('fitlife_registered_users');
            if (savedData) {
                const parsedData = JSON.parse(savedData);
                
                // 兼容旧版本数据格式
                if (Array.isArray(parsedData)) {
                    // 旧版本格式
                    this.registeredUsers = new Map(parsedData);
                } else if (parsedData.users && Array.isArray(parsedData.users)) {
                    // 新版本格式
                    this.registeredUsers = new Map(parsedData.users);
                    console.log('加载用户数据版本:', parsedData.version);
                    console.log('数据时间戳:', parsedData.timestamp);
                }
                
                console.log('已加载注册用户数量:', this.registeredUsers.size);
                console.log('注册用户列表:', Array.from(this.registeredUsers.keys()));
            } else {
                console.log('没有找到已保存的用户数据');
            }
        } catch (error) {
            console.error('加载用户数据失败:', error);
            // 清除损坏的数据
            localStorage.removeItem('fitlife_registered_users');
            this.registeredUsers = new Map();
        }
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

    // 启动登录状态监控
    startLoginStatusMonitor() {
        // 每30秒检查一次登录状态
        setInterval(() => {
            this.validateLoginStatus();
        }, 30000);
        
        // 监听storage事件（多标签页同步）
        window.addEventListener('storage', (e) => {
            if (e.key === 'fitlife_user') {
                if (e.newValue) {
                    // 其他标签页登录了
                    try {
                        this.currentUser = JSON.parse(e.newValue);
                        this.showUserInfo();
                        
                        // 同步头像显示
                        if (this.currentUser.avatar) {
                            updateAvatarDisplay(this.currentUser.avatar);
                        }
                        
                        console.log('检测到其他标签页登录，已同步登录状态');
                    } catch (error) {
                        console.error('同步登录状态失败:', error);
                    }
                } else {
                    // 其他标签页退出了
                    this.currentUser = null;
                    this.hideUserInfo();
                    console.log('检测到其他标签页退出，已同步退出状态');
                }
            }
        });
    }

    // 验证登录状态有效性
    validateLoginStatus() {
        if (!this.currentUser) return;
        
        // 检查存储中的数据是否还存在
        const storedUser = localStorage.getItem('fitlife_user') || sessionStorage.getItem('fitlife_user');
        if (!storedUser) {
            // 存储中的数据被清除了，退出登录
            this.currentUser = null;
            this.hideUserInfo();
            console.log('检测到登录状态已失效，自动退出');
            return;
        }
        
        try {
            const userData = JSON.parse(storedUser);
            // 验证数据完整性
            if (!userData.id || !userData.email || !userData.name) {
                throw new Error('用户数据不完整');
            }
            
            // 更新当前用户数据（防止数据不一致）
            this.currentUser = userData;
            
            // 如果用户有头像，更新显示
            if (userData.avatar) {
                updateAvatarDisplay(userData.avatar);
            }
        } catch (error) {
            console.error('用户数据验证失败:', error);
            // 清除无效数据
            localStorage.removeItem('fitlife_user');
            sessionStorage.removeItem('fitlife_user');
            this.currentUser = null;
            this.hideUserInfo();
        }
    }

    // 显示用户信息
    showUserInfo() {
        const authButtons = document.querySelectorAll('.btn-auth');
        const userInfo = document.getElementById('userInfo');
        const userName = document.getElementById('userName');

        // 隐藏登录注册按钮
        authButtons.forEach(btn => {
            btn.style.display = 'none';
        });
        
        if (userInfo && userName && this.currentUser) {
            userName.textContent = this.currentUser.name;
            userInfo.style.display = 'flex';
            
            // 更新导航栏头像
            if (this.currentUser.avatar) {
                updateAvatarDisplay(this.currentUser.avatar);
            } else {
                updateAvatarDisplay(null);
            }
            
            console.log('用户界面已更新，显示用户:', this.currentUser.name);
        }
    }

    // 隐藏用户信息
    hideUserInfo() {
        const authButtons = document.querySelectorAll('.btn-auth');
        const userInfo = document.getElementById('userInfo');

        authButtons.forEach(btn => {
            btn.style.display = 'flex';
        });
        
        if (userInfo) {
            userInfo.style.display = 'none';
        }
    }
}

// 创建全局认证系统实例
const authSystem = new AuthSystem();

// 套餐报名功能 - 移到前面确保可用
function enrollPackage(packageId, packageName, packagePrice) {
    // 检查用户是否已登录
    if (!authSystem.currentUser) {
        authSystem.showToast('请先登录后再报名套餐', 'error');
        setTimeout(() => {
            openLoginModal();
        }, 1000);
        return;
    }
    
    // 检查用户是否已经报名了套餐
    if (authSystem.currentUser.enrolledPackage) {
        authSystem.showToast(`您已报名了${authSystem.currentUser.enrolledPackage.name}，如需更换请联系客服`, 'warning');
        return;
    }
    
    // 确认报名
    if (confirm(`确认报名 ${packageName} (${packagePrice}) 吗？`)) {
        // 模拟报名处理
        setTimeout(() => {
            // 更新用户信息
            authSystem.currentUser.enrolledPackage = {
                id: packageId,
                name: packageName,
                price: packagePrice,
                enrollDate: new Date().toISOString(),
                status: 'active'
            };
            
            // 更新存储的用户信息
            const userDataToSave = {
                ...authSystem.currentUser,
                lastUpdated: new Date().toISOString()
            };
            
            if (localStorage.getItem('fitlife_user')) {
                localStorage.setItem('fitlife_user', JSON.stringify(userDataToSave));
            } else {
                sessionStorage.setItem('fitlife_user', JSON.stringify(userDataToSave));
            }
            
            // 显示成功消息
            authSystem.showToast(`🎉 恭喜您！成功报名 ${packageName}`, 'success');
            
            // 更新个人中心显示
            updateProfilePackageDisplay();
            
        }, 500);
    }
}

// 更新个人中心的套餐显示
function updateProfilePackageDisplay() {
    const packageDisplay = document.getElementById('profileEnrolledPackage');
    if (packageDisplay && authSystem.currentUser) {
        if (authSystem.currentUser.enrolledPackage) {
            const enrollDate = new Date(authSystem.currentUser.enrolledPackage.enrollDate);
            const formattedDate = enrollDate.toLocaleDateString('zh-CN');
            packageDisplay.innerHTML = `
                <div style="color: #28a745; font-weight: 600;">
                    ${authSystem.currentUser.enrolledPackage.name}
                </div>
                <div style="font-size: 12px; color: #666; margin-top: 4px;">
                    价格: ${authSystem.currentUser.enrolledPackage.price} | 报名时间: ${formattedDate}
                </div>
            `;
        } else {
            packageDisplay.textContent = '暂无报名套餐';
        }
    }
}

// 模态框控制函数
function openLoginModal() {
    const modal = document.getElementById('loginModal');
    modal.style.display = 'flex';
    modal.classList.add('show');
}

function openRegisterModal() {
    const modal = document.getElementById('registerModal');
    modal.style.display = 'flex';
    modal.classList.add('show');
}

function openForgotPasswordModal() {
    closeAllModals();
    const modal = document.getElementById('forgotPasswordModal');
    modal.style.display = 'flex';
    modal.classList.add('show');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
}

function closeAllModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    });
}

function switchToRegister() {
    closeModal('loginModal');
    setTimeout(() => openRegisterModal(), 300);
}

function switchToLogin() {
    closeAllModals();
    setTimeout(() => openLoginModal(), 300);
}

// 密码显示/隐藏切换
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const button = input.nextElementSibling;
    const icon = button.querySelector('i');

    if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        icon.className = 'fas fa-eye';
    }
}

// 发送验证码
function sendVerificationCode() {
    authSystem.sendVerificationCode();
}

// 处理登录
async function handleLogin(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const rememberMe = formData.get('rememberMe');

    // 基本验证
    if (!authSystem.validateEmail(email)) {
        authSystem.showToast('请输入有效的邮箱地址', 'error');
        return;
    }

    if (password.length < 6) {
        authSystem.showToast('密码长度至少6位', 'error');
        return;
    }

    try {
        // 模拟登录API调用
        const response = await simulateLogin(email, password);
        
        if (response.success) {
            authSystem.currentUser = response.user;
            
            // 保存登录状态到localStorage
            const userDataToSave = {
                ...response.user,
                loginTime: new Date().toISOString(),
                rememberMe: !!rememberMe
            };
            
            if (rememberMe) {
                // 记住我：保存到localStorage（持久化）
                localStorage.setItem('fitlife_user', JSON.stringify(userDataToSave));
                console.log('用户登录状态已保存到localStorage（持久化）');
            } else {
                // 不记住我：保存到sessionStorage（会话级别）
                sessionStorage.setItem('fitlife_user', JSON.stringify(userDataToSave));
                console.log('用户登录状态已保存到sessionStorage（会话级别）');
            }
            
            authSystem.showUserInfo();
            closeModal('loginModal');
            authSystem.showToast('登录成功！', 'success');
        } else {
            authSystem.showToast(response.message || '登录失败', 'error');
        }
    } catch (error) {
        authSystem.showToast('网络错误，请稍后重试', 'error');
    }
}

// 处理注册
async function handleRegister(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    const verificationCode = formData.get('verificationCode');
    const agreeTerms = formData.get('agreeTerms');

    // 基本验证
    if (!name.trim()) {
        authSystem.showToast('请输入姓名', 'error');
        return;
    }

    if (!authSystem.validateEmail(email)) {
        authSystem.showToast('请输入有效的邮箱地址', 'error');
        return;
    }

    if (!authSystem.validatePhone(phone)) {
        authSystem.showToast('请输入有效的手机号', 'error');
        return;
    }

    if (password.length < 8) {
        authSystem.showToast('密码长度至少8位', 'error');
        return;
    }

    if (password !== confirmPassword) {
        authSystem.showToast('两次输入的密码不一致', 'error');
        return;
    }

    if (!verificationCode) {
        authSystem.showToast('请输入验证码', 'error');
        return;
    }

    if (!agreeTerms) {
        authSystem.showToast('请同意用户协议和隐私政策', 'error');
        return;
    }

    // 验证验证码
    const codeVerification = authSystem.verifyCode(email, verificationCode);
    if (!codeVerification.valid) {
        authSystem.showToast(codeVerification.message, 'error');
        return;
    }

    try {
        // 模拟注册API调用
        const response = await simulateRegister({
            name, email, phone, password
        });
        
        if (response.success) {
            authSystem.verificationCodes.delete(email);
            closeModal('registerModal');
            authSystem.showToast('注册成功！请登录', 'success');
            setTimeout(() => openLoginModal(), 1000);
        } else {
            authSystem.showToast(response.message || '注册失败', 'error');
        }
    } catch (error) {
        authSystem.showToast('网络错误，请稍后重试', 'error');
    }
}

// 发送重置密码验证码
async function sendResetCode(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const email = formData.get('email');

    if (!authSystem.validateEmail(email)) {
        authSystem.showToast('请输入有效的邮箱地址', 'error');
        return;
    }

    try {
        // 生成并发送验证码
        const code = authSystem.generateVerificationCode();
        authSystem.verificationCodes.set(email, {
            code: code,
            timestamp: Date.now(),
            attempts: 0
        });

        await authSystem.simulateEmailSend(email, code);
        
        // 切换到第二步
        document.getElementById('forgotStep1').style.display = 'none';
        document.getElementById('forgotStep2').style.display = 'block';
        
        authSystem.showToast('验证码已发送到您的邮箱', 'success');
    } catch (error) {
        authSystem.showToast('发送失败，请稍后重试', 'error');
    }
}

// 重置密码
async function resetPassword(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const resetCode = formData.get('resetCode');
    const newPassword = formData.get('newPassword');
    const confirmNewPassword = formData.get('confirmNewPassword');
    const email = document.getElementById('forgotEmail').value;

    if (newPassword.length < 8) {
        authSystem.showToast('密码长度至少8位', 'error');
        return;
    }

    if (newPassword !== confirmNewPassword) {
        authSystem.showToast('两次输入的密码不一致', 'error');
        return;
    }

    // 验证验证码
    const codeVerification = authSystem.verifyCode(email, resetCode);
    if (!codeVerification.valid) {
        authSystem.showToast(codeVerification.message, 'error');
        return;
    }

    try {
        // 模拟重置密码API调用
        const response = await simulatePasswordReset(email, newPassword);
        
        if (response.success) {
            authSystem.verificationCodes.delete(email);
            closeModal('forgotPasswordModal');
            authSystem.showToast('密码重置成功！请重新登录', 'success');
            setTimeout(() => openLoginModal(), 1000);
        } else {
            authSystem.showToast(response.message || '重置失败', 'error');
        }
    } catch (error) {
        authSystem.showToast('网络错误，请稍后重试', 'error');
    }
}

// 重新发送重置验证码
function resendResetCode() {
    const email = document.getElementById('forgotEmail').value;
    if (email) {
        authSystem.sendVerificationCode();
    }
}

// 显示用户菜单
function showUserMenu() {
    const menu = document.getElementById('userMenu');
    menu.classList.toggle('show');
}

// 用户相关功能
function showProfile() {
    if (!authSystem.currentUser) {
        authSystem.showToast('请先登录', 'error');
        return;
    }
    openProfileModal();
}

function showMyPlans() {
    if (!authSystem.currentUser) {
        authSystem.showToast('请先登录', 'error');
        return;
    }
    
    if (authSystem.currentUser.enrolledPackage) {
        authSystem.showToast(`您已报名：${authSystem.currentUser.enrolledPackage.name}`, 'info');
    } else {
        authSystem.showToast('您还没有报名任何套餐', 'info');
    }
}

function showSettings() {
    if (!authSystem.currentUser) {
        authSystem.showToast('请先登录', 'error');
        return;
    }
    openSettingsModal();
}

function logout() {
    // 清除用户数据
    authSystem.currentUser = null;
    
    // 清除所有存储的登录状态
    localStorage.removeItem('fitlife_user');
    sessionStorage.removeItem('fitlife_user');
    
    // 隐藏用户信息，显示登录按钮
    authSystem.hideUserInfo();
    
    // 重置导航栏头像为默认图标
    updateAvatarDisplay(null);
    
    // 清除用户菜单状态
    const userMenu = document.getElementById('userMenu');
    if (userMenu) {
        userMenu.classList.remove('show');
    }
    
    console.log('用户已退出登录，所有登录状态已清除');
    authSystem.showToast('已退出登录', 'success');
}

function showTerms() {
    authSystem.showToast('用户协议功能开发中...', 'info');
}

function showPrivacy() {
    authSystem.showToast('隐私政策功能开发中...', 'info');
}

// 个人资料管理功能
function openProfileModal() {
    const modal = document.getElementById('profileModal');
    const nameDisplay = document.getElementById('profileDisplayName');
    const emailDisplay = document.getElementById('profileDisplayEmail');
    const lastLoginDisplay = document.getElementById('profileLastLogin');
    
    // 填充当前用户信息（只读显示）
    if (authSystem.currentUser) {
        nameDisplay.textContent = authSystem.currentUser.name || '-';
        emailDisplay.textContent = authSystem.currentUser.email || '-';
        
        // 显示手机号
        const phoneDisplay = document.getElementById('profileDisplayPhone');
        if (phoneDisplay) {
            phoneDisplay.textContent = authSystem.currentUser.phone || '-';
        }
        
        // 加载用户头像
        if (authSystem.currentUser.avatar) {
            updateAvatarDisplay(authSystem.currentUser.avatar);
        } else {
            updateAvatarDisplay(null);
        }
        
        // 格式化最后登录时间
        const loginTime = authSystem.currentUser.loginTime;
        if (loginTime) {
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
        } else {
            lastLoginDisplay.textContent = '暂无记录';
        }
        
        // 更新套餐显示
        updateProfilePackageDisplay();
    }
    
    modal.style.display = 'flex';
    modal.classList.add('show');
}


// 模拟API函数
async function simulateLogin(email, password) {
    return new Promise((resolve) => {
        setTimeout(() => {
            // 检查注册用户
            const user = authSystem.registeredUsers.get(email);
            if (user && user.password === password) {
                resolve({
                    success: true,
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        phone: user.phone,
                        avatar: user.avatar || null // 包含头像数据
                    }
                });
                return;
            }
            
            // 保留原有测试账号
            if (email === 'test@fitlife.com' && password === 'password123') {
                resolve({
                    success: true,
                    user: {
                        id: 1,
                        name: '测试用户',
                        email: email,
                        phone: '13800138000'
                    }
                });
                return;
            }
            
            resolve({
                success: false,
                message: '邮箱或密码错误'
            });
        }, 1000);
    });
}

async function simulateRegister(userData) {
    return new Promise((resolve) => {
        setTimeout(() => {
            // 检查邮箱是否已存在
            if (authSystem.registeredUsers.has(userData.email)) {
                resolve({
                    success: false,
                    message: '该邮箱已被注册'
                });
                return;
            }
            
            // 保存用户数据
            authSystem.registeredUsers.set(userData.email, {
                id: Date.now(),
                name: userData.name,
                email: userData.email,
                phone: userData.phone,
                password: userData.password,
                registeredAt: new Date().toISOString()
            });
            
            // 持久化保存到localStorage
            authSystem.saveRegisteredUsers();
            
            console.log('用户注册成功:', userData.email);
            console.log('当前注册用户:', Array.from(authSystem.registeredUsers.keys()));
            
            resolve({
                success: true,
                message: '注册成功'
            });
        }, 1000);
    });
}

async function simulatePasswordReset(email, newPassword) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                success: true,
                message: '密码重置成功'
            });
        }, 1000);
    });
}

// 设置相关函数
function openSettingsModal() {
    const modal = document.getElementById('settingsModal');
    
    // 填充当前用户信息到表单
    if (authSystem.currentUser) {
        document.getElementById('settingsName').value = authSystem.currentUser.name || '';
        document.getElementById('settingsEmail').value = authSystem.currentUser.email || '';
        document.getElementById('settingsPhone').value = authSystem.currentUser.phone || '';
        
        // 初始化时隐藏邮箱验证区域
        document.getElementById('emailVerificationSection').style.display = 'none';
        
        // 加载用户头像
        loadUserAvatar();
    }
    
    // 显示个人资料标签
    showSettingsTab('profile');
    
    modal.style.display = 'flex';
    modal.classList.add('show');
}

function showSettingsTab(tabName) {
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

function resetProfileForm() {
    if (authSystem.currentUser) {
        document.getElementById('settingsName').value = authSystem.currentUser.name || '';
        document.getElementById('settingsEmail').value = authSystem.currentUser.email || '';
        // 手机号字段保持只读，显示当前值
        document.getElementById('settingsPhone').value = authSystem.currentUser.phone || '';
    }
    
    // 隐藏邮箱验证部分
    document.getElementById('emailVerificationSection').style.display = 'none';
    document.getElementById('profileVerificationCode').value = '';
    
    // 重新检查邮箱变化状态
    checkEmailChange();
}

function resetPasswordForm() {
    document.getElementById('currentPassword').value = '';
    document.getElementById('newPasswordSettings').value = '';
    document.getElementById('confirmNewPasswordSettings').value = '';
    
    // 重置密码强度指示器
    const strengthIndicator = document.getElementById('newPasswordStrength');
    if (strengthIndicator) {
        strengthIndicator.className = 'password-strength';
    }
}

// 发送个人资料验证码
function sendProfileVerificationCode() {
    const emailInput = document.getElementById('settingsEmail');
    const sendBtn = document.getElementById('sendProfileCodeBtn');
    
    if (!emailInput || !emailInput.value) {
        authSystem.showToast('请先输入新邮箱地址', 'error');
        return;
    }

    const email = emailInput.value;
    if (!authSystem.validateEmail(email)) {
        authSystem.showToast('请输入有效的邮箱地址', 'error');
        return;
    }

    // 检查是否与当前邮箱相同
    if (authSystem.currentUser && email === authSystem.currentUser.email) {
        authSystem.showToast('新邮箱不能与当前邮箱相同', 'error');
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
    const code = authSystem.generateVerificationCode();
    authSystem.verificationCodes.set(email, {
        code: code,
        timestamp: Date.now(),
        attempts: 0
    });

    // 模拟发送邮件
    authSystem.simulateEmailSend(email, code).then(() => {
        authSystem.showToast('验证码已发送到新邮箱', 'success');
    }).catch(() => {
        authSystem.showToast('验证码发送失败，请稍后重试', 'error');
        sendBtn.disabled = false;
        sendBtn.textContent = '发送验证码';
    });
}

// 检查邮箱是否发生变化
function checkEmailChange() {
    const emailInput = document.getElementById('settingsEmail');
    const emailVerificationSection = document.getElementById('emailVerificationSection');
    
    if (authSystem.currentUser && emailInput.value !== authSystem.currentUser.email) {
        // 邮箱发生变化，显示验证码区域
        emailVerificationSection.style.display = 'block';
    } else {
        // 邮箱未变化，隐藏验证码区域
        emailVerificationSection.style.display = 'none';
    }
}

// 处理个人资料更新
async function handleProfileUpdate(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const name = formData.get('name');
    const email = formData.get('email');
    // 不再处理手机号，因为它是只读的
    const verificationCode = formData.get('verificationCode');

    // 基本验证
    if (!name.trim()) {
        authSystem.showToast('请输入用户名', 'error');
        return;
    }

    if (!authSystem.validateEmail(email)) {
        authSystem.showToast('请输入有效的邮箱地址', 'error');
        return;
    }

    // 检查邮箱是否发生变化
    const emailChanged = authSystem.currentUser.email !== email;
    
    if (emailChanged) {
        // 邮箱发生变化，需要验证码
        if (!verificationCode) {
            authSystem.showToast('邮箱已变更，请先获取验证码', 'warning');
            return;
        }

        // 验证验证码
        const codeVerification = authSystem.verifyCode(email, verificationCode);
        if (!codeVerification.valid) {
            authSystem.showToast(codeVerification.message, 'error');
            return;
        }
    }

    try {
        // 模拟更新个人资料（不包含手机号）
        const response = await simulateProfileUpdate({
            name, email
        });
        
        if (response.success) {
            const oldEmail = authSystem.currentUser.email;
            
            // 如果邮箱发生变化，需要更新注册用户数据
            if (emailChanged) {
                // 从旧邮箱的注册数据中获取用户信息
                const oldUserData = authSystem.registeredUsers.get(oldEmail);
                if (oldUserData) {
                    // 删除旧邮箱的注册记录
                    authSystem.registeredUsers.delete(oldEmail);
                    
                    // 更新用户数据并用新邮箱作为key保存
                    oldUserData.email = email;
                    oldUserData.name = name;
                    oldUserData.lastUpdated = new Date().toISOString();
                    authSystem.registeredUsers.set(email, oldUserData);
                    
                    // 保存更新后的注册用户数据
                    authSystem.saveRegisteredUsers();
                    
                    console.log(`用户邮箱已从 ${oldEmail} 更新为 ${email}`);
                }
            } else {
                // 如果只是修改用户名，更新现有记录
                const userData = authSystem.registeredUsers.get(oldEmail);
                if (userData) {
                    userData.name = name;
                    userData.lastUpdated = new Date().toISOString();
                    authSystem.registeredUsers.set(oldEmail, userData);
                    authSystem.saveRegisteredUsers();
                }
            }
            
            // 更新当前用户信息
            authSystem.currentUser.name = name;
            authSystem.currentUser.email = email;
            // 手机号保持不变
            
            // 更新存储的用户信息
            const userDataToSave = {
                ...authSystem.currentUser,
                lastUpdated: new Date().toISOString()
            };
            
            // 更新localStorage或sessionStorage
            if (localStorage.getItem('fitlife_user')) {
                localStorage.setItem('fitlife_user', JSON.stringify(userDataToSave));
            } else {
                sessionStorage.setItem('fitlife_user', JSON.stringify(userDataToSave));
            }
            
            // 更新界面显示
            authSystem.showUserInfo();
            
            // 清除验证码
            if (emailChanged) {
                authSystem.verificationCodes.delete(email);
                document.getElementById('emailVerificationSection').style.display = 'none';
                
                // 邮箱发生变更，需要重新登录
                authSystem.showToast('邮箱修改成功！请使用新邮箱重新登录', 'success');
                
                // 延迟2秒后自动退出登录
                setTimeout(() => {
                    // 关闭设置模态框
                    closeModal('settingsModal');
                    
                    // 执行退出登录操作
                    logout();
                    
                    // 再延迟0.5秒后打开登录模态框
                    setTimeout(() => {
                        openLoginModal();
                        // 在登录框中预填新邮箱
                        const loginEmailInput = document.getElementById('loginEmail');
                        if (loginEmailInput) {
                            loginEmailInput.value = email;
                        }
                    }, 500);
                }, 2000);
            } else {
                // 只修改了用户名，不需要重新登录
                authSystem.showToast('个人资料更新成功！', 'success');
                
                // 延迟1.5秒后自动关闭设置弹窗
                setTimeout(() => {
                    closeModal('settingsModal');
                }, 1500);
            }
        } else {
            authSystem.showToast(response.message || '更新失败', 'error');
        }
    } catch (error) {
        authSystem.showToast('网络错误，请稍后重试', 'error');
    }
}

// 处理密码更新
async function handlePasswordUpdate(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const currentPassword = formData.get('currentPassword');
    const newPassword = formData.get('newPassword');
    const confirmNewPassword = formData.get('confirmNewPassword');

    // 基本验证
    if (newPassword.length < 8) {
        authSystem.showToast('新密码长度至少8位', 'error');
        return;
    }

    if (newPassword !== confirmNewPassword) {
        authSystem.showToast('两次输入的新密码不一致', 'error');
        return;
    }

    if (currentPassword === newPassword) {
        authSystem.showToast('新密码不能与当前密码相同', 'error');
        return;
    }

    try {
        // 模拟密码更新
        const response = await simulatePasswordUpdate({
            currentPassword,
            newPassword,
            email: authSystem.currentUser.email
        });
        
        if (response.success) {
            resetPasswordForm();
            authSystem.showToast('密码修改成功！请重新登录', 'success');
            
            // 延迟1.5秒后自动退出登录
            setTimeout(() => {
                // 关闭设置模态框
                closeModal('settingsModal');
                
                // 执行退出登录操作
                logout();
                
                // 再延迟0.5秒后打开登录模态框
                setTimeout(() => {
                    openLoginModal();
                }, 500);
            }, 1500);
        } else {
            authSystem.showToast(response.message || '密码修改失败', 'error');
        }
    } catch (error) {
        authSystem.showToast('网络错误，请稍后重试', 'error');
    }
}

// 模拟API函数
async function simulateProfileUpdate(userData) {
    return new Promise((resolve) => {
        setTimeout(() => {
            // 检查新邮箱是否已被其他用户使用（排除当前用户的旧邮箱）
            const currentUserOldEmail = authSystem.currentUser.email;
            const existingUser = Array.from(authSystem.registeredUsers.entries())
                .find(([email, user]) => {
                    return email === userData.email && 
                           email !== currentUserOldEmail && 
                           user.id !== authSystem.currentUser.id;
                });
            
            if (existingUser) {
                resolve({
                    success: false,
                    message: '该邮箱已被其他用户使用'
                });
                return;
            }
            
            resolve({
                success: true,
                message: '个人资料更新成功'
            });
        }, 1000);
    });
}

async function simulatePasswordUpdate(data) {
    return new Promise((resolve) => {
        setTimeout(() => {
            // 验证当前密码（简化处理）
            const currentUser = authSystem.registeredUsers.get(data.email);
            if (currentUser && currentUser.password !== data.currentPassword) {
                resolve({
                    success: false,
                    message: '当前密码错误'
                });
                return;
            }
            
            // 更新密码
            if (currentUser) {
                currentUser.password = data.newPassword;
                currentUser.passwordUpdatedAt = new Date().toISOString();
                
                // 保存到localStorage
                authSystem.saveRegisteredUsers();
                
                console.log('用户密码已更新:', data.email);
            }
            
            resolve({
                success: true,
                message: '密码修改成功'
            });
        }, 1000);
    });
}

// 头像上传相关功能
let currentAvatarFile = null;
let cameraStream = null;

// 打开头像上传模态框
function openAvatarUploadModal() {
    const modal = document.getElementById('avatarUploadModal');
    resetAvatarUpload();
    modal.style.display = 'flex';
    modal.classList.add('show');
    
    // 检测是否支持相机
    checkCameraSupport();
    
    // 设置拖拽上传
    setupDragAndDrop();
}

// 检测相机支持
function checkCameraSupport() {
    const cameraBtn = document.getElementById('cameraBtn');
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        cameraBtn.style.display = 'inline-flex';
    } else {
        cameraBtn.style.display = 'none';
    }
}

// 设置拖拽上传
function setupDragAndDrop() {
    const previewContainer = document.querySelector('.preview-container');
    
    previewContainer.addEventListener('dragover', (e) => {
        e.preventDefault();
        previewContainer.classList.add('drag-over');
    });
    
    previewContainer.addEventListener('dragleave', (e) => {
        e.preventDefault();
        previewContainer.classList.remove('drag-over');
    });
    
    previewContainer.addEventListener('drop', (e) => {
        e.preventDefault();
        previewContainer.classList.remove('drag-over');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileSelect(files[0]);
        }
    });
    
    // 点击预览区域也可以选择文件
    previewContainer.addEventListener('click', triggerFileSelect);
}

// 触发文件选择
function triggerFileSelect() {
    document.getElementById('avatarFileInput').click();
}

// 文件输入变化处理
document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('avatarFileInput');
    if (fileInput) {
        fileInput.addEventListener('change', function(e) {
            if (e.target.files.length > 0) {
                handleFileSelect(e.target.files[0]);
            }
        });
    }
});

// 处理文件选择
function handleFileSelect(file) {
    // 验证文件类型
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
        authSystem.showToast('请选择 JPG、PNG 或 GIF 格式的图片', 'error');
        return;
    }
    
    // 验证文件大小 (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
        authSystem.showToast('文件大小不能超过 5MB', 'error');
        return;
    }
    
    currentAvatarFile = file;
    
    // 显示预览
    const reader = new FileReader();
    reader.onload = function(e) {
        showImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);
}

// 显示图片预览
function showImagePreview(imageSrc) {
    const preview = document.getElementById('avatarPreview');
    const placeholder = document.getElementById('uploadPlaceholder');
    const saveBtn = document.getElementById('saveAvatarBtn');
    
    preview.src = imageSrc;
    preview.style.display = 'block';
    placeholder.style.display = 'none';
    saveBtn.disabled = false;
    
    // 隐藏其他区域
    document.getElementById('cameraSection').style.display = 'none';
    document.getElementById('cropSection').style.display = 'none';
}

// 打开相机拍照
async function openCameraCapture() {
    const cameraSection = document.getElementById('cameraSection');
    const video = document.getElementById('cameraVideo');
    
    try {
        // 请求相机权限
        cameraStream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: 'user', // 前置摄像头
                width: { ideal: 640 },
                height: { ideal: 480 }
            }
        });
        
        video.srcObject = cameraStream;
        cameraSection.style.display = 'block';
        
        // 隐藏其他区域
        document.querySelector('.upload-preview').style.display = 'none';
        document.querySelector('.upload-controls').style.display = 'none';
        
    } catch (error) {
        console.error('无法访问相机:', error);
        authSystem.showToast('无法访问相机，请检查权限设置', 'error');
    }
}

// 拍照
function capturePhoto() {
    const video = document.getElementById('cameraVideo');
    const canvas = document.getElementById('cameraCanvas');
    const ctx = canvas.getContext('2d');
    
    // 设置画布尺寸
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // 绘制视频帧到画布
    ctx.drawImage(video, 0, 0);
    
    // 获取图片数据
    canvas.toBlob((blob) => {
        currentAvatarFile = new File([blob], 'camera-photo.jpg', { type: 'image/jpeg' });
        
        // 显示预览
        const imageSrc = canvas.toDataURL('image/jpeg', 0.8);
        showImagePreview(imageSrc);
        
        // 关闭相机
        closeCameraCapture();
        
        // 显示预览区域
        document.querySelector('.upload-preview').style.display = 'block';
        
    }, 'image/jpeg', 0.8);
}

// 关闭相机
function closeCameraCapture() {
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
    }
    
    document.getElementById('cameraSection').style.display = 'none';
    document.querySelector('.upload-preview').style.display = 'block';
    document.querySelector('.upload-controls').style.display = 'flex';
}

// 重置裁剪
function resetCrop() {
    document.getElementById('cropSection').style.display = 'none';
    document.querySelector('.upload-preview').style.display = 'block';
    document.querySelector('.upload-controls').style.display = 'flex';
}

// 确认裁剪
function confirmCrop() {
    // 这里可以添加图片裁剪逻辑
    // 简化处理，直接使用原图
    authSystem.showToast('裁剪功能开发中，当前使用原图', 'info');
    
    document.getElementById('cropSection').style.display = 'none';
    document.querySelector('.upload-preview').style.display = 'block';
    document.querySelector('.upload-controls').style.display = 'flex';
}

// 保存头像
async function saveAvatar() {
    if (!currentAvatarFile) {
        authSystem.showToast('请先选择或拍摄头像', 'error');
        return;
    }
    
    try {
        // 显示加载状态
        const saveBtn = document.getElementById('saveAvatarBtn');
        const originalText = saveBtn.innerHTML;
        saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 保存中...';
        saveBtn.disabled = true;
        
        // 模拟上传
        const response = await simulateAvatarUpload(currentAvatarFile);
        
        if (response.success) {
            // 更新用户头像信息
            if (authSystem.currentUser) {
                authSystem.currentUser.avatar = response.avatarUrl;
                
                // 更新存储的用户信息
                const userDataToSave = {
                    ...authSystem.currentUser,
                    lastUpdated: new Date().toISOString()
                };
                
                if (localStorage.getItem('fitlife_user')) {
                    localStorage.setItem('fitlife_user', JSON.stringify(userDataToSave));
                } else {
                    sessionStorage.setItem('fitlife_user', JSON.stringify(userDataToSave));
                }
                
                // 同时更新注册用户数据中的头像，确保重新登录后仍然有效
                if (authSystem.registeredUsers.has(authSystem.currentUser.email)) {
                    const registeredUser = authSystem.registeredUsers.get(authSystem.currentUser.email);
                    registeredUser.avatar = response.avatarUrl;
                    registeredUser.avatarUpdatedAt = new Date().toISOString();
                    authSystem.saveRegisteredUsers();
                    console.log('头像已保存到注册用户数据中');
                }
                
                // 更新界面显示
                updateAvatarDisplay(response.avatarUrl);
            }
            
            authSystem.showToast('头像更新成功！', 'success');
            closeModal('avatarUploadModal');
            
        } else {
            authSystem.showToast(response.message || '头像上传失败', 'error');
        }
        
        // 恢复按钮状态
        saveBtn.innerHTML = originalText;
        saveBtn.disabled = false;
        
    } catch (error) {
        console.error('头像上传错误:', error);
        authSystem.showToast('网络错误，请稍后重试', 'error');
        
        // 恢复按钮状态
        const saveBtn = document.getElementById('saveAvatarBtn');
        saveBtn.innerHTML = '<i class="fas fa-save"></i> 保存头像';
        saveBtn.disabled = false;
    }
}

// 更新头像显示
function updateAvatarDisplay(avatarUrl) {
    // 更新设置页面的头像
    const currentAvatarImg = document.getElementById('currentAvatarImg');
    const defaultAvatarIcon = document.getElementById('defaultAvatarIcon');
    
    if (currentAvatarImg && defaultAvatarIcon) {
        if (avatarUrl) {
            currentAvatarImg.src = avatarUrl;
            currentAvatarImg.style.display = 'block';
            defaultAvatarIcon.style.display = 'none';
        } else {
            currentAvatarImg.style.display = 'none';
            defaultAvatarIcon.style.display = 'block';
        }
    }
    
    // 更新导航栏的头像
    const navAvatarImg = document.getElementById('navAvatarImg');
    const navAvatarIcon = document.getElementById('navAvatarIcon');
    
    if (navAvatarImg && navAvatarIcon) {
        if (avatarUrl) {
            navAvatarImg.src = avatarUrl;
            navAvatarImg.style.display = 'block';
            navAvatarIcon.style.display = 'none';
        } else {
            navAvatarImg.style.display = 'none';
            navAvatarIcon.style.display = 'block';
        }
    }
    
    // 更新个人中心的头像
    const profileAvatarImg = document.getElementById('profileAvatarImg');
    const profileAvatarIcon = document.getElementById('profileAvatarIcon');
    
    if (profileAvatarImg && profileAvatarIcon) {
        if (avatarUrl) {
            profileAvatarImg.src = avatarUrl;
            profileAvatarImg.style.display = 'block';
            profileAvatarIcon.style.display = 'none';
        } else {
            profileAvatarImg.style.display = 'none';
            profileAvatarIcon.style.display = 'block';
        }
    }
    
    console.log('所有头像已更新:', avatarUrl ? '显示用户头像' : '显示默认图标');
}

// 重置头像上传
function resetAvatarUpload() {
    currentAvatarFile = null;
    
    // 重置预览
    const preview = document.getElementById('avatarPreview');
    const placeholder = document.getElementById('uploadPlaceholder');
    const saveBtn = document.getElementById('saveAvatarBtn');
    
    preview.style.display = 'none';
    placeholder.style.display = 'block';
    saveBtn.disabled = true;
    
    // 重置文件输入
    document.getElementById('avatarFileInput').value = '';
    
    // 隐藏相机和裁剪区域
    document.getElementById('cameraSection').style.display = 'none';
    document.getElementById('cropSection').style.display = 'none';
    
    // 显示上传控件
    document.querySelector('.upload-preview').style.display = 'block';
    document.querySelector('.upload-controls').style.display = 'flex';
    
    // 关闭相机流
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
    }
}

// 模拟头像上传API
async function simulateAvatarUpload(file) {
    return new Promise((resolve) => {
        setTimeout(() => {
            // 将文件转换为base64格式，这样刷新页面后仍然有效
            const reader = new FileReader();
            reader.onload = function(e) {
                const base64Avatar = e.target.result;
                resolve({
                    success: true,
                    avatarUrl: base64Avatar,
                    message: '头像上传成功'
                });
            };
            reader.readAsDataURL(file);
        }, 1000); // 模拟网络延迟
    });
}

// 在设置模态框打开时加载用户头像
function loadUserAvatar() {
    if (authSystem.currentUser && authSystem.currentUser.avatar) {
        updateAvatarDisplay(authSystem.currentUser.avatar);
    } else {
        // 如果没有头像，确保显示默认图标
        updateAvatarDisplay(null);
    }
}

// 套餐报名功能和相关函数已移到文件前面