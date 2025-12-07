// Form Manager
class FormManager {
    constructor() {
        this.setupForms();
    }

    setupForms() {
        // Config form
        const configForm = document.getElementById('configForm');
        if (configForm) {
            configForm.addEventListener('submit', (e) => this.handleConfigSubmit(e));
        }

        // Android app form
        const appForm = document.getElementById('appForm');
        if (appForm) {
            appForm.addEventListener('submit', (e) => this.handleAppSubmit(e));
        }

        // User form
        const userForm = document.getElementById('userForm');
        if (userForm) {
            userForm.addEventListener('submit', (e) => this.handleUserSubmit(e));
        }
    }

    async handleConfigSubmit(e) {
        e.preventDefault();

        const formData = {
            name: document.getElementById('configName').value,
            type: document.getElementById('configType').value,
            server_address: document.getElementById('serverAddress').value,
            port: parseInt(document.getElementById('serverPort').value),
            protocol: document.getElementById('protocol').value,
            credentials: {
                username: document.getElementById('configUsername').value,
                password: document.getElementById('configPassword').value
            }
        };

        try {
            const result = await api.createConfig(formData);
            if (result.success) {
                pageManager.showNotification('تنظیم با موفقیت ایجاد شد', 'success');
                e.target.reset();
                pageManager.loadConfigs();
            }
        } catch (error) {
            pageManager.showNotification('خطا در ایجاد تنظیم: ' + error.message, 'error');
        }
    }

    async handleAppSubmit(e) {
        e.preventDefault();

        const formData = {
            config_id: document.getElementById('appConfigSelect').value,
            app_name: document.getElementById('appName').value,
            version: document.getElementById('appVersion').value
        };

        try {
            const result = await api.createAndroidApp(formData);
            if (result.success) {
                pageManager.showNotification('برنامه اندروید با موفقیت ایجاد شد', 'success');
                e.target.reset();
                pageManager.loadApps();
            }
        } catch (error) {
            pageManager.showNotification('خطا در ایجاد برنامه: ' + error.message, 'error');
        }
    }

    async handleUserSubmit(e) {
        e.preventDefault();

        const formData = {
            username: document.getElementById('userName').value,
            password: document.getElementById('userPassword').value,
            email: document.getElementById('userEmail').value,
            app_id: document.getElementById('userAppSelect').value,
            expiry_date: document.getElementById('expiryDate').value
        };

        try {
            const result = await api.createAppUser(formData);
            if (result.success) {
                pageManager.showNotification('کاربر با موفقیت ایجاد شد', 'success');
                e.target.reset();
            }
        } catch (error) {
            pageManager.showNotification('خطا در ایجاد کاربر: ' + error.message, 'error');
        }
    }
}

const formManager = new FormManager();
