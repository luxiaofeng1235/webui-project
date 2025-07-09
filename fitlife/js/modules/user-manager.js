/**
 * 用户管理模块
 * 负责用户登录、注册、个人资料管理等功能
 */

class UserManager {
    constructor() {
        this.init();
    }

    init() {
        // 初始化时不需要特别的设置
    }

    // 处理登录
    async handleLogin(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const email = formData.get('email');
        const password = formData.get('password');
        const rememberMe = formData.get('rememberMe');

        // 基本验证
        if (!window.verificationManager.validateEmail(email)) {
            if (window.utilsManager) {
                window.utilsManager.showToast('请输入有效的邮箱地址', 'error');
            }
            return;
        }

        if (password.length < 6) {
            if (window.utilsManager) {
                window.utilsManager.showToast('密码长度至少6位', 'error');
            }
            return;
        }

        try {
            // 模拟登录API调用
            const response = await this.simulateLogin(email, password);
            
            if (response.success) {
                window.authCore.currentUser = response.user;
                
                // 保存登录状态到localStorage
                const userDataToSave = {
                    ...response.user,
                    loginTime: new Date().toISOString(),
                    rememberMe: !!rememberMe
                };
                
                if (rememberMe) {
                    localStorage.setItem('fitlife_user', JSON.stringify(userDataToSave));
                    console.log('用户登录状态已保存到localStorage（持久化）');
                } else {
                    sessionStorage.setItem('fitlife_user', JSON.stringify(userDataToSave));
                    console.log('用户登录状态已保存到sessionStorage（会话级别）');
                }
                
                window.authCore.showUserInfo();
                window.authCore.closeModal('loginModal');
                if (window.utilsManager) {
                    window.utilsManager.showToast('登录成功！', 'success');
                }
            } else {
                if (window.utilsManager) {
                    window.utilsManager.showToast(response.message || '登录失败', 'error');
                }
            }
        } catch (error) {
            if (window.utilsManager) {
                window.utilsManager.showToast('网络错误，请稍后重试', 'error');
            }
        }
    }

    // 处理注册
    async handleRegister(event) {
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
            if (window.utilsManager) {
                window.utilsManager.showToast('请输入姓名', 'error');
            }
            return;
        }

        if (!window.verificationManager.validateEmail(email)) {
            if (window.utilsManager) {
                window.utilsManager.showToast('请输入有效的邮箱地址', 'error');
            }
            return;
        }

        if (!window.verificationManager.validatePhone(phone)) {
            if (window.utilsManager) {
                window.utilsManager.showToast('请输入有效的手机号', 'error');
            }
            return;
        }

        if (password.length < 8) {
            if (window.utilsManager) {
                window.utilsManager.showToast('密码长度至少8位', 'error');
            }
            return;
        }

        if (password !== confirmPassword) {
            if (window.utilsManager) {
                window.utilsManager.showToast('两次输入的密码不一致', 'error');
            }
            return;
        }

        if (!verificationCode) {
            if (window.utilsManager) {
                window.utilsManager.showToast('请输入验证码', 'error');
            }
            return;
        }

        if (!agreeTerms) {
            if (window.utilsManager) {
                window.utilsManager.showToast('请同意用户协议和隐私政策', 'error');
            }
            return;
        }

        // 验证验证码
        const codeVerification = window.verificationManager.verifyCode(email, verificationCode);
        if (!codeVerification.valid) {
            if (window.utilsManager) {
                window.utilsManager.showToast(codeVerification.message, 'error');
            }
            return;
        }

        try {
            // 模拟注册API调用
            const response = await this.simulateRegister({
                name, email, phone, password
            });
            
            if (response.success) {
                window.verificationManager.verificationCodes.delete(email);
                window.authCore.closeModal('registerModal');
                if (window.utilsManager) {
                    window.utilsManager.showToast('注册成功！请登录', 'success');
                }
                setTimeout(() => this.openLoginModal(), 1000);
            } else {
                if (window.utilsManager) {
                    window.utilsManager.showToast(response.message || '注册失败', 'error');
                }
            }
        } catch (error) {
            if (window.utilsManager) {
                window.utilsManager.showToast('网络错误，请稍后重试', 'error');
            }
        }
    }

    // 处理个人资料更新
    async handleProfileUpdate(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const name = formData.get('name');
        const email = formData.get('email');
        const verificationCode = formData.get('verificationCode');

        // 基本验证
        if (!name.trim()) {
            if (window.utilsManager) {
                window.utilsManager.showToast('请输入用户名', 'error');
            }
            return;
        }

        if (!window.verificationManager.validateEmail(email)) {
            if (window.utilsManager) {
                window.utilsManager.showToast('请输入有效的邮箱地址', 'error');
            }
            return;
        }

        // 检查邮箱是否发生变化
        const emailChanged = window.authCore.currentUser.email !== email;
        
        if (emailChanged) {
            if (!verificationCode) {
                if (window.utilsManager) {
                    window.utilsManager.showToast('邮箱已变更，请先获取验证码', 'warning');
                }
                return;
            }

            // 验证验证码
            const codeVerification = window.verificationManager.verifyCode(email, verificationCode);
            if (!codeVerification.valid) {
                if (window.utilsManager) {
                    window.utilsManager.showToast(codeVerification.message, 'error');
                }
                return;
            }
        }

        try {
            const response = await this.simulateProfileUpdate({
                name, email
            });
            
            if (response.success) {
                const oldEmail = window.authCore.currentUser.email;
                
                // 如果邮箱发生变化，需要更新注册用户数据
                if (emailChanged) {
                    const oldUserData = window.authCore.registeredUsers.get(oldEmail);
                    if (oldUserData) {
                        window.authCore.registeredUsers.delete(oldEmail);
                        
                        oldUserData.email = email;
                        oldUserData.name = name;
                        oldUserData.lastUpdated = new Date().toISOString();
                        window.authCore.registeredUsers.set(email, oldUserData);
                        
                        window.authCore.saveRegisteredUsers();
                        console.log(`用户邮箱已从 ${oldEmail} 更新为 ${email}`);
                    }
                } else {
                    const userData = window.authCore.registeredUsers.get(oldEmail);
                    if (userData) {
                        userData.name = name;
                        userData.lastUpdated = new Date().toISOString();
                        window.authCore.registeredUsers.set(oldEmail, userData);
                        window.authCore.saveRegisteredUsers();
                    }
                }
                
                // 更新当前用户信息
                window.authCore.currentUser.name = name;
                window.authCore.currentUser.email = email;
                
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
                
                // 更新界面显示
                window.authCore.showUserInfo();
                
                // 清除验证码
                if (emailChanged) {
                    window.verificationManager.verificationCodes.delete(email);
                    document.getElementById('emailVerificationSection').style.display = 'none';
                    
                    if (window.utilsManager) {
                        window.utilsManager.showToast('邮箱修改成功！请使用新邮箱重新登录', 'success');
                    }
                    
                    setTimeout(() => {
                        if (window.authCore && typeof window.authCore.closeModal === 'function') {
                            window.authCore.closeModal('settingsModal');
                        }

                        if (window.authCore && typeof window.authCore.logout === 'function') {
                            window.authCore.logout();
                        }

                        setTimeout(() => {
                            this.openLoginModal();
                            const loginEmailInput = document.getElementById('loginEmail');
                            if (loginEmailInput) {
                                loginEmailInput.value = email;
                            }
                        }, 500);
                    }, 2000);
                } else {
                    if (window.utilsManager) {
                        window.utilsManager.showToast('个人资料更新成功！', 'success');
                    }

                    setTimeout(() => {
                        if (window.authCore && typeof window.authCore.closeModal === 'function') {
                            window.authCore.closeModal('settingsModal');
                        }
                    }, 1500);
                }
            } else {
                if (window.utilsManager) {
                    window.utilsManager.showToast(response.message || '更新失败', 'error');
                }
            }
        } catch (error) {
            if (window.utilsManager) {
                window.utilsManager.showToast('网络错误，请稍后重试', 'error');
            }
        }
    }

    // 处理密码更新
    async handlePasswordUpdate(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const currentPassword = formData.get('currentPassword');
        const newPassword = formData.get('newPassword');
        const confirmNewPassword = formData.get('confirmNewPassword');

        // 基本验证
        if (newPassword.length < 8) {
            if (window.utilsManager) {
                window.utilsManager.showToast('新密码长度至少8位', 'error');
            }
            return;
        }

        if (newPassword !== confirmNewPassword) {
            if (window.utilsManager) {
                window.utilsManager.showToast('两次输入的新密码不一致', 'error');
            }
            return;
        }

        if (currentPassword === newPassword) {
            if (window.utilsManager) {
                window.utilsManager.showToast('新密码不能与当前密码相同', 'error');
            }
            return;
        }

        try {
            const response = await this.simulatePasswordUpdate({
                currentPassword,
                newPassword,
                email: window.authCore.currentUser.email
            });
            
            if (response.success) {
                this.resetPasswordForm();
                if (window.utilsManager) {
                    window.utilsManager.showToast('密码修改成功！请重新登录', 'success');
                }
                
                setTimeout(() => {
                    if (window.authCore && typeof window.authCore.closeModal === 'function') {
                        window.authCore.closeModal('settingsModal');
                    }

                    if (window.authCore && typeof window.authCore.logout === 'function') {
                        window.authCore.logout();
                    }

                    setTimeout(() => {
                        this.openLoginModal();
                    }, 500);
                }, 1500);
            } else {
                if (window.utilsManager) {
                    window.utilsManager.showToast(response.message || '密码修改失败', 'error');
                }
            }
        } catch (error) {
            if (window.utilsManager) {
                window.utilsManager.showToast('网络错误，请稍后重试', 'error');
            }
        }
    }

    // 模拟API函数
    async simulateLogin(email, password) {
        return new Promise((resolve) => {
            setTimeout(() => {
                // 检查注册用户
                const user = window.authCore.registeredUsers.get(email);
                if (user && user.password === password) {
                    resolve({
                        success: true,
                        user: {
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            phone: user.phone,
                            avatar: user.avatar || null
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

    async simulateRegister(userData) {
        return new Promise((resolve) => {
            setTimeout(() => {
                // 检查邮箱是否已存在
                if (window.authCore.registeredUsers.has(userData.email)) {
                    resolve({
                        success: false,
                        message: '该邮箱已被注册'
                    });
                    return;
                }
                
                // 保存用户数据
                window.authCore.registeredUsers.set(userData.email, {
                    id: Date.now(),
                    name: userData.name,
                    email: userData.email,
                    phone: userData.phone,
                    password: userData.password,
                    registeredAt: new Date().toISOString()
                });
                
                // 持久化保存到localStorage
                window.authCore.saveRegisteredUsers();
                
                console.log('用户注册成功:', userData.email);
                console.log('当前注册用户:', Array.from(window.authCore.registeredUsers.keys()));
                
                resolve({
                    success: true,
                    message: '注册成功'
                });
            }, 1000);
        });
    }

    async simulateProfileUpdate(userData) {
        return new Promise((resolve) => {
            setTimeout(() => {
                // 检查新邮箱是否已被其他用户使用
                const currentUserOldEmail = window.authCore.currentUser.email;
                const existingUser = Array.from(window.authCore.registeredUsers.entries())
                    .find(([email, user]) => {
                        return email === userData.email && 
                               email !== currentUserOldEmail && 
                               user.id !== window.authCore.currentUser.id;
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

    async simulatePasswordUpdate(data) {
        return new Promise((resolve) => {
            setTimeout(() => {
                // 验证当前密码
                const currentUser = window.authCore.registeredUsers.get(data.email);
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
                    window.authCore.saveRegisteredUsers();
                    
                    console.log('用户密码已更新:', data.email);
                }
                
                resolve({
                    success: true,
                    message: '密码修改成功'
                });
            }, 1000);
        });
    }

    // 辅助方法
    openLoginModal() {
        const modal = document.getElementById('loginModal');
        modal.style.display = 'flex';
        modal.classList.add('show');
    }



    resetPasswordForm() {
        document.getElementById('currentPassword').value = '';
        document.getElementById('newPasswordSettings').value = '';
        document.getElementById('confirmNewPasswordSettings').value = '';

        const strengthIndicator = document.getElementById('newPasswordStrength');
        if (strengthIndicator) {
            strengthIndicator.className = 'password-strength';
        }
    }
}

// 导出模块
window.UserManager = UserManager;