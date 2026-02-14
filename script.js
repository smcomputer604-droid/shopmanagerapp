// ===============================
// SHOPFLOW ENHANCED - v5.1.0
// INSTANT SAVE + BACKGROUND SYNC
// ===============================

// Configuration
const CONFIG = {
    APP_NAME: 'ShopFlow Enhanced',
    VERSION: '5.1.0',
    STORAGE_KEY: 'shopflow_settings',
    SYNC_INTERVAL_KEY: 'shopflow_sync_interval',
    THEME_KEY: 'shopflow_theme',
    LAST_SYNC_KEY: 'shopflow_last_sync',
    SYNC_QUEUE_KEY: 'shopflow_sync_queue',
    SELECTED_DATE_KEY: 'shopflow_selected_date'
};

// Services data
const SERVICES = [
    { id: 1, name: 'Photo Print', icon: 'fas fa-image' },
    { id: 2, name: 'Photocopy', icon: 'fas fa-copy' },
    { id: 3, name: 'Document Print', icon: 'fas fa-file-alt' },
    { id: 4, name: 'Scan', icon: 'fas fa-box-tissue' },
    { id: 5, name: 'Laminating', icon: 'fas fa-layer-group' },
    { id: 6, name: 'Compose', icon: 'fas fa-edit' },
    { id: 7, name: 'Frame', icon: 'fas fa-border-all' },
    { id: 8, name: 'Mug print', icon: 'fas fa-mug-hot' },
    { id: 9, name: 'Crest', icon: 'fas fa-award' },
    { id: 10, name: 'T-shirt Print', icon: 'fas fa-tshirt' },
    { id: 11, name: 'Online Application', icon: 'fas fa-globe' },
    { id: 12, name: 'Others', icon: 'fas fa-ellipsis-h' }
];

// Application State
let state = {
    selectedService: null,
    currentCash: 0,
    googleScriptUrl: '',
    syncInterval: 0,
    syncTimer: null,
    lastSync: null,
    theme: 'light',
    activities: [],
    todaySales: 0,
    todayTransactions: 0,
    todayExpenses: 0,
    selectedSalesDate: null,
    syncQueue: [],
    isSyncing: false
};

// DOM Elements
let elements = {};

// ===============================
// INITIALIZATION
// ===============================

function initApp() {
    console.log('🚀 Initializing', CONFIG.APP_NAME, CONFIG.VERSION);
    
    // Load settings
    loadSettings();
    
    // Get DOM elements
    getDOMElements();
    
    // Apply theme
    applyTheme();
    
    // Set up event listeners
    setupEventListeners();
    
    // Initialize data
    initData();
    
    // Load services
    loadServices();
    
    // Update stats
    updateDashboardStats();
    
    // Load recent activities
    loadRecentActivities();
    
    // Setup auto-sync
    setupAutoSync();
    
    // Process sync queue on startup
    setTimeout(() => processSyncQueue(), 1000);
    
    // Show welcome notification
    setTimeout(() => {
        if (state.googleScriptUrl) {
            showNotification('Connected to Google Sheets', 'System is ready for real-time sync', 'success');
        } else {
            showNotification('Welcome to ShopFlow', 'Configure Google Sheets in Settings for cloud sync', 'info');
        }
    }, 1000);
}

// ===============================
// SETTINGS MANAGEMENT
// ===============================

function loadSettings() {
    try {
        // Load Google Sheets URL
        state.googleScriptUrl = localStorage.getItem('shopflow_google_sheets_url') || '';
        
        // Load sync interval
        state.syncInterval = parseInt(localStorage.getItem(CONFIG.SYNC_INTERVAL_KEY)) || 0;
        
        // Load theme
        state.theme = localStorage.getItem(CONFIG.THEME_KEY) || 'light';
        
        // Load last sync time
        state.lastSync = localStorage.getItem(CONFIG.LAST_SYNC_KEY);
        
        // Load selected sales date (or default to today)
        const savedDate = localStorage.getItem(CONFIG.SELECTED_DATE_KEY);
        state.selectedSalesDate = savedDate || new Date().toISOString().split('T')[0];
        
        // Load other settings
        const savedSettings = localStorage.getItem(CONFIG.STORAGE_KEY);
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            state.currentCash = settings.currentCash || 0;
        }
        
        // Load activities
        const savedActivities = localStorage.getItem('shopflow_activities');
        if (savedActivities) {
            state.activities = JSON.parse(savedActivities);
        }
        
        // Load sync queue
        const savedQueue = localStorage.getItem(CONFIG.SYNC_QUEUE_KEY);
        if (savedQueue) {
            state.syncQueue = JSON.parse(savedQueue);
        }
        
        console.log('✅ Settings loaded:', {
            connected: !!state.googleScriptUrl,
            theme: state.theme,
            syncInterval: state.syncInterval,
            queuedItems: state.syncQueue.length,
            selectedDate: state.selectedSalesDate
        });
        
    } catch (error) {
        console.error('❌ Error loading settings:', error);
        showToast('Error loading settings', 'error');
    }
}

function saveSettings() {
    if (!elements.apiUrl) return;
    
    const url = elements.apiUrl.value.trim();
    const syncInterval = parseInt(elements.syncInterval?.value) || 0;
    
    if (url && !url.includes('script.google.com')) {
        showToast('Invalid Google Apps Script URL', 'error');
        return;
    }
    
    // Save settings
    state.googleScriptUrl = url;
    state.syncInterval = syncInterval;
    
    localStorage.setItem('shopflow_google_sheets_url', url);
    localStorage.setItem(CONFIG.SYNC_INTERVAL_KEY, syncInterval);
    
    const settings = {
        currentCash: state.currentCash,
        lastUpdated: new Date().toISOString()
    };
    localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(settings));
    
    // Update sync status
    updateSyncStatus();
    
    // Setup auto-sync
    setupAutoSync();
    
    // Test connection
    if (url) {
        showLoadingOverlay('Testing connection...');
        setTimeout(async () => {
            const connected = await testConnection();
            hideLoadingOverlay();
            if (connected) {
                showNotification('Settings Saved', 'Successfully connected to Google Sheets', 'success');
                processSyncQueue(); // Process any queued items
            }
        }, 500);
    } else {
        showNotification('Settings Saved', 'Local mode enabled', 'info');
    }
    
    closeModal('settingsModal');
}

// ===============================
// DOM ELEMENTS
// ===============================

function getDOMElements() {
    // Sidebar & Navigation
    elements.sidebar = document.getElementById('sidebar');
    elements.menuToggle = document.getElementById('menuToggle');
    elements.sidebarClose = document.getElementById('sidebarClose');
    
    // Theme
    elements.themeToggle = document.getElementById('themeToggle');
    
    // Services
    elements.servicesGrid = document.getElementById('servicesGrid');
    elements.salesDate = document.getElementById('salesDate');
    
    // Modals
    elements.serviceModal = document.getElementById('serviceModal');
    elements.settingsModal = document.getElementById('settingsModal');
    elements.modalServiceName = document.getElementById('modalServiceName');
    elements.serviceAmount = document.getElementById('serviceAmount');
    elements.customerName = document.getElementById('customerName');
    elements.submitServiceBtn = document.getElementById('submitServiceBtn');
    elements.closeModalBtn = document.getElementById('closeModalBtn');
    elements.cancelServiceBtn = document.getElementById('cancelServiceBtn');
    
    // Cash
    elements.cashDate = document.getElementById('cashDate');
    elements.cashAmount = document.getElementById('cashAmount');
    elements.submitCashBtn = document.getElementById('submitCashBtn');
    elements.currentCashDisplay = document.getElementById('currentCashDisplay');
    
    // Expenses
    elements.expenseAmount = document.getElementById('expenseAmount');
    elements.expensePurpose = document.getElementById('expensePurpose');
    elements.submitExpenseBtn = document.getElementById('submitExpenseBtn');
    
    // Settings
    elements.settingsBtn = document.getElementById('settingsBtn');
    elements.closeSettingsBtn = document.getElementById('closeSettingsBtn');
    elements.apiUrl = document.getElementById('apiUrl');
    elements.syncInterval = document.getElementById('syncInterval');
    elements.saveSettingsBtn = document.getElementById('saveSettingsBtn');
    elements.testConnectionBtn = document.getElementById('testConnectionBtn');
    
    // Sync
    elements.syncBtn = document.getElementById('syncBtn');
    elements.syncStatus = document.getElementById('syncStatus');
    
    // Stats
    elements.todaySales = document.getElementById('todaySales');
    elements.todayTransactions = document.getElementById('todayTransactions');
    elements.todayProfit = document.getElementById('todayProfit');
    
    // Activities
    elements.activitiesList = document.getElementById('activitiesList');
    
    // Containers
    elements.toastContainer = document.getElementById('toastContainer');
    elements.notificationContainer = document.getElementById('notificationContainer');
    elements.loadingOverlay = document.getElementById('loadingOverlay');
    
    // Date display
    elements.currentDate = document.getElementById('currentDate');
}

// ===============================
// EVENT LISTENERS
// ===============================

function setupEventListeners() {
    // Sidebar toggle
    if (elements.menuToggle) {
        elements.menuToggle.addEventListener('click', () => {
            elements.sidebar.classList.add('active');
        });
    }
    
    if (elements.sidebarClose) {
        elements.sidebarClose.addEventListener('click', () => {
            elements.sidebar.classList.remove('active');
        });
    }
    
    // Theme toggle
    if (elements.themeToggle) {
        elements.themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Service buttons
    if (elements.submitServiceBtn) {
        elements.submitServiceBtn.addEventListener('click', submitSale);
    }
    
    if (elements.closeModalBtn) {
        elements.closeModalBtn.addEventListener('click', () => closeModal('serviceModal'));
    }
    
    if (elements.cancelServiceBtn) {
        elements.cancelServiceBtn.addEventListener('click', () => closeModal('serviceModal'));
    }
    
    // Cash
    if (elements.submitCashBtn) {
        elements.submitCashBtn.addEventListener('click', submitCash);
    }
    
    // Expenses
    if (elements.submitExpenseBtn) {
        elements.submitExpenseBtn.addEventListener('click', submitExpense);
    }
    
    // Settings
    if (elements.settingsBtn) {
        elements.settingsBtn.addEventListener('click', openSettings);
    }
    
    if (elements.closeSettingsBtn) {
        elements.closeSettingsBtn.addEventListener('click', () => closeModal('settingsModal'));
    }
    
    if (elements.saveSettingsBtn) {
        elements.saveSettingsBtn.addEventListener('click', saveSettings);
    }
    
    if (elements.testConnectionBtn) {
        elements.testConnectionBtn.addEventListener('click', async () => {
            showLoadingOverlay('Testing connection...');
            const connected = await testConnection();
            hideLoadingOverlay();
        });
    }
    
    // Sync
    if (elements.syncBtn) {
        elements.syncBtn.addEventListener('click', () => processSyncQueue());
    }
    
    // Modal overlay close
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            const modals = document.querySelectorAll('.modal-overlay.active');
            modals.forEach(modal => modal.classList.remove('active'));
        }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const modals = document.querySelectorAll('.modal-overlay.active');
            modals.forEach(modal => modal.classList.remove('active'));
        }
        
        if (e.key === 'Enter' && e.target.id === 'serviceAmount') {
            submitSale();
        }
    });
}

// ===============================
// DATA INITIALIZATION
// ===============================

function initData() {
    // Load the saved date or use today's date
    const savedDate = state.selectedSalesDate || new Date().toISOString().split('T')[0];
    
    // Set sales date to saved date
    if (elements.salesDate) {
        elements.salesDate.value = savedDate;
        
        // Add event listener to save date when changed
        elements.salesDate.addEventListener('change', function() {
            const newDate = this.value;
            state.selectedSalesDate = newDate;
            localStorage.setItem(CONFIG.SELECTED_DATE_KEY, newDate);
            console.log('📅 Date changed to:', newDate);
            showToast('Date set to: ' + new Date(newDate).toLocaleDateString('en-IN'), 'info', 2000);
        });
    }
    
    // Set cash date to today (this should always be today)
    const today = new Date().toISOString().split('T')[0];
    if (elements.cashDate) elements.cashDate.value = today;
    
    // Display current date in header
    if (elements.currentDate) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        elements.currentDate.textContent = new Date().toLocaleDateString('en-US', options);
    }
    
    // Load settings to modal
    if (elements.apiUrl) {
        elements.apiUrl.value = state.googleScriptUrl;
    }
    if (elements.syncInterval) {
        elements.syncInterval.value = state.syncInterval;
    }
    
    // Update cash display
    if (elements.currentCashDisplay) {
        elements.currentCashDisplay.textContent = formatCurrency(state.currentCash);
    }
    
    // Update sync status
    updateSyncStatus();
}

// ===============================
// SERVICES
// ===============================

function loadServices() {
    if (!elements.servicesGrid) return;
    
    let html = '';
    SERVICES.forEach(service => {
        html += `
            <div class="service-card glass-card" data-service-id="${service.id}" data-service-name="${service.name}">
                <div class="service-icon">
                    <i class="${service.icon}"></i>
                </div>
                <div class="service-name">${service.name}</div>
            </div>
        `;
    });
    
    elements.servicesGrid.innerHTML = html;
    
    // Add both click and touch listeners for mobile compatibility
    document.querySelectorAll('.service-card').forEach(card => {
        // Prevent default touch behavior
        card.style.cursor = 'pointer';
        card.style.webkitTapHighlightColor = 'rgba(102, 126, 234, 0.2)';
        
        // Touch start for visual feedback
        card.addEventListener('touchstart', (e) => {
            card.style.transform = 'scale(0.98)';
        }, { passive: true });
        
        // Touch end to reset
        card.addEventListener('touchend', (e) => {
            card.style.transform = 'scale(1)';
        }, { passive: true });
        
        // Click event for both mouse and touch
        card.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const serviceId = card.getAttribute('data-service-id');
            const serviceName = card.getAttribute('data-service-name');
            console.log('Service clicked:', serviceName); // Debug log
            openServiceModal(serviceId, serviceName);
        });
        
        // Touchend as backup for mobile
        card.addEventListener('touchend', (e) => {
            const serviceId = card.getAttribute('data-service-id');
            const serviceName = card.getAttribute('data-service-name');
            console.log('Service touched:', serviceName); // Debug log
            openServiceModal(serviceId, serviceName);
        }, { passive: false });
    });
}

function openServiceModal(serviceId, serviceName) {
    console.log('Opening modal for:', serviceName); // Debug log
    
    state.selectedService = { id: serviceId, name: serviceName };
    
    if (elements.modalServiceName) {
        elements.modalServiceName.textContent = serviceName;
    }
    
    if (elements.serviceAmount) {
        elements.serviceAmount.value = '';
        // Delay focus to prevent keyboard issues on mobile
        setTimeout(() => {
            if (window.innerWidth > 768) {
                elements.serviceAmount.focus();
            }
        }, 300);
    }
    
    if (elements.customerName) {
        elements.customerName.value = '';
    }
    
    // Prevent body scroll on mobile when modal is open
    document.body.style.overflow = 'hidden';
    document.body.classList.add('modal-open');
    
    openModal('serviceModal');
    console.log('Modal opened'); // Debug log
}

// ===============================
// SALES - INSTANT SAVE
// ===============================

function submitSale() {
    if (!state.selectedService) return;
    
    const amount = parseFloat(elements.serviceAmount?.value);
    const customer = elements.customerName?.value.trim();
    const date = elements.salesDate?.value || new Date().toISOString().split('T')[0];
    
    if (!amount || amount <= 0) {
        showToast('Please enter a valid amount', 'warning');
        return;
    }
    
    // Create sale record
    const sale = {
        id: Date.now(),
        service: state.selectedService.name,
        amount: amount,
        customer: customer || 'N/A',
        date: date,
        timestamp: new Date().toISOString()
    };
    
    // 1. SAVE TO LOCALSTORAGE INSTANTLY
    const sales = JSON.parse(localStorage.getItem('shopflow_sales') || '[]');
    sales.push(sale);
    localStorage.setItem('shopflow_sales', JSON.stringify(sales));
    
    // 2. SHOW SUCCESS IMMEDIATELY
    showToast('✓ Sale recorded', 'success', 2000);
    closeModal('serviceModal');
    
    // 3. UPDATE UI IMMEDIATELY
    addActivity('sale', `Sale: ${state.selectedService.name}`, formatCurrency(amount));
    updateDashboardStats();
    
    // 4. QUEUE FOR BACKGROUND SYNC (non-blocking)
    queueForSync('sale', sale);
    
    // Reset form
    if (elements.serviceAmount) elements.serviceAmount.value = '';
    if (elements.customerName) elements.customerName.value = '';
}

// ===============================
// CASH - INSTANT SAVE
// ===============================

function submitCash() {
    const amount = parseFloat(elements.cashAmount?.value);
    const date = elements.cashDate?.value || new Date().toISOString().split('T')[0];
    
    if (!amount || amount < 0) {
        showToast('Please enter a valid amount', 'warning');
        return;
    }
    
    // Create cash entry
    const cashEntry = {
        id: Date.now(),
        date: date,
        amount: amount,
        timestamp: new Date().toISOString()
    };
    
    // 1. SAVE TO LOCALSTORAGE INSTANTLY
    const cashEntries = JSON.parse(localStorage.getItem('shopflow_cash_entries') || '[]');
    cashEntries.push(cashEntry);
    localStorage.setItem('shopflow_cash_entries', JSON.stringify(cashEntries));
    
    // Update current cash
    state.currentCash = amount;
    const settings = {
        currentCash: amount,
        lastUpdated: new Date().toISOString()
    };
    localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(settings));
    
    // 2. SHOW SUCCESS IMMEDIATELY
    showToast('✓ Cash updated', 'success', 2000);
    
    // 3. UPDATE UI IMMEDIATELY
    if (elements.currentCashDisplay) {
        elements.currentCashDisplay.textContent = formatCurrency(amount);
    }
    addActivity('cash', 'Cash in drawer updated', formatCurrency(amount));
    
    // 4. QUEUE FOR BACKGROUND SYNC (non-blocking)
    queueForSync('cash', cashEntry);
    
    // Reset form
    if (elements.cashAmount) elements.cashAmount.value = '';
}

// ===============================
// EXPENSES - INSTANT SAVE
// ===============================

function submitExpense() {
    const amount = parseFloat(elements.expenseAmount?.value);
    const purpose = elements.expensePurpose?.value.trim();
    const date = new Date().toISOString().split('T')[0];
    
    if (!amount || amount <= 0) {
        showToast('Please enter a valid amount', 'warning');
        return;
    }
    
    if (!purpose) {
        showToast('Please enter expense purpose', 'warning');
        return;
    }
    
    // Create expense record
    const expense = {
        id: Date.now(),
        date: date,
        amount: amount,
        purpose: purpose,
        timestamp: new Date().toISOString()
    };
    
    // 1. SAVE TO LOCALSTORAGE INSTANTLY
    const expenses = JSON.parse(localStorage.getItem('shopflow_expenses') || '[]');
    expenses.push(expense);
    localStorage.setItem('shopflow_expenses', JSON.stringify(expenses));
    
    // 2. SHOW SUCCESS IMMEDIATELY
    showToast('✓ Expense recorded', 'success', 2000);
    
    // 3. UPDATE UI IMMEDIATELY
    addActivity('expense', `Expense: ${purpose}`, formatCurrency(amount));
    updateDashboardStats();
    
    // 4. QUEUE FOR BACKGROUND SYNC (non-blocking)
    queueForSync('expense', expense);
    
    // Reset form
    if (elements.expenseAmount) elements.expenseAmount.value = '';
    if (elements.expensePurpose) elements.expensePurpose.value = '';
}

// ===============================
// BACKGROUND SYNC QUEUE
// ===============================

function queueForSync(type, data) {
    const queueItem = {
        type: type,
        data: data,
        timestamp: new Date().toISOString(),
        attempts: 0
    };
    
    state.syncQueue.push(queueItem);
    localStorage.setItem(CONFIG.SYNC_QUEUE_KEY, JSON.stringify(state.syncQueue));
    
    // Try to sync immediately in background (non-blocking)
    if (state.googleScriptUrl && !state.isSyncing) {
        setTimeout(() => processSyncQueue(), 100);
    }
}

async function processSyncQueue() {
    if (!state.googleScriptUrl) {
        console.log('⚠️ No Google Sheets URL configured');
        showToast('Configure Google Sheets in Settings', 'info');
        return;
    }
    
    if (state.syncQueue.length === 0) {
        console.log('✓ Sync queue is empty');
        updateSyncStatus('connected');
        return;
    }
    
    if (state.isSyncing) {
        console.log('⏳ Already syncing...');
        return;
    }
    
    state.isSyncing = true;
    updateSyncStatus('syncing');
    
    const totalItems = state.syncQueue.length;
    console.log(`📤 Processing ${totalItems} queued items...`);
    
    const failedItems = [];
    let successCount = 0;
    
    for (let i = 0; i < state.syncQueue.length; i++) {
        const item = state.syncQueue[i];
        
        console.log(`Syncing ${i + 1}/${totalItems}:`, item.type, item.data);
        
        try {
            const success = await syncItemToGoogleSheets(item);
            
            if (success) {
                successCount++;
                console.log(`✅ ${i + 1}/${totalItems} synced`);
            } else {
                item.attempts++;
                if (item.attempts < 3) {
                    failedItems.push(item);
                    console.log(`⚠️ ${i + 1}/${totalItems} failed (attempt ${item.attempts})`);
                } else {
                    console.error(`❌ ${i + 1}/${totalItems} max attempts reached`);
                }
            }
        } catch (error) {
            console.error(`❌ Sync error for ${i + 1}/${totalItems}:`, error);
            item.attempts++;
            if (item.attempts < 3) {
                failedItems.push(item);
            }
        }
    }
    
    // Update queue with failed items
    state.syncQueue = failedItems;
    localStorage.setItem(CONFIG.SYNC_QUEUE_KEY, JSON.stringify(state.syncQueue));
    
    state.isSyncing = false;
    
    // Show results
    if (failedItems.length === 0) {
        console.log(`✅ All ${successCount} items synced successfully`);
        showToast(`✓ Synced ${successCount} items`, 'success');
        state.lastSync = new Date().toISOString();
        localStorage.setItem(CONFIG.LAST_SYNC_KEY, state.lastSync);
        updateSyncStatus('connected');
    } else {
        console.log(`⚠️ ${successCount} synced, ${failedItems.length} failed`);
        showToast(`${successCount} synced, ${failedItems.length} pending`, 'warning');
        updateSyncStatus('error');
    }
}

async function syncItemToGoogleSheets(item) {
    if (!state.googleScriptUrl) return false;
    
    try {
        let method = '';
        let params = {};
        
        // Map item type to Google Apps Script method
        switch (item.type) {
            case 'sale':
                method = 'addSale';
                params = {
                    method: method,
                    date: item.data.date,
                    service: item.data.service,
                    amount: item.data.amount,
                    customer: item.data.customer
                };
                break;
            case 'cash':
                method = 'addCash';
                params = {
                    method: method,
                    date: item.data.date,
                    amount: item.data.amount
                };
                break;
            case 'expense':
                method = 'addExpense';
                params = {
                    method: method,
                    date: item.data.date,
                    amount: item.data.amount,
                    purpose: item.data.purpose
                };
                break;
            default:
                console.error('Unknown sync type:', item.type);
                return false;
        }
        
        // Build URL with parameters
        const url = new URL(state.googleScriptUrl);
        Object.keys(params).forEach(key => {
            url.searchParams.append(key, params[key]);
        });
        
        const response = await fetch(url.toString(), {
            method: 'GET',
            redirect: 'follow'
        });
        
        // Try to read response if possible
        if (response.ok) {
            try {
                const result = await response.json();
                console.log('✅ Sync success:', result);
                return result.success === true;
            } catch (e) {
                // If we can't parse JSON, but got OK response, assume success
                console.log('✅ Sync completed (no JSON response)');
                return true;
            }
        } else {
            console.error('❌ Sync failed with status:', response.status);
            return false;
        }
    } catch (error) {
        console.error('❌ Sync failed for item:', item, error);
        return false;
    }
}

// ===============================
// SYNC MANAGEMENT
// ===============================

function setupAutoSync() {
    // Clear existing timer
    if (state.syncTimer) {
        clearInterval(state.syncTimer);
        state.syncTimer = null;
    }
    
    // Setup new timer if interval is set
    if (state.syncInterval > 0) {
        state.syncTimer = setInterval(() => {
            processSyncQueue();
        }, state.syncInterval);
        
        console.log(`⏱️ Auto-sync enabled: every ${state.syncInterval / 1000}s`);
    }
}

async function testConnection() {
    if (!state.googleScriptUrl) {
        showToast('Please enter Google Sheets URL first', 'warning');
        return false;
    }
    
    try {
        const url = new URL(state.googleScriptUrl);
        url.searchParams.append('method', 'test');
        
        const response = await fetch(url.toString(), {
            method: 'GET',
            redirect: 'follow'
        });
        
        if (response.ok) {
            const result = await response.json();
            if (result.success) {
                showToast('✓ Connection successful!', 'success');
                updateSyncStatus('connected');
                return true;
            }
        }
        
        showToast('Connection failed. Check URL.', 'error');
        updateSyncStatus('disconnected');
        return false;
    } catch (error) {
        console.error('Connection test failed:', error);
        showToast('Connection failed. Check URL.', 'error');
        updateSyncStatus('disconnected');
        return false;
    }
}

function updateSyncStatus(status) {
    if (!elements.syncStatus) return;
    
    const icon = elements.syncStatus.querySelector('i');
    const text = elements.syncStatus.querySelector('span');
    
    if (!status) {
        status = state.googleScriptUrl ? 'connected' : 'disconnected';
    }
    
    const queueCount = state.syncQueue.length;
    
    switch (status) {
        case 'connected':
            icon.className = 'fas fa-circle';
            icon.style.color = '#10b981';
            text.textContent = queueCount > 0 ? `${queueCount} pending` : 'Synced';
            break;
        case 'syncing':
            icon.className = 'fas fa-circle';
            icon.style.color = '#f59e0b';
            text.textContent = 'Syncing...';
            break;
        case 'error':
            icon.className = 'fas fa-circle';
            icon.style.color = '#ef4444';
            text.textContent = `${queueCount} failed`;
            break;
        case 'disconnected':
        default:
            icon.className = 'fas fa-circle';
            icon.style.color = '#6b7280';
            text.textContent = 'Not Connected';
            break;
    }
}

// ===============================
// DASHBOARD STATS
// ===============================

function updateDashboardStats() {
    const today = new Date().toISOString().split('T')[0];
    
    // Get today's sales
    const sales = JSON.parse(localStorage.getItem('shopflow_sales') || '[]');
    const todaySales = sales.filter(s => s.date === today);
    
    const totalSales = todaySales.reduce((sum, sale) => sum + sale.amount, 0);
    const totalTransactions = todaySales.length;
    
    // Get today's expenses
    const expenses = JSON.parse(localStorage.getItem('shopflow_expenses') || '[]');
    const todayExpenses = expenses.filter(e => e.date === today);
    const totalExpenses = todayExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    
    // Update UI
    if (elements.todaySales) {
        elements.todaySales.textContent = formatCurrency(totalSales);
    }
    
    if (elements.todayTransactions) {
        elements.todayTransactions.textContent = totalTransactions;
    }
    
    if (elements.todayProfit) {
        const profit = totalSales - totalExpenses;
        elements.todayProfit.textContent = formatCurrency(profit);
    }
    
    state.todaySales = totalSales;
    state.todayTransactions = totalTransactions;
    state.todayExpenses = totalExpenses;
}

// ===============================
// ACTIVITIES
// ===============================

function addActivity(type, message, detail = '') {
    const activity = {
        type: type,
        message: message,
        detail: detail,
        timestamp: new Date().toISOString()
    };
    
    state.activities.unshift(activity);
    
    // Keep only last 50 activities
    if (state.activities.length > 50) {
        state.activities = state.activities.slice(0, 50);
    }
    
    // Save to localStorage
    localStorage.setItem('shopflow_activities', JSON.stringify(state.activities));
    
    // Update UI
    loadRecentActivities();
}

function loadRecentActivities() {
    if (!elements.activitiesList) return;
    
    const recentActivities = state.activities.slice(0, 5);
    
    if (recentActivities.length === 0) {
        elements.activitiesList.innerHTML = `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="fas fa-info-circle"></i>
                </div>
                <div class="activity-content">
                    <p>No recent activities</p>
                    <small>Start by making a sale or recording an expense</small>
                </div>
            </div>
        `;
        return;
    }
    
    let html = '';
    
    recentActivities.forEach(activity => {
        const icon = getActivityIcon(activity.type);
        const timeAgo = formatTimeAgo(activity.timestamp);
        
        html += `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="${icon}"></i>
                </div>
                <div class="activity-content">
                    <p>${activity.message}</p>
                    <small>${timeAgo}${activity.detail ? ' • ' + activity.detail : ''}</small>
                </div>
            </div>
        `;
    });
    
    elements.activitiesList.innerHTML = html;
}

function getActivityIcon(type) {
    const icons = {
        sale: 'fas fa-dollar-sign',
        cash: 'fas fa-wallet',
        expense: 'fas fa-receipt',
        sync: 'fas fa-sync-alt',
        setting: 'fas fa-cog'
    };
    return icons[type] || 'fas fa-circle';
}

// ===============================
// THEME MANAGEMENT
// ===============================

function toggleTheme() {
    state.theme = state.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem(CONFIG.THEME_KEY, state.theme);
    applyTheme();
    
    showToast(`${state.theme === 'dark' ? 'Dark' : 'Light'} mode enabled`, 'info');
}

function applyTheme() {
    document.documentElement.setAttribute('data-theme', state.theme);
    
    if (elements.themeToggle) {
        const icon = elements.themeToggle.querySelector('i');
        const text = elements.themeToggle.querySelector('span');
        
        if (state.theme === 'dark') {
            icon.className = 'fas fa-sun';
            text.textContent = 'Light Mode';
        } else {
            icon.className = 'fas fa-moon';
            text.textContent = 'Dark Mode';
        }
    }
}

// ===============================
// MODALS
// ===============================

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        // Restore body scroll
        document.body.style.overflow = '';
        document.body.classList.remove('modal-open');
    }
}

function openSettings() {
    openModal('settingsModal');
}

// ===============================
// NOTIFICATIONS
// ===============================

function showNotification(title, message, type = 'info') {
    if (!elements.notificationContainer) return;
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="fas ${icons[type]}"></i>
        </div>
        <div class="notification-content">
            <h4>${title}</h4>
            <p>${message}</p>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.remove();
    });
    
    elements.notificationContainer.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100px)';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

function showToast(message, type = 'info', duration = 3000) {
    if (!elements.toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    
    toast.innerHTML = `
        <i class="fas ${icons[type]}"></i>
        <span>${message}</span>
    `;
    
    elements.toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, duration);
}

// ===============================
// LOADING OVERLAY
// ===============================

function showLoadingOverlay(message = 'Loading...') {
    if (!elements.loadingOverlay) return;
    
    const text = elements.loadingOverlay.querySelector('p');
    if (text) text.textContent = message;
    
    elements.loadingOverlay.classList.add('active');
}

function hideLoadingOverlay() {
    if (!elements.loadingOverlay) return;
    elements.loadingOverlay.classList.remove('active');
}

// ===============================
// UTILITY FUNCTIONS
// ===============================

function formatCurrency(amount) {
    return '৳' + formatNumber(amount);
}

function formatNumber(num) {
    return parseFloat(num).toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function formatTimeAgo(timestamp) {
    const now = new Date();
    const then = new Date(timestamp);
    const seconds = Math.floor((now - then) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return Math.floor(seconds / 60) + ' min ago';
    if (seconds < 86400) return Math.floor(seconds / 3600) + ' hr ago';
    if (seconds < 2592000) return Math.floor(seconds / 86400) + ' days ago';
    return then.toLocaleDateString();
}

// ===============================
// START APPLICATION
// ===============================

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, starting ShopFlow Enhanced...');
    initApp();
});

// Debug helper
window.shopflowDebug = {
    getState: () => state,
    clearData: () => {
        if (confirm('Clear all local data?')) {
            localStorage.clear();
            location.reload();
        }
    },
    testConnection: testConnection,
    syncQueue: () => processSyncQueue(),
    viewQueue: () => state.syncQueue
};
