// API工具类
class API {
    static baseURL = '';
    
    // 获取认证头
    static getAuthHeaders() {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        };
    }

    // 通用请求方法
    static async request(url, options = {}) {
        try {
            const response = await fetch(this.baseURL + url, {
                headers: this.getAuthHeaders(),
                ...options
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || '请求失败');
            }

            return data;
        } catch (error) {
            console.error('API请求错误:', error);
            throw error;
        }
    }

    // GET请求
    static async get(url) {
        return this.request(url, { method: 'GET' });
    }

    // POST请求
    static async post(url, data) {
        return this.request(url, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    // PUT请求
    static async put(url, data) {
        return this.request(url, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    // DELETE请求
    static async delete(url) {
        return this.request(url, { method: 'DELETE' });
    }

    // PATCH请求
    static async patch(url, data) {
        return this.request(url, {
            method: 'PATCH',
            body: JSON.stringify(data)
        });
    }
}

// 认证相关API
class AuthAPI {
    static async login(username, password) {
        return API.post('/api/auth/login', { username, password });
    }

    static async register(username, email, password, confirmPassword) {
        return API.post('/api/auth/register', { username, email, password, confirmPassword });
    }

    static async getCurrentUser() {
        return API.get('/api/auth/me');
    }
}

// 菜品分类API
class MenuCategoryAPI {
    static async getAll() {
        return API.get('/api/menu-categories');
    }

    static async getById(id) {
        return API.get(`/api/menu-categories/${id}`);
    }

    static async create(data) {
        return API.post('/api/menu-categories', data);
    }

    static async update(id, data) {
        return API.put(`/api/menu-categories/${id}`, data);
    }

    static async delete(id) {
        return API.delete(`/api/menu-categories/${id}`);
    }
}

// 菜品API
class MenuItemAPI {
    static async getAll(categoryId = null, status = null) {
        let url = '/api/menu-items';
        const params = new URLSearchParams();
        if (categoryId) params.append('category_id', categoryId);
        if (status) params.append('status', status);
        if (params.toString()) url += '?' + params.toString();
        return API.get(url);
    }

    static async getById(id) {
        return API.get(`/api/menu-items/${id}`);
    }

    static async create(data) {
        return API.post('/api/menu-items', data);
    }

    static async update(id, data) {
        return API.put(`/api/menu-items/${id}`, data);
    }

    static async delete(id) {
        return API.delete(`/api/menu-items/${id}`);
    }
}

// 桌台API
class TableAPI {
    static async getAll(status = null) {
        let url = '/api/tables';
        if (status) url += `?status=${status}`;
        return API.get(url);
    }

    static async getById(id) {
        return API.get(`/api/tables/${id}`);
    }

    static async create(data) {
        return API.post('/api/tables', data);
    }

    static async update(id, data) {
        return API.put(`/api/tables/${id}`, data);
    }

    static async delete(id) {
        return API.delete(`/api/tables/${id}`);
    }

    static async updateStatus(id, status) {
        return API.patch(`/api/tables/${id}/status`, { status });
    }
}

// 订单API
class OrderAPI {
    static async getAll(status = null, limit = 50, offset = 0) {
        let url = '/api/orders';
        const params = new URLSearchParams();
        if (status) params.append('status', status);
        params.append('limit', limit);
        params.append('offset', offset);
        url += '?' + params.toString();
        return API.get(url);
    }

    static async getById(id) {
        return API.get(`/api/orders/${id}`);
    }

    static async create(data) {
        return API.post('/api/orders', data);
    }

    static async updateStatus(id, status) {
        return API.patch(`/api/orders/${id}/status`, { status });
    }

    static async getStats() {
        return API.get('/api/orders/stats');
    }
}

// 用户API
class UserAPI {
    static async getAll(role = null, status = null) {
        let url = '/api/users';
        const params = new URLSearchParams();
        if (role) params.append('role', role);
        if (status) params.append('status', status);
        if (params.toString()) url += '?' + params.toString();
        return API.get(url);
    }

    static async getById(id) {
        return API.get(`/api/users/${id}`);
    }

    static async create(data) {
        return API.post('/api/users', data);
    }

    static async update(id, data) {
        return API.put(`/api/users/${id}`, data);
    }

    static async delete(id) {
        return API.delete(`/api/users/${id}`);
    }

    static async resetPassword(id) {
        return API.post(`/api/users/${id}/reset-password`);
    }
}

// 系统设置API
class SettingAPI {
    static async getAll() {
        return API.get('/api/settings');
    }

    static async getByKey(key) {
        return API.get(`/api/settings/${key}`);
    }

    static async update(key, value) {
        return API.put(`/api/settings/${key}`, { setting_value: value });
    }

    static async batchUpdate(settings) {
        return API.put('/api/settings', { settings });
    }
}

// 导出API类
window.API = API;
window.AuthAPI = AuthAPI;
window.MenuCategoryAPI = MenuCategoryAPI;
window.MenuItemAPI = MenuItemAPI;
window.TableAPI = TableAPI;
window.OrderAPI = OrderAPI;
window.UserAPI = UserAPI;
window.SettingAPI = SettingAPI;
