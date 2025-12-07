// API Service
class APIService {
    constructor(baseURL = 'http://localhost:5000') {
        this.baseURL = baseURL;
        this.token = localStorage.getItem('admin_token');
    }

    setToken(token) {
        this.token = token;
        localStorage.setItem('admin_token', token);
    }

    getToken() {
        return this.token;
    }

    getHeaders() {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
        };
    }

    async request(method, endpoint, data = null) {
        const options = {
            method,
            headers: this.getHeaders()
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, options);
            
            if (response.status === 401) {
                this.logout();
                window.location.href = '/login';
            }

            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.error || 'API Error');
            }

            return result;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Auth endpoints
    loginAdmin(username, password) {
        return this.request('POST', '/api/auth/admin/login', { username, password });
    }

    // Config endpoints
    createConfig(configData) {
        return this.request('POST', '/api/admin/config/create', configData);
    }

    listConfigs() {
        return this.request('GET', '/api/admin/config/list');
    }

    getConfig(id) {
        return this.request('GET', `/api/admin/config/${id}`);
    }

    updateConfig(id, configData) {
        return this.request('PUT', `/api/admin/config/${id}`, configData);
    }

    deleteConfig(id) {
        return this.request('DELETE', `/api/admin/config/${id}`);
    }

    // Android app endpoints
    createAndroidApp(appData) {
        return this.request('POST', '/api/android/create', appData);
    }

    listAndroidApps() {
        return this.request('GET', '/api/android/admin/list');
    }

    getAndroidApp(appId) {
        return this.request('GET', `/api/android/${appId}`);
    }

    // User endpoints
    createAppUser(userData) {
        return this.request('POST', '/api/admin/users/create', userData);
    }

    listAppUsers(appId) {
        return this.request('GET', `/api/admin/users/app/${appId}`);
    }

    updateAppUser(userId, userData) {
        return this.request('PUT', `/api/admin/users/${userId}`, userData);
    }

    deleteAppUser(userId) {
        return this.request('DELETE', `/api/admin/users/${userId}`);
    }

    // Monitoring endpoints
    getUserActivity(userId) {
        return this.request('GET', `/api/admin/monitoring/user/${userId}`);
    }

    getAppActivity(appId) {
        return this.request('GET', `/api/admin/monitoring/app/${appId}`);
    }

    getAppStats(appId) {
        return this.request('GET', `/api/admin/monitoring/stats/app/${appId}`);
    }

    logout() {
        localStorage.removeItem('admin_token');
        this.token = null;
    }
}

const api = new APIService();
