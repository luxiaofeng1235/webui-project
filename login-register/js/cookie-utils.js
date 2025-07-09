/**
 * Cookie工具类
 * 用于管理用户登录状态的持久化存储
 */
class CookieUtils {
    /**
     * 设置Cookie
     * @param {string} name Cookie名称
     * @param {string} value Cookie值
     * @param {number} days 过期天数，默认7天
     * @param {string} path 路径，默认为根路径
     */
    static setCookie(name, value, days = 7, path = '/') {
        let expires = '';
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = '; expires=' + date.toUTCString();
        }

        // 确保值是字符串
        const cookieValue = typeof value === 'object' ? JSON.stringify(value) : String(value);

        document.cookie = `${name}=${encodeURIComponent(cookieValue)}${expires}; path=${path}; SameSite=Lax`;
    }

    /**
     * 获取Cookie
     * @param {string} name Cookie名称
     * @returns {string|null} Cookie值，如果不存在返回null
     */
    static getCookie(name) {
        if (!document.cookie) {
            return null;
        }

        const nameEQ = name + '=';
        const cookies = document.cookie.split(';');

        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i].trim();

            if (cookie.indexOf(nameEQ) === 0) {
                const encodedValue = cookie.substring(nameEQ.length);

                try {
                    const decodedValue = decodeURIComponent(encodedValue);

                    // 尝试解析JSON
                    try {
                        return JSON.parse(decodedValue);
                    } catch (jsonError) {
                        // JSON解析失败，返回原始字符串
                        return decodedValue;
                    }
                } catch (decodeError) {
                    // 解码失败，返回原始值
                    return encodedValue;
                }
            }
        }

        return null;
    }

    /**
     * 删除Cookie
     * @param {string} name Cookie名称
     * @param {string} path 路径，默认为根路径
     */
    static deleteCookie(name, path = '/') {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path};`;
    }

    /**
     * 检查Cookie是否存在
     * @param {string} name Cookie名称
     * @returns {boolean} 是否存在
     */
    static hasCookie(name) {
        return this.getCookie(name) !== null;
    }

    /**
     * 获取所有Cookie
     * @returns {Object} 所有Cookie的键值对
     */
    static getAllCookies() {
        const cookies = {};
        const ca = document.cookie.split(';');
        
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1, c.length);
            }
            
            const eqPos = c.indexOf('=');
            if (eqPos > 0) {
                const name = c.substring(0, eqPos);
                const value = decodeURIComponent(c.substring(eqPos + 1));
                
                try {
                    cookies[name] = JSON.parse(value);
                } catch (e) {
                    cookies[name] = value;
                }
            }
        }
        
        return cookies;
    }

    /**
     * 清除所有Cookie（仅限当前路径）
     */
    static clearAllCookies() {
        const cookies = this.getAllCookies();
        for (const name in cookies) {
            this.deleteCookie(name);
        }
    }
}

/**
 * 认证相关的Cookie管理
 */
class AuthCookies {
    // Cookie名称常量
    static COOKIE_NAMES = {
        TOKEN: 'authtoken',
        USER: 'userinfo',
        USERNAME: 'username',
        IS_LOGGED_IN: 'isloggedin',
        LOGIN_TIME: 'logintime'
    };

    // 默认过期时间（天）
    static DEFAULT_EXPIRES_DAYS = 7;

    /**
     * 保存登录信息到Cookie
     * @param {string} token 认证token
     * @param {Object} user 用户信息
     * @param {number} expireDays 过期天数
     */
    static saveLoginInfo(token, user, expireDays = this.DEFAULT_EXPIRES_DAYS) {
        try {
            // 保存token
            CookieUtils.setCookie(this.COOKIE_NAMES.TOKEN, token, expireDays);

            // 保存用户信息
            CookieUtils.setCookie(this.COOKIE_NAMES.USER, user, expireDays);

            // 保存用户名
            CookieUtils.setCookie(this.COOKIE_NAMES.USERNAME, user.username, expireDays);

            // 保存登录状态
            CookieUtils.setCookie(this.COOKIE_NAMES.IS_LOGGED_IN, 'true', expireDays);

            // 保存登录时间
            const loginTime = new Date().toISOString();
            CookieUtils.setCookie(this.COOKIE_NAMES.LOGIN_TIME, loginTime, expireDays);

            console.log('登录信息已保存到Cookie');
            return true;
        } catch (error) {
            console.error('保存登录信息到Cookie失败:', error);
            return false;
        }
    }

    /**
     * 从Cookie获取登录信息
     * @returns {Object|null} 登录信息对象或null
     */
    static getLoginInfo() {
        try {
            const token = CookieUtils.getCookie(this.COOKIE_NAMES.TOKEN);
            const user = CookieUtils.getCookie(this.COOKIE_NAMES.USER);
            const username = CookieUtils.getCookie(this.COOKIE_NAMES.USERNAME);
            const isLoggedIn = CookieUtils.getCookie(this.COOKIE_NAMES.IS_LOGGED_IN);
            const loginTime = CookieUtils.getCookie(this.COOKIE_NAMES.LOGIN_TIME);

            // 处理isLoggedIn可能是布尔值或字符串的情况
            const isLoggedInValid = isLoggedIn === 'true' || isLoggedIn === true;

            if (!token || !user || !isLoggedInValid) {
                return null;
            }

            return {
                token,
                user,
                username,
                isLoggedIn: isLoggedIn === 'true' || isLoggedIn === true,
                loginTime: loginTime ? new Date(loginTime) : null
            };
        } catch (error) {
            console.error('从Cookie获取登录信息失败:', error);
            return null;
        }
    }

    /**
     * 检查是否已登录
     * @returns {boolean} 是否已登录
     */
    static isLoggedIn() {
        const loginInfo = this.getLoginInfo();
        return loginInfo !== null && loginInfo.isLoggedIn;
    }

    /**
     * 获取当前用户token
     * @returns {string|null} token或null
     */
    static getToken() {
        return CookieUtils.getCookie(this.COOKIE_NAMES.TOKEN);
    }

    /**
     * 获取当前用户信息
     * @returns {Object|null} 用户信息或null
     */
    static getUser() {
        return CookieUtils.getCookie(this.COOKIE_NAMES.USER);
    }

    /**
     * 获取当前用户名
     * @returns {string|null} 用户名或null
     */
    static getUsername() {
        return CookieUtils.getCookie(this.COOKIE_NAMES.USERNAME);
    }

    /**
     * 清除登录信息
     */
    static clearLoginInfo() {
        try {
            CookieUtils.deleteCookie(this.COOKIE_NAMES.TOKEN);
            CookieUtils.deleteCookie(this.COOKIE_NAMES.USER);
            CookieUtils.deleteCookie(this.COOKIE_NAMES.USERNAME);
            CookieUtils.deleteCookie(this.COOKIE_NAMES.IS_LOGGED_IN);
            CookieUtils.deleteCookie(this.COOKIE_NAMES.LOGIN_TIME);
            
            console.log('登录信息已从Cookie中清除');
            return true;
        } catch (error) {
            console.error('清除Cookie登录信息失败:', error);
            return false;
        }
    }

    /**
     * 更新登录过期时间
     * @param {number} expireDays 新的过期天数
     */
    static refreshLoginExpiry(expireDays = this.DEFAULT_EXPIRES_DAYS) {
        const loginInfo = this.getLoginInfo();
        if (loginInfo) {
            this.saveLoginInfo(loginInfo.token, loginInfo.user, expireDays);
        }
    }

    /**
     * 检查登录是否过期
     * @param {number} maxDays 最大有效天数
     * @returns {boolean} 是否过期
     */
    static isLoginExpired(maxDays = this.DEFAULT_EXPIRES_DAYS) {
        const loginInfo = this.getLoginInfo();
        if (!loginInfo || !loginInfo.loginTime) {
            return true;
        }

        const now = new Date();
        const loginTime = new Date(loginInfo.loginTime);
        const diffDays = (now - loginTime) / (1000 * 60 * 60 * 24);

        return diffDays > maxDays;
    }

    /**
     * 迁移localStorage数据到Cookie（用于升级现有用户）
     */
    static migrateFromLocalStorage() {
        try {
            const token = localStorage.getItem('token');
            const userStr = localStorage.getItem('user');
            const username = sessionStorage.getItem('username');
            const isLoggedIn = sessionStorage.getItem('isLoggedIn');

            if (token && userStr && isLoggedIn === 'true') {
                const user = JSON.parse(userStr);
                this.saveLoginInfo(token, user);
                
                console.log('已将localStorage数据迁移到Cookie');
                return true;
            }
        } catch (error) {
            console.error('迁移localStorage数据失败:', error);
        }
        return false;
    }
}

// 导出到全局作用域
if (typeof window !== 'undefined') {
    window.CookieUtils = CookieUtils;
    window.AuthCookies = AuthCookies;
}
