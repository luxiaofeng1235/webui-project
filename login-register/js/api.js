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
            const fullUrl = this.baseURL + url;
            const headers = this.getAuthHeaders();

            console.log('🌐 API请求详情:');
            console.log('  URL:', fullUrl);
            console.log('  方法:', options.method || 'GET');
            console.log('  请求头:', headers);
            console.log('  请求体:', options.body);

            const response = await fetch(fullUrl, {
                headers: headers,
                ...options
            });

            console.log('📡 响应详情:');
            console.log('  状态码:', response.status);
            console.log('  状态文本:', response.statusText);
            console.log('  响应头:', Object.fromEntries(response.headers.entries()));

            const data = await response.json();
            console.log('📦 响应数据:', data);

            if (!response.ok) {
                console.error('❌ 请求失败:', {
                    status: response.status,
                    statusText: response.statusText,
                    data: data
                });
                throw new Error(data.message || `请求失败 (${response.status})`);
            }

            return data;
        } catch (error) {
            console.error('❌ API请求错误:', error);
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
        console.log('🔄 MenuItemAPI.update 被调用:');
        console.log('  ID:', id, '(类型:', typeof id, ')');
        console.log('  数据:', data);
        const url = `/api/menu-items/${id}`;
        console.log('  构造的URL:', url);
        return API.put(url, data);
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
        // 清理数据，确保没有undefined值
        const cleanData = {
            table_number: data.table_number || '',
            name: data.name || '',
            capacity: parseInt(data.capacity) || 4,
            location: data.location || '',
            status: data.status || 'available'
        };

        console.log('TableAPI.create - 原始数据:', data);
        console.log('TableAPI.create - 清理后数据:', cleanData);

        return API.post('/api/tables', cleanData);
    }

    static async update(id, data) {
        // 清理数据，确保没有undefined值
        const cleanData = {
            table_number: data.table_number || '',
            name: data.name || '',
            capacity: parseInt(data.capacity) || 4,
            location: data.location || '',
            status: data.status || 'available'
        };

        console.log('TableAPI.update - 原始数据:', data);
        console.log('TableAPI.update - 清理后数据:', cleanData);

        return API.put(`/api/tables/${id}`, cleanData);
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

// 顾客API
class CustomerAPI {
    static async getAll(page = 1, limit = 20, status = null, search = null) {
        let url = '/api/customers';
        const params = new URLSearchParams();
        params.append('page', page);
        params.append('limit', limit);
        if (status !== null) params.append('status', status);
        if (search) params.append('search', search);
        url += '?' + params.toString();
        return API.get(url);
    }

    static async getById(id) {
        return API.get(`/api/customers/${id}`);
    }

    static async updateStatus(id, status) {
        return API.patch(`/api/customers/${id}/status`, { status });
    }

    static async getStats() {
        return API.get('/api/customers/stats');
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
window.CustomerAPI = CustomerAPI;
window.SettingAPI = SettingAPI;
