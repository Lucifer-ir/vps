// Page Manager
class PageManager {
    constructor() {
        this.currentPage = 'dashboard';
    }

    init() {
        this.setupEventListeners();
        this.loadPage('dashboard');
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.currentTarget.getAttribute('data-page');
                this.loadPage(page);
            });
        });

        // Theme toggle
        document.getElementById('themeToggle')?.addEventListener('click', () => {
            document.documentElement.classList.toggle('dark');
            localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
        });

        // Logout
        document.getElementById('logoutBtn')?.addEventListener('click', () => {
            api.logout();
            window.location.href = '/login';
        });

        // Mobile menu
        document.getElementById('menuToggle')?.addEventListener('click', () => {
            const sidebar = document.getElementById('sidebar');
            sidebar.classList.toggle('-translate-x-full');
        });
    }

    loadPage(page) {
        this.currentPage = page;

        // Hide all pages
        document.querySelectorAll('[data-page-content]').forEach(el => {
            el.classList.add('hidden');
        });

        // Update nav
        document.querySelectorAll('.nav-item').forEach(el => {
            el.classList.remove('bg-gray-100', 'dark:bg-gray-700');
        });
        document.querySelector(`[data-page="${page}"]`)?.classList.add('bg-gray-100', 'dark:bg-gray-700');

        // Show selected page
        const pageContent = document.querySelector(`[data-page-content="${page}"]`);
        if (pageContent) {
            pageContent.classList.remove('hidden');
            
            // Load page-specific data
            if (page === 'dashboard') {
                this.loadDashboard();
            } else if (page === 'configs') {
                this.loadConfigs();
            } else if (page === 'apps') {
                this.loadApps();
            } else if (page === 'users') {
                this.loadUsers();
            } else if (page === 'monitoring') {
                this.loadMonitoring();
            }
        }
    }

    async loadDashboard() {
        try {
            const configs = await api.listConfigs();
            const apps = await api.listAndroidApps();
            
            const configCount = configs.configs?.length || 0;
            const appCount = apps.apps?.length || 0;

            document.getElementById('configCount').textContent = configCount;
            document.getElementById('appCount').textContent = appCount;

        } catch (error) {
            console.error('Error loading dashboard:', error);
            this.showNotification('خطا در بارگزاری داشبورد', 'error');
        }
    }

    async loadConfigs() {
        try {
            const result = await api.listConfigs();
            this.displayConfigs(result.configs || []);
        } catch (error) {
            console.error('Error loading configs:', error);
            this.showNotification('خطا در بارگزاری تنظیمات', 'error');
        }
    }

    displayConfigs(configs) {
        const container = document.getElementById('configsList');
        if (!container) return;

        container.innerHTML = configs.map(config => `
            <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <h3 class="font-semibold text-lg">${config.name}</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                    ${config.type} - ${config.server_address}:${config.port}
                </p>
                <div class="mt-4 flex gap-2">
                    <button class="btn btn-small" onclick="pageManager.editConfig('${config.id}')">ویرایش</button>
                    <button class="btn btn-small btn-danger" onclick="pageManager.deleteConfig('${config.id}')">حذف</button>
                </div>
            </div>
        `).join('');
    }

    async loadApps() {
        try {
            const result = await api.listAndroidApps();
            this.displayApps(result.apps || []);
        } catch (error) {
            console.error('Error loading apps:', error);
            this.showNotification('خطا در بارگزاری برنامه‌ها', 'error');
        }
    }

    displayApps(apps) {
        const container = document.getElementById('appsList');
        if (!container) return;

        container.innerHTML = apps.map(app => `
            <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <h3 class="font-semibold text-lg">${app.app_name}</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">نسخه: ${app.version}</p>
                <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">تنظیم: ${app.config_name}</p>
                <div class="mt-4 flex gap-2">
                    <a href="${app.download_url}" class="btn btn-small" download>دانلود APK</a>
                    <button class="btn btn-small" onclick="pageManager.editApp('${app.id}')">ویرایش</button>
                </div>
            </div>
        `).join('');
    }

    async loadUsers() {
        const appSelect = document.getElementById('userAppSelect');
        if (appSelect) {
            try {
                const result = await api.listAndroidApps();
                appSelect.innerHTML = (result.apps || []).map(app => 
                    `<option value="${app.id}">${app.app_name}</option>`
                ).join('');
            } catch (error) {
                console.error('Error loading apps:', error);
            }
        }
    }

    async loadMonitoring() {
        try {
            const result = await api.listAndroidApps();
            const appSelect = document.getElementById('monitoringAppSelect');
            
            if (appSelect) {
                appSelect.innerHTML = (result.apps || []).map(app => 
                    `<option value="${app.id}">${app.app_name}</option>`
                ).join('');
                
                // Load first app's data
                if (result.apps && result.apps.length > 0) {
                    this.loadAppMonitoring(result.apps[0].id);
                }
            }
        } catch (error) {
            console.error('Error loading monitoring:', error);
        }
    }

    async loadAppMonitoring(appId) {
        try {
            const activity = await api.getAppActivity(appId);
            this.displayMonitoring(activity.activities || []);
        } catch (error) {
            console.error('Error loading monitoring data:', error);
        }
    }

    displayMonitoring(activities) {
        const container = document.getElementById('monitoringTable');
        if (!container) return;

        const html = `
            <table class="w-full text-sm">
                <thead class="bg-gray-100 dark:bg-gray-700">
                    <tr>
                        <th class="px-4 py-2 text-right">نام کاربری</th>
                        <th class="px-4 py-2 text-right">دامنه</th>
                        <th class="px-4 py-2 text-right">برنامه</th>
                        <th class="px-4 py-2 text-right">زمان اتصال</th>
                        <th class="px-4 py-2 text-right">وضعیت</th>
                    </tr>
                </thead>
                <tbody>
                    ${activities.map(activity => `
                        <tr class="border-b border-gray-200 dark:border-gray-700">
                            <td class="px-4 py-2">${activity.username}</td>
                            <td class="px-4 py-2">${activity.domain}</td>
                            <td class="px-4 py-2">${activity.application || '-'}</td>
                            <td class="px-4 py-2">${new Date(activity.connection_time).toLocaleString('fa-IR')}</td>
                            <td class="px-4 py-2">
                                <span class="px-2 py-1 rounded text-xs ${activity.status === 'active' ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-800'}">
                                    ${activity.status === 'active' ? 'فعال' : 'غیرفعال'}
                                </span>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        
        container.innerHTML = html;
    }

    async deleteConfig(configId) {
        if (!confirm('آیا مطمئن هستید؟')) return;
        
        try {
            await api.deleteConfig(configId);
            this.showNotification('تنظیم با موفقیت حذف شد', 'success');
            this.loadConfigs();
        } catch (error) {
            this.showNotification('خطا در حذف تنظیم', 'error');
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 px-4 py-3 rounded-lg text-white z-50 ${
            type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500'
        }`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => notification.remove(), 3000);
    }
}

const pageManager = new PageManager();
