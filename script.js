/**
 * FINOVA - Premium AI Finance Dashboard
 * Vanilla JavaScript Core Application
 * Architecture:
 * - State Management (LocalStorage with fallback to realistic demo data)
 * - Currency & Formatting Engine
 * - Dynamic Chart.js Integration
 * - View & Modal Routing
 * - Real-time Filtering, Search & Sorting
 * - Micro-interactions, Number Counters & Toast System
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. DEFAULT DEMO DATA
  // =========================================================================

  const DEMO_TRANSACTIONS = [
    {
      id: 'tx-1',
      name: 'Salary Deposit',
      type: 'INCOME',
      amount: 4250.00,
      category: 'Other',
      date: '2026-09-12',
      paymentMethod: 'Bank Transfer',
      notes: 'Monthly corporate base pay'
    },
    {
      id: 'tx-2',
      name: 'Whole Foods Market',
      type: 'EXPENSE',
      amount: 142.50,
      category: 'Food',
      date: '2026-09-11',
      paymentMethod: 'Credit Card',
      notes: 'Organic groceries & weekly essentials'
    },
    {
      id: 'tx-3',
      name: 'Netflix Premium',
      type: 'EXPENSE',
      amount: 19.99,
      category: 'Entertainment',
      date: '2026-09-10',
      paymentMethod: 'Credit Card',
      notes: 'Monthly 4K streaming plan'
    },
    {
      id: 'tx-4',
      name: 'Grocery Store',
      type: 'EXPENSE',
      amount: 85.40,
      category: 'Food',
      date: '2026-09-09',
      paymentMethod: 'Debit Card',
      notes: 'Midweek provisions'
    },
    {
      id: 'tx-5',
      name: 'Freelance Design Consulting',
      type: 'INCOME',
      amount: 2500.00,
      category: 'Other',
      date: '2026-09-08',
      paymentMethod: 'Bank Transfer',
      notes: 'Fintech UI system deliverable'
    },
    {
      id: 'tx-6',
      name: 'Uber Ride',
      type: 'EXPENSE',
      amount: 24.50,
      category: 'Transport',
      date: '2026-09-07',
      paymentMethod: 'Credit Card',
      notes: 'Downtown client meeting'
    },
    {
      id: 'tx-7',
      name: 'Amazon Electronics',
      type: 'EXPENSE',
      amount: 120.00,
      category: 'Shopping',
      date: '2026-09-06',
      paymentMethod: 'Credit Card',
      notes: 'Ergonomic mouse & desk cable organizers'
    },
    {
      id: 'tx-8',
      name: 'Apartment Utilities & Power',
      type: 'EXPENSE',
      amount: 285.00,
      category: 'Bills',
      date: '2026-09-05',
      paymentMethod: 'Bank Transfer',
      notes: 'High-speed fiber & electric utility'
    },
    {
      id: 'tx-9',
      name: 'Fitness Club Membership',
      type: 'EXPENSE',
      amount: 95.00,
      category: 'Health',
      date: '2026-09-04',
      paymentMethod: 'Credit Card',
      notes: 'Gym access & recovery pool pass'
    },
    {
      id: 'tx-10',
      name: 'Apple Services & iCloud',
      type: 'EXPENSE',
      amount: 14.99,
      category: 'Bills',
      date: '2026-09-03',
      paymentMethod: 'Credit Card',
      notes: '2TB Cloud backup subscription'
    },
    {
      id: 'tx-11',
      name: 'O`Reilly Book Subscription',
      type: 'EXPENSE',
      amount: 49.00,
      category: 'Education',
      date: '2026-09-02',
      paymentMethod: 'Credit Card',
      notes: 'Engineering technical library access'
    },
    {
      id: 'tx-12',
      name: 'Dividend Payout',
      type: 'INCOME',
      amount: 1700.00,
      category: 'Other',
      date: '2026-09-01',
      paymentMethod: 'Bank Transfer',
      notes: 'Q3 Index Fund distributions'
    }
  ];

  const DEMO_BUDGETS = [
    { category: 'Food', budget: 800, spent: 620, icon: '🍔' },
    { category: 'Shopping', budget: 600, spent: 480, icon: '🛍' },
    { category: 'Transport', budget: 500, spent: 310, icon: '🚗' },
    { category: 'Bills', budget: 600, spent: 540, icon: '🏠' },
    { category: 'Entertainment', budget: 400, spent: 240, icon: '🎬' },
    { category: 'Health', budget: 300, spent: 180, icon: '💊' }
  ];

  const DEMO_GOALS = [
    {
      id: 'goal-1',
      name: 'New Laptop',
      current: 1850,
      target: 2500,
      icon: '💻'
    },
    {
      id: 'goal-2',
      name: 'Vacation Trip',
      current: 2400,
      target: 4000,
      icon: '✈️'
    },
    {
      id: 'goal-3',
      name: 'Emergency Fund',
      current: 6500,
      target: 10000,
      icon: '🛡️'
    }
  ];

  const CURRENCY_MAP = {
    USD: { symbol: '$', rate: 1.0, position: 'before' },
    EUR: { symbol: '€', rate: 0.92, position: 'before' },
    GBP: { symbol: '£', rate: 0.78, position: 'before' },
    INR: { symbol: '₹', rate: 83.5, position: 'before' },
    PKR: { symbol: 'Rs ', rate: 278.0, position: 'before' }
  };

  const CATEGORY_META = {
    Food: { emoji: '🍔', color: '#f59e0b', light: 'rgba(245, 158, 11, 0.15)' },
    Shopping: { emoji: '🛍', color: '#ec4899', light: 'rgba(236, 72, 153, 0.15)' },
    Transport: { emoji: '🚗', color: '#3b82f6', light: 'rgba(59, 130, 246, 0.15)' },
    Bills: { emoji: '🏠', color: '#8b5cf6', light: 'rgba(139, 92, 246, 0.15)' },
    Entertainment: { emoji: '🎬', color: '#06b6d4', light: 'rgba(6, 182, 212, 0.15)' },
    Health: { emoji: '💊', color: '#10b981', light: 'rgba(16, 185, 129, 0.15)' },
    Education: { emoji: '📚', color: '#6366f1', light: 'rgba(99, 102, 241, 0.15)' },
    Other: { emoji: '📦', color: '#64748b', light: 'rgba(100, 116, 139, 0.15)' }
  };

  // =========================================================================
  // 2. STATE OBJECT
  // =========================================================================

  const state = {
    transactions: [],
    budgets: [],
    goals: [],
    currency: 'USD',
    theme: 'dark',
    activeView: 'dashboard',
    profile: {
      name: 'Alex Morgan',
      email: 'alex.morgan@finova.ai'
    },
    preferences: {
      darkMode: true,
      notifications: true,
      customCursor: true
    },
    timeframe: '30d',
    analyticsTimeframe: '30d',
    chartInstance: null,
    analyticsCharts: {
      cashFlow: null,
      category: null,
      spendingTrend: null,
      savingsGrowth: null
    },
    filter: {
      search: '',
      type: 'ALL',
      category: 'ALL',
      sort: 'newest'
    }
  };

  // =========================================================================
  // 3. STORAGE & INITIALIZATION
  // =========================================================================

  function loadData() {
    try {
      const savedTx = localStorage.getItem('finova_transactions');
      state.transactions = savedTx ? JSON.parse(savedTx) : JSON.parse(JSON.stringify(DEMO_TRANSACTIONS));

      const savedBudgets = localStorage.getItem('finova_budgets');
      state.budgets = savedBudgets ? JSON.parse(savedBudgets) : JSON.parse(JSON.stringify(DEMO_BUDGETS));

      const savedGoals = localStorage.getItem('finova_goals');
      state.goals = savedGoals ? JSON.parse(savedGoals) : JSON.parse(JSON.stringify(DEMO_GOALS));

      const savedTheme = localStorage.getItem('finova_theme');
      if (savedTheme) state.theme = savedTheme;

      const savedCurrency = localStorage.getItem('finova_currency');
      if (savedCurrency && CURRENCY_MAP[savedCurrency]) state.currency = savedCurrency;

      const savedProfile = localStorage.getItem('finova_profile');
      if (savedProfile) state.profile = JSON.parse(savedProfile);

      const savedPrefs = localStorage.getItem('finova_preferences');
      if (savedPrefs) state.preferences = JSON.parse(savedPrefs);
    } catch (e) {
      console.warn('Error reading from localStorage, fallback to default demo data', e);
      state.transactions = JSON.parse(JSON.stringify(DEMO_TRANSACTIONS));
      state.budgets = JSON.parse(JSON.stringify(DEMO_BUDGETS));
      state.goals = JSON.parse(JSON.stringify(DEMO_GOALS));
    }
  }

  function saveData() {
    try {
      localStorage.setItem('finova_transactions', JSON.stringify(state.transactions));
      localStorage.setItem('finova_budgets', JSON.stringify(state.budgets));
      localStorage.setItem('finova_goals', JSON.stringify(state.goals));
      localStorage.setItem('finova_theme', state.theme);
      localStorage.setItem('finova_currency', state.currency);
      localStorage.setItem('finova_profile', JSON.stringify(state.profile));
      localStorage.setItem('finova_preferences', JSON.stringify(state.preferences));
    } catch (e) {
      console.error('Error saving to localStorage', e);
    }
  }

  // =========================================================================
  // 4. CURRENCY FORMATTING
  // =========================================================================

  function formatMoney(amount, showSign = false) {
    const curr = CURRENCY_MAP[state.currency] || CURRENCY_MAP.USD;
    const converted = amount * curr.rate;
    const formatted = Math.abs(converted).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    let sign = '';
    if (showSign) {
      sign = amount >= 0 ? '+' : '-';
    }

    return `${sign}${curr.symbol}${formatted}`;
  }

  function getCurrencySymbol() {
    return (CURRENCY_MAP[state.currency] || CURRENCY_MAP.USD).symbol;
  }

  function updateCurrencyUI() {
    const sym = getCurrencySymbol();
    document.getElementById('currentCurrencySymbol').textContent = sym;
    document.getElementById('currentCurrencyCode').textContent = state.currency;

    // Update form labels showing currency symbol
    document.querySelectorAll('.formCurrencySymbol').forEach(el => {
      el.textContent = sym;
    });

    // Mark active item in dropdown
    document.querySelectorAll('.currency-option').forEach(opt => {
      if (opt.dataset.currency === state.currency) {
        opt.classList.add('active');
        if (!opt.querySelector('.fa-check')) {
          const check = document.createElement('i');
          check.className = 'fa-solid fa-check';
          opt.appendChild(check);
        }
      } else {
        opt.classList.remove('active');
        const check = opt.querySelector('.fa-check');
        if (check) check.remove();
      }
    });

    // Update settings select
    const settingsCurrency = document.getElementById('settingsCurrencySelect');
    if (settingsCurrency) settingsCurrency.value = state.currency;
  }

  // =========================================================================
  // 5. STATS CALCULATION
  // =========================================================================

  function calculateTotals() {
    let income = 0;
    let expenses = 0;

    state.transactions.forEach(t => {
      const amt = parseFloat(t.amount) || 0;
      if (t.type === 'INCOME') {
        income += amt;
      } else {
        expenses += amt;
      }
    });

    // Base liquid savings and initial balance anchor
    const savings = Math.max(0, income - expenses);
    const totalBalance = 24680.50 + (income - 8450.00) - (expenses - 3280.40);

    return {
      totalBalance: Math.max(0, totalBalance),
      income,
      expenses,
      savings,
      savingsRate: income > 0 ? ((savings / income) * 100).toFixed(1) : '0.0'
    };
  }

  // =========================================================================
  // 6. ANIMATED NUMBER COUNTERS
  // =========================================================================

  function animateCounter(elementId, targetValue, isCurrency = true) {
    const el = document.getElementById(elementId);
    if (!el) return;

    const curr = CURRENCY_MAP[state.currency] || CURRENCY_MAP.USD;
    const finalVal = isCurrency ? targetValue * curr.rate : targetValue;
    const duration = 800; // ms
    const startTime = performance.now();

    function update(time) {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentVal = finalVal * eased;

      if (isCurrency) {
        el.textContent = `${curr.symbol}${currentVal.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}`;
      } else {
        el.textContent = currentVal.toFixed(1);
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  // =========================================================================
  // 7. TOAST NOTIFICATIONS
  // =========================================================================

  function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    let iconClass = 'fa-solid fa-check';
    if (type === 'error') iconClass = 'fa-solid fa-circle-exclamation';
    if (type === 'info') iconClass = 'fa-solid fa-circle-info';

    toast.innerHTML = `
      <div class="toast-icon">
        <i class="${iconClass}"></i>
      </div>
      <div class="toast-content">${message}</div>
      <button class="toast-close-btn" aria-label="Close notification">
        <i class="fa-solid fa-xmark"></i>
      </button>
      <div class="toast-progress"></div>
    `;

    container.appendChild(toast);

    const closeBtn = toast.querySelector('.toast-close-btn');
    const dismiss = () => {
      toast.classList.add('toast-hide');
      setTimeout(() => {
        if (toast.parentNode) toast.remove();
      }, 300);
    };

    closeBtn.addEventListener('click', dismiss);
    setTimeout(dismiss, 3500);
  }

  // =========================================================================
  // 8. RENDER RECENT & FULL TRANSACTIONS
  // =========================================================================

  function renderTransactions() {
    const recentTableBody = document.getElementById('recentTransactionsTableBody');
    const recentMobileList = document.getElementById('recentTransactionsMobileList');
    const fullTableBody = document.getElementById('fullTransactionsTableBody');
    const fullMobileList = document.getElementById('fullTransactionsMobileList');
    const emptyState = document.getElementById('txEmptyState');

    // 1. Filter and sort for the full list
    let filtered = [...state.transactions];

    if (state.filter.search) {
      const q = state.filter.search.toLowerCase();
      filtered = filtered.filter(t => 
        (t.name && t.name.toLowerCase().includes(q)) ||
        (t.category && t.category.toLowerCase().includes(q)) ||
        (t.paymentMethod && t.paymentMethod.toLowerCase().includes(q)) ||
        (t.notes && t.notes.toLowerCase().includes(q))
      );
    }

    if (state.filter.type !== 'ALL') {
      filtered = filtered.filter(t => t.type === state.filter.type);
    }

    if (state.filter.category !== 'ALL') {
      filtered = filtered.filter(t => t.category === state.filter.category);
    }

    // Sort
    if (state.filter.sort === 'newest') {
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (state.filter.sort === 'oldest') {
      filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (state.filter.sort === 'highest') {
      filtered.sort((a, b) => b.amount - a.amount);
    } else if (state.filter.sort === 'lowest') {
      filtered.sort((a, b) => a.amount - b.amount);
    }

    // 2. Render Recent 5
    const recentItems = [...state.transactions]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);

    if (recentTableBody) {
      recentTableBody.innerHTML = recentItems.map(t => createTableRowHTML(t)).join('');
    }
    if (recentMobileList) {
      recentMobileList.innerHTML = recentItems.map(t => createMobileCardHTML(t)).join('');
    }

    // 3. Render Full Table
    if (fullTableBody && fullMobileList) {
      if (filtered.length === 0) {
        fullTableBody.innerHTML = '';
        fullMobileList.innerHTML = '';
        if (emptyState) emptyState.style.display = 'flex';
      } else {
        if (emptyState) emptyState.style.display = 'none';
        fullTableBody.innerHTML = filtered.map(t => createTableRowHTML(t, true)).join('');
        fullMobileList.innerHTML = filtered.map(t => createMobileCardHTML(t)).join('');
      }
    }

    // Reattach row dropdown handlers
    attachTxActionHandlers();
  }

  function createTableRowHTML(t, showNotes = false) {
    const meta = CATEGORY_META[t.category] || CATEGORY_META.Other;
    const isIncome = t.type === 'INCOME';
    const amountStr = (isIncome ? '+' : '-') + formatMoney(t.amount);
    const amountClass = isIncome ? 'income' : 'expense';

    return `
      <tr class="transaction-row" data-id="${t.id}">
        <td>
          <div class="tx-name-cell">
            <div class="tx-icon-badge" style="background: ${meta.light}; color: ${meta.color};">
              ${meta.emoji}
            </div>
            <div class="tx-title-wrap">
              <span class="tx-title">${escapeHTML(t.name)}</span>
              <span class="tx-category-sub">${escapeHTML(t.category)}</span>
            </div>
          </div>
        </td>
        <td>
          <span class="tx-badge">${escapeHTML(t.category)}</span>
        </td>
        <td>${formatDate(t.date)}</td>
        <td>
          <span style="font-size: 0.82rem; color: var(--text-secondary);">
            <i class="fa-regular fa-credit-card" style="margin-right: 5px; opacity: 0.7;"></i>
            ${escapeHTML(t.paymentMethod || 'Credit Card')}
          </span>
        </td>
        ${showNotes ? `<td><span style="font-size: 0.8rem; color: var(--text-muted); max-width: 180px; display: inline-block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escapeHTML(t.notes || '—')}</span></td>` : ''}
        <td style="text-align: right;">
          <span class="tx-amount ${amountClass}">${amountStr}</span>
        </td>
        <td class="tx-action-cell">
          <button class="btn-icon-more" data-action-id="${t.id}" aria-label="Transaction options">
            <i class="fa-solid fa-ellipsis-vertical"></i>
          </button>
          <div class="tx-dropdown-menu" id="dropdown-${t.id}">
            <div class="tx-dropdown-item edit-item" data-id="${t.id}">
              <i class="fa-regular fa-pen-to-square"></i> Edit
            </div>
            <div class="tx-dropdown-item delete-item" data-id="${t.id}">
              <i class="fa-regular fa-trash-can"></i> Delete
            </div>
          </div>
        </td>
      </tr>
    `;
  }

  function createMobileCardHTML(t) {
    const meta = CATEGORY_META[t.category] || CATEGORY_META.Other;
    const isIncome = t.type === 'INCOME';
    const amountStr = (isIncome ? '+' : '-') + formatMoney(t.amount);
    const amountClass = isIncome ? 'income' : 'expense';

    return `
      <div class="mobile-tx-card" data-id="${t.id}">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div class="tx-icon-badge" style="background: ${meta.light}; color: ${meta.color};">
            ${meta.emoji}
          </div>
          <div>
            <div style="font-weight: 600; font-size: 0.92rem;">${escapeHTML(t.name)}</div>
            <div style="font-size: 0.76rem; color: var(--text-muted);">${formatDate(t.date)} • ${escapeHTML(t.paymentMethod || 'Card')}</div>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 10px;">
          <span class="tx-amount ${amountClass}" style="font-size: 0.95rem;">${amountStr}</span>
          <div class="tx-action-cell">
            <button class="btn-icon-more" data-action-id="${t.id}" aria-label="Transaction options">
              <i class="fa-solid fa-ellipsis-vertical"></i>
            </button>
            <div class="tx-dropdown-menu" id="dropdown-mobile-${t.id}">
              <div class="tx-dropdown-item edit-item" data-id="${t.id}">
                <i class="fa-regular fa-pen-to-square"></i> Edit
              </div>
              <div class="tx-dropdown-item delete-item" data-id="${t.id}">
                <i class="fa-regular fa-trash-can"></i> Delete
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function attachTxActionHandlers() {
    // Close other dropdowns on window click
    document.querySelectorAll('.btn-icon-more').forEach(btn => {
      btn.onclick = function (e) {
        e.stopPropagation();
        const id = this.dataset.actionId;
        const currentMenu = document.getElementById(`dropdown-${id}`) || document.getElementById(`dropdown-mobile-${id}`);
        
        // Hide other open dropdowns
        document.querySelectorAll('.tx-dropdown-menu.show').forEach(m => {
          if (m !== currentMenu) m.classList.remove('show');
        });

        if (currentMenu) {
          currentMenu.classList.toggle('show');
        }
      };
    });

    // Edit action
    document.querySelectorAll('.tx-dropdown-item.edit-item').forEach(item => {
      item.onclick = function (e) {
        e.stopPropagation();
        const id = this.dataset.id;
        openEditTransactionModal(id);
        document.querySelectorAll('.tx-dropdown-menu.show').forEach(m => m.classList.remove('show'));
      };
    });

    // Delete action (immediate without modal as required by prompt #12)
    document.querySelectorAll('.tx-dropdown-item.delete-item').forEach(item => {
      item.onclick = function (e) {
        e.stopPropagation();
        const id = this.dataset.id;
        deleteTransaction(id);
        document.querySelectorAll('.tx-dropdown-menu.show').forEach(m => m.classList.remove('show'));
      };
    });
  }

  // Close menus when clicking outside
  window.addEventListener('click', () => {
    document.querySelectorAll('.tx-dropdown-menu.show').forEach(m => m.classList.remove('show'));
    const notif = document.getElementById('notificationsPanel');
    if (notif) notif.classList.remove('show');
    const curr = document.getElementById('currencyMenu');
    if (curr) curr.classList.remove('show');
  });

  // =========================================================================
  // 9. TRANSACTION CRUD LOGIC
  // =========================================================================

  function addTransaction(txData) {
    const newTx = {
      id: 'tx-' + Date.now(),
      name: txData.name,
      amount: parseFloat(txData.amount) || 0,
      type: txData.type,
      category: txData.category,
      date: txData.date || new Date().toISOString().split('T')[0],
      paymentMethod: txData.paymentMethod || 'Credit Card',
      notes: txData.notes || ''
    };

    state.transactions.unshift(newTx);
    saveData();
    updateDashboard();
    showToast('Transaction added successfully.', 'success');
  }

  function editTransaction(id, updatedData) {
    const idx = state.transactions.findIndex(t => t.id === id);
    if (idx !== -1) {
      state.transactions[idx] = {
        ...state.transactions[idx],
        name: updatedData.name,
        amount: parseFloat(updatedData.amount) || 0,
        type: updatedData.type,
        category: updatedData.category,
        date: updatedData.date,
        paymentMethod: updatedData.paymentMethod,
        notes: updatedData.notes
      };

      saveData();
      updateDashboard();
      showToast('Transaction updated successfully.', 'success');
    }
  }

  function deleteTransaction(id) {
    state.transactions = state.transactions.filter(t => t.id !== id);
    saveData();
    updateDashboard();
    showToast('Transaction deleted successfully.', 'error');
  }

  // =========================================================================
  // 10. CATEGORY BREAKDOWN & BUDGETS
  // =========================================================================

  function updateCategories() {
    const listEl = document.getElementById('categoryProgressList');
    if (!listEl) return;

    // Sum expenses by category
    const catTotals = {};
    let totalExpense = 0;

    Object.keys(CATEGORY_META).forEach(cat => catTotals[cat] = 0);

    state.transactions.forEach(t => {
      if (t.type === 'EXPENSE') {
        const amt = parseFloat(t.amount) || 0;
        catTotals[t.category] = (catTotals[t.category] || 0) + amt;
        totalExpense += amt;
      }
    });

    // Sort categories by expenditure
    const sorted = Object.keys(catTotals)
      .filter(cat => catTotals[cat] > 0 || ['Food', 'Shopping', 'Transport', 'Bills'].includes(cat))
      .sort((a, b) => catTotals[b] - catTotals[a]);

    listEl.innerHTML = sorted.map(cat => {
      const amt = catTotals[cat] || 0;
      const pct = totalExpense > 0 ? Math.round((amt / totalExpense) * 100) : 0;
      const meta = CATEGORY_META[cat] || CATEGORY_META.Other;

      return `
        <div class="category-row">
          <div class="category-info-row">
            <div class="category-left">
              <span class="category-emoji-badge">${meta.emoji}</span>
              <span class="category-name">${cat}</span>
            </div>
            <div class="category-right">
              <span class="category-amount">${formatMoney(amt)}</span>
              <span class="category-percentage">${pct}%</span>
            </div>
          </div>
          <div class="progress-bar-track">
            <div class="progress-bar-fill" style="background: ${meta.color}; width: ${pct}%;"></div>
          </div>
        </div>
      `;
    }).join('');
  }

  function updateBudgets() {
    const dashboardList = document.getElementById('dashboardBudgetList');
    const fullList = document.getElementById('fullBudgetsList');

    // Dynamically calculate spent amounts based on current transactions
    const catTotals = {};
    state.transactions.forEach(t => {
      if (t.type === 'EXPENSE') {
        catTotals[t.category] = (catTotals[t.category] || 0) + parseFloat(t.amount);
      }
    });

    const renderedHTML = state.budgets.map(b => {
      const spent = catTotals[b.category] !== undefined ? catTotals[b.category] : b.spent;
      const pct = Math.min(100, Math.round((spent / b.budget) * 100));
      const remaining = Math.max(0, b.budget - spent);

      let alertTag = `<span class="budget-tag-alert good">On Track</span>`;
      let barColor = 'var(--income)';

      if (pct >= 100) {
        alertTag = `<span class="budget-tag-alert danger">Exceeded</span>`;
        barColor = 'var(--expense)';
      } else if (pct >= 80) {
        alertTag = `<span class="budget-tag-alert warning">Warning 80%+</span>`;
        barColor = 'var(--warning)';
      }

      return `
        <div class="budget-card-item">
          <div class="budget-header-row">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 1.1rem;">${b.icon || '🏷️'}</span>
              <span style="font-weight: 600; font-size: 0.92rem;">${b.category}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              ${alertTag}
              <button class="btn-budget-item-edit" data-category="${b.category}" title="Adjust budget for ${b.category}">
                <i class="fa-solid fa-pen-to-square"></i>
              </button>
            </div>
          </div>
          <div class="budget-amounts-row">
            <div>
              <span class="budget-spent-txt">${formatMoney(spent)}</span>
              <span class="budget-limit-txt"> / ${formatMoney(b.budget)}</span>
            </div>
            <span style="font-size: 0.8rem; font-weight: 600; color: var(--text-muted);">${pct}%</span>
          </div>
          <div class="progress-bar-track" style="height: 8px;">
            <div class="progress-bar-fill" style="background: ${barColor}; width: ${pct}%;"></div>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 0.74rem; color: var(--text-muted);">
            <span>${pct >= 100 ? 'Over limit by ' + formatMoney(spent - b.budget) : 'Remaining: ' + formatMoney(remaining)}</span>
            <span>Monthly limit</span>
          </div>
        </div>
      `;
    }).join('');

    if (dashboardList) dashboardList.innerHTML = renderedHTML;
    if (fullList) fullList.innerHTML = renderedHTML;

    // Attach click handlers to budget item edit buttons
    document.querySelectorAll('.btn-budget-item-edit').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        openBudgetModal(btn.dataset.category);
      });
    });
  }

  function updateGoals() {
    const dashboardList = document.getElementById('dashboardGoalsList');
    const fullList = document.getElementById('fullGoalsList');

    const renderedHTML = state.goals.map(g => {
      const pct = Math.min(100, Math.round((g.current / g.target) * 100));
      // Radius 24 -> Circumference = 2 * PI * 24 ≈ 150.796
      const radius = 24;
      const circumference = 2 * Math.PI * radius;
      const offset = circumference - (pct / 100) * circumference;

      return `
        <div class="goal-card-item" data-goal-id="${g.id}">
          <div class="goal-left">
            <div class="goal-icon-wrap">${g.icon || '🎯'}</div>
            <div>
              <div class="goal-title">${escapeHTML(g.name)}</div>
              <div class="goal-amounts">${formatMoney(g.current)} of ${formatMoney(g.target)}</div>
            </div>
          </div>
          <div class="goal-circle-progress">
            <svg viewBox="0 0 60 60">
              <circle class="goal-circle-bg" cx="30" cy="30" r="${radius}" />
              <circle class="goal-circle-bar" cx="30" cy="30" r="${radius}" 
                style="stroke-dasharray: ${circumference}; stroke-dashoffset: ${offset};" />
            </svg>
            <div class="goal-percentage-txt">${pct}%</div>
          </div>
        </div>
      `;
    }).join('');

    if (dashboardList) dashboardList.innerHTML = renderedHTML;
    if (fullList) fullList.innerHTML = renderedHTML;
  }

  // =========================================================================
  // 11. CHART.JS INTEGRATION (INCOME VS EXPENSES & ANALYTICS)
  // =========================================================================

  function initMainChart() {
    const canvas = document.getElementById('incomeExpenseChart');
    if (!canvas) return;

    if (state.chartInstance) {
      state.chartInstance.destroy();
    }

    const ctx = canvas.getContext('2d');

    // Dynamic gradient fills
    const isDark = state.theme === 'dark';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';
    const textColor = isDark ? '#94a3b8' : '#64748b';

    const incomeGrad = ctx.createLinearGradient(0, 0, 0, 300);
    incomeGrad.addColorStop(0, 'rgba(16, 185, 129, 0.35)');
    incomeGrad.addColorStop(1, 'rgba(16, 185, 129, 0.0)');

    const expenseGrad = ctx.createLinearGradient(0, 0, 0, 300);
    expenseGrad.addColorStop(0, 'rgba(244, 63, 94, 0.35)');
    expenseGrad.addColorStop(1, 'rgba(244, 63, 94, 0.0)');

    const chartData = generateChartDataForTimeframe(state.timeframe);

    state.chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: chartData.labels,
        datasets: [
          {
            label: 'Income',
            data: chartData.income,
            borderColor: '#10b981',
            backgroundColor: incomeGrad,
            borderWidth: 2.5,
            fill: true,
            tension: 0.42,
            pointBackgroundColor: '#10b981',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 1.5,
            pointRadius: 3,
            pointHoverRadius: 6
          },
          {
            label: 'Expenses',
            data: chartData.expenses,
            borderColor: '#f43f5e',
            backgroundColor: expenseGrad,
            borderWidth: 2.5,
            fill: true,
            tension: 0.42,
            pointBackgroundColor: '#f43f5e',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 1.5,
            pointRadius: 3,
            pointHoverRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 900,
          easing: 'easeOutQuart'
        },
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
            align: 'end',
            labels: {
              boxWidth: 10,
              boxHeight: 10,
              usePointStyle: true,
              color: textColor,
              font: { family: 'Inter', size: 12, weight: '500' }
            }
          },
          tooltip: {
            backgroundColor: isDark ? 'rgba(15, 20, 32, 0.95)' : 'rgba(255, 255, 255, 0.95)',
            titleColor: isDark ? '#ffffff' : '#0f172a',
            bodyColor: isDark ? '#cbd5e1' : '#334155',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
            borderWidth: 1,
            padding: 12,
            boxPadding: 6,
            usePointStyle: true,
            callbacks: {
              label: function (ctx) {
                return ` ${ctx.dataset.label}: ${formatMoney(ctx.parsed.y)}`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: { color: gridColor, drawBorder: false },
            ticks: { color: textColor, font: { family: 'Inter', size: 11 } }
          },
          y: {
            grid: { color: gridColor, drawBorder: false },
            ticks: {
              color: textColor,
              font: { family: 'Inter', size: 11 },
              callback: function (val) {
                return (CURRENCY_MAP[state.currency] || CURRENCY_MAP.USD).symbol + val;
              }
            }
          }
        }
      }
    });
  }

  function generateChartDataForTimeframe(range) {
    if (range === '7d') {
      return {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        income: [350, 420, 1500, 300, 600, 250, 400],
        expenses: [120, 240, 310, 180, 520, 380, 190]
      };
    } else if (range === '6m') {
      return {
        labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
        income: [7200, 7800, 8100, 8000, 8300, 8450],
        expenses: [3100, 3400, 3250, 3600, 3150, 3280]
      };
    } else if (range === '1y') {
      return {
        labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
        income: [6800, 7100, 9400, 7300, 7600, 7900, 7800, 8100, 8000, 8200, 8350, 8450],
        expenses: [3200, 3500, 4800, 3100, 3050, 3300, 3200, 3400, 3300, 3500, 3200, 3280]
      };
    } else {
      // 30 Days default
      return {
        labels: ['Day 1', 'Day 5', 'Day 10', 'Day 15', 'Day 20', 'Day 25', 'Day 30'],
        income: [1200, 1800, 4250, 2200, 1600, 3100, 2500],
        expenses: [320, 650, 480, 740, 520, 890, 420]
      };
    }
  }

  function initAnalyticsCharts() {
    const isDark = state.theme === 'dark';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';
    const textColor = isDark ? '#94a3b8' : '#64748b';
    const range = state.analyticsTimeframe || '30d';

    let cashFlowLabels = ['May', 'Jun', 'Jul', 'Aug', 'Sep'];
    let cashFlowIncome = [7800, 8100, 8000, 8300, 8450];
    let cashFlowExpense = [3400, 3250, 3600, 3150, 3280];
    let trendLabels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    let trendData = [820, 940, 680, 840];
    let savingsLabels = ['May', 'Jun', 'Jul', 'Aug', 'Sep'];
    let savingsData = [16800, 18900, 21200, 23100, 24680.50];

    if (range === '6m') {
      cashFlowLabels = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
      cashFlowIncome = [7200, 7800, 8100, 8000, 8300, 8450];
      cashFlowExpense = [3100, 3400, 3250, 3600, 3150, 3280];
      trendLabels = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
      trendData = [3100, 3400, 3250, 3600, 3150, 3280];
      savingsLabels = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
      savingsData = [14200, 16800, 18900, 21200, 23100, 24680.50];
    } else if (range === '1y') {
      cashFlowLabels = ['Q4 Prev', 'Q1', 'Q2', 'Q3', 'Q4'];
      cashFlowIncome = [22000, 23400, 24100, 24800, 25350];
      cashFlowExpense = [9400, 9800, 10100, 9700, 9840];
      trendLabels = ['Q4 Prev', 'Q1', 'Q2', 'Q3', 'Q4'];
      trendData = [9400, 9800, 10100, 9700, 9840];
      savingsLabels = ['Oct', 'Dec', 'Feb', 'Apr', 'Jun', 'Aug', 'Sep'];
      savingsData = [10500, 12800, 14200, 16800, 19500, 22400, 24680.50];
    }

    // 1. Cash Flow Bar Chart
    const cashFlowEl = document.getElementById('analyticsCashFlowChart');
    if (cashFlowEl) {
      if (state.analyticsCharts.cashFlow) state.analyticsCharts.cashFlow.destroy();
      state.analyticsCharts.cashFlow = new Chart(cashFlowEl.getContext('2d'), {
        type: 'bar',
        data: {
          labels: cashFlowLabels,
          datasets: [
            {
              label: 'Income',
              data: cashFlowIncome,
              backgroundColor: 'rgba(16, 185, 129, 0.85)',
              borderRadius: 6
            },
            {
              label: 'Expenses',
              data: cashFlowExpense,
              backgroundColor: 'rgba(244, 63, 94, 0.85)',
              borderRadius: 6
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { labels: { color: textColor } }
          },
          scales: {
            x: { grid: { color: gridColor }, ticks: { color: textColor } },
            y: { grid: { color: gridColor }, ticks: { color: textColor } }
          }
        }
      });
    }

    // 2. Category Distribution Doughnut Chart
    const catEl = document.getElementById('analyticsCategoryChart');
    if (catEl) {
      if (state.analyticsCharts.category) state.analyticsCharts.category.destroy();
      state.analyticsCharts.category = new Chart(catEl.getContext('2d'), {
        type: 'doughnut',
        data: {
          labels: ['Food', 'Shopping', 'Transport', 'Bills', 'Entertainment', 'Health'],
          datasets: [
            {
              data: [620, 480, 310, 540, 240, 180],
              backgroundColor: [
                '#f59e0b',
                '#ec4899',
                '#3b82f6',
                '#8b5cf6',
                '#06b6d4',
                '#10b981'
              ],
              borderWidth: 2,
              borderColor: isDark ? '#131927' : '#ffffff'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'right', labels: { color: textColor, boxWidth: 12 } }
          },
          cutout: '70%'
        }
      });
    }

    // 3. Monthly Spending Trend Line Chart
    const spendTrendEl = document.getElementById('analyticsSpendingTrendChart');
    if (spendTrendEl) {
      if (state.analyticsCharts.spendingTrend) state.analyticsCharts.spendingTrend.destroy();
      state.analyticsCharts.spendingTrend = new Chart(spendTrendEl.getContext('2d'), {
        type: 'line',
        data: {
          labels: trendLabels,
          datasets: [
            {
              label: 'Outflow',
              data: trendData,
              borderColor: '#8b5cf6',
              backgroundColor: 'rgba(139, 92, 246, 0.15)',
              fill: true,
              tension: 0.35,
              borderWidth: 2.5
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { color: gridColor }, ticks: { color: textColor } },
            y: { grid: { color: gridColor }, ticks: { color: textColor } }
          }
        }
      });
    }

    // 4. Cumulative Savings Growth Area Chart
    const savingsEl = document.getElementById('analyticsSavingsGrowthChart');
    if (savingsEl) {
      if (state.analyticsCharts.savingsGrowth) state.analyticsCharts.savingsGrowth.destroy();
      state.analyticsCharts.savingsGrowth = new Chart(savingsEl.getContext('2d'), {
        type: 'line',
        data: {
          labels: savingsLabels,
          datasets: [
            {
              label: 'Total Liquid Reserves',
              data: savingsData,
              borderColor: '#38bdf8',
              backgroundColor: 'rgba(56, 189, 248, 0.18)',
              fill: true,
              tension: 0.4,
              borderWidth: 2.5
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { color: gridColor }, ticks: { color: textColor } },
            y: { grid: { color: gridColor }, ticks: { color: textColor } }
          }
        }
      });
    }
  }

  // =========================================================================
  // 12. FULL DASHBOARD REFRESH
  // =========================================================================

  function updateDashboard() {
    const totals = calculateTotals();

    // 1. Update Financial Summary Cards
    animateCounter('statTotalBalance', totals.totalBalance);
    animateCounter('statIncome', totals.income);
    animateCounter('statExpenses', totals.expenses);
    animateCounter('statSavings', totals.savings);

    // Update KPIs in Analytics view
    const kpiInc = document.getElementById('kpiTotalIncome');
    if (kpiInc) kpiInc.textContent = formatMoney(totals.income);
    const kpiExp = document.getElementById('kpiTotalExpenses');
    if (kpiExp) kpiExp.textContent = formatMoney(totals.expenses);
    const kpiRate = document.getElementById('kpiSavingsRate');
    if (kpiRate) kpiRate.textContent = `${totals.savingsRate}%`;

    // 2. Render Transactions
    renderTransactions();

    // 3. Update Categories & Progress Bars
    updateCategories();

    // 4. Update Budgets & Goals
    updateBudgets();
    updateGoals();

    // 5. Update Charts
    initMainChart();
    if (state.activeView === 'analytics') {
      initAnalyticsCharts();
    }
  }

  // =========================================================================
  // 13. VIEW NAVIGATION ROUTER
  // =========================================================================

  function switchView(viewName) {
    state.activeView = viewName;

    // Update active nav items in sidebar
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
      if (item.dataset.view === viewName) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Update visible view section
    document.querySelectorAll('.view-section').forEach(sec => {
      sec.classList.remove('active-view');
    });

    const target = document.getElementById(`view-${viewName}`);
    if (target) {
      target.classList.add('active-view');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Close mobile sidebar if open
    closeMobileSidebar();

    // Trigger charts layout update when viewing analytics
    if (viewName === 'analytics') {
      setTimeout(initAnalyticsCharts, 100);
    } else if (viewName === 'dashboard') {
      setTimeout(initMainChart, 100);
    }
  }

  // =========================================================================
  // 14. MODAL CONTROLS
  // =========================================================================

  let activeTxType = 'EXPENSE';

  function openAddTransactionModal() {
    const modal = document.getElementById('transactionModal');
    const form = document.getElementById('transactionForm');
    document.getElementById('modalTitle').textContent = 'Add Transaction';
    document.getElementById('modalSubmitBtn').textContent = 'Add Transaction';
    document.getElementById('editTxId').value = '';
    form.reset();

    // Set today's date
    document.getElementById('txInputDate').value = new Date().toISOString().split('T')[0];

    // Default to EXPENSE
    setModalTxType('EXPENSE');

    modal.classList.add('show');
    document.getElementById('txInputName').focus();
  }

  function openEditTransactionModal(id) {
    const tx = state.transactions.find(t => t.id === id);
    if (!tx) return;

    const modal = document.getElementById('transactionModal');
    document.getElementById('modalTitle').textContent = 'Edit Transaction';
    document.getElementById('modalSubmitBtn').textContent = 'Save Changes';
    document.getElementById('editTxId').value = tx.id;

    document.getElementById('txInputName').value = tx.name;
    document.getElementById('txInputAmount').value = tx.amount;
    document.getElementById('txInputDate').value = tx.date;
    document.getElementById('txInputCategory').value = tx.category;
    document.getElementById('txInputPaymentMethod').value = tx.paymentMethod || 'Credit Card';
    document.getElementById('txInputNotes').value = tx.notes || '';

    setModalTxType(tx.type);

    modal.classList.add('show');
  }

  function closeTransactionModal() {
    const modal = document.getElementById('transactionModal');
    modal.classList.remove('show');
  }

  function setModalTxType(type) {
    activeTxType = type;
    const expenseBtn = document.querySelector('.type-toggle-btn[data-tx-type="EXPENSE"]');
    const incomeBtn = document.querySelector('.type-toggle-btn[data-tx-type="INCOME"]');

    if (type === 'EXPENSE') {
      expenseBtn.classList.add('active', 'expense');
      incomeBtn.classList.remove('active', 'income');
    } else {
      incomeBtn.classList.add('active', 'income');
      expenseBtn.classList.remove('active', 'expense');
    }
  }

  // Savings Goal Modal
  function openGoalModal() {
    const modal = document.getElementById('goalModal');
    const form = document.getElementById('goalForm');
    form.reset();
    modal.classList.add('show');
    document.getElementById('goalInputName').focus();
  }

  function closeGoalModal() {
    document.getElementById('goalModal').classList.remove('show');
  }

  // Adjust Budget Modal
  function openBudgetModal(category = '') {
    const modal = document.getElementById('budgetModal');
    if (!modal) return;
    const catSelect = document.getElementById('budgetCategorySelect');
    const limitInput = document.getElementById('budgetLimitInput');
    
    if (category && catSelect) {
      catSelect.value = category;
    }
    const currentCat = catSelect ? catSelect.value : 'Food';
    const existing = state.budgets.find(b => b.category === currentCat);
    if (existing && limitInput) {
      limitInput.value = existing.budget;
    } else if (limitInput) {
      limitInput.value = 500;
    }
    modal.classList.add('show');
    if (limitInput) limitInput.focus();
  }

  function closeBudgetModal() {
    const modal = document.getElementById('budgetModal');
    if (modal) modal.classList.remove('show');
  }

  // =========================================================================
  // 15. THEME & CURRENCY TOGGLES
  // =========================================================================

  function toggleTheme() {
    const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    showToast(`Switched to ${nextTheme} theme`, 'info');
  }

  function setTheme(theme) {
    state.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    
    // Update theme icon
    const themeIcon = document.getElementById('themeIcon');
    if (themeIcon) {
      themeIcon.className = theme === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
    }

    // Update settings toggle switch
    const settingsToggle = document.getElementById('settingsDarkModeToggle');
    if (settingsToggle) settingsToggle.checked = (theme === 'dark');

    saveData();
    // Re-render charts with updated theme colors
    setTimeout(() => {
      initMainChart();
      if (state.activeView === 'analytics') initAnalyticsCharts();
    }, 150);
  }

  function changeCurrency(currCode) {
    if (!CURRENCY_MAP[currCode]) return;
    state.currency = currCode;
    saveData();
    updateCurrencyUI();
    updateDashboard();
    showToast(`Currency changed to ${currCode} (${getCurrencySymbol()})`, 'info');
  }

  // =========================================================================
  // 16. MOBILE SIDEBAR
  // =========================================================================

  function openMobileSidebar() {
    document.getElementById('sidebar').classList.add('open');
    document.getElementById('sidebarBackdrop').classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileSidebar() {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('sidebarBackdrop').classList.remove('active');
    document.body.style.overflow = '';
  }

  // =========================================================================
  // 17. AI INSIGHTS GENERATOR & REVEAL EFFECT
  // =========================================================================

  const AI_INSIGHT_MESSAGES = [
    "You're spending 18% less on dining this month. If you maintain this trend, you could save approximately $420 more this month.",
    "Your utility bills are 12% lower than average due to optimized seasonal heating adjustments.",
    "Emergency fund reserves reached 65% of your recommended 6-month buffer. Great financial momentum!",
    "Weekend leisure spending detected at $280. Transferring $100 to index savings will balance your month-end cash flow.",
    "Consolidating three recurring media subscriptions could return $36.00/month directly into liquid investments."
  ];

  function runAiInsightGenerator() {
    const el = document.getElementById('aiHeroMessage');
    if (!el) return;

    el.style.opacity = '0.3';
    el.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Analyzing multi-vector spending patterns...';

    setTimeout(() => {
      const randomMsg = AI_INSIGHT_MESSAGES[Math.floor(Math.random() * AI_INSIGHT_MESSAGES.length)];
      typewriterReveal(el, randomMsg);
      document.getElementById('aiInsightTimestamp').textContent = 'Refreshed just now';
      showToast('AI analysis regenerated with current data.', 'info');
    }, 700);
  }

  function typewriterReveal(element, text) {
    element.innerHTML = '';
    element.style.opacity = '1';
    let i = 0;
    const speed = 18; // ms per char

    function type() {
      if (i < text.length) {
        element.innerHTML += text.charAt(i);
        i++;
        setTimeout(type, speed);
      }
    }
    type();
  }

  // =========================================================================
  // 18. CUSTOM CURSOR (DESKTOP)
  // =========================================================================

  function initCustomCursor() {
    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    if (!dot || !ring) return;

    const touchQuery = window.matchMedia('(hover: none), (pointer: coarse)');
    if (!state.preferences.customCursor || touchQuery.matches) {
      dot.style.display = 'none';
      ring.style.display = 'none';
      return;
    }

    touchQuery.addEventListener('change', e => {
      if (e.matches || !state.preferences.customCursor) {
        dot.style.display = 'none';
        ring.style.display = 'none';
      } else {
        dot.style.display = '';
        ring.style.display = '';
      }
    });

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    window.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    });

    function renderRing() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      requestAnimationFrame(renderRing);
    }
    requestAnimationFrame(renderRing);

    // Expand on hoverable elements
    const hoverTargets = 'button, a, input, select, .fin-card, .tx-dropdown-item';
    document.addEventListener('mouseover', e => {
      if (e.target.closest(hoverTargets)) {
        ring.classList.add('cursor-hover');
      }
    });
    document.addEventListener('mouseout', e => {
      if (e.target.closest(hoverTargets)) {
        ring.classList.remove('cursor-hover');
      }
    });
  }

  // =========================================================================
  // 19. BUTTON RIPPLE EFFECT
  // =========================================================================

  function initRippleEffect() {
    document.addEventListener('click', e => {
      const btn = e.target.closest('.btn-primary-gradient, .btn-secondary, .btn-ai-view');
      if (!btn) return;

      const circle = document.createElement('span');
      const diameter = Math.max(btn.clientWidth, btn.clientHeight);
      const radius = diameter / 2;
      const rect = btn.getBoundingClientRect();

      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${e.clientX - rect.left - radius}px`;
      circle.style.top = `${e.clientY - rect.top - radius}px`;
      circle.classList.add('ripple');

      const existingRipple = btn.getElementsByClassName('ripple')[0];
      if (existingRipple) existingRipple.remove();

      btn.appendChild(circle);
    });
  }

  // =========================================================================
  // 20. QUICK SEARCH (CTRL+K / SEARCH MODAL)
  // =========================================================================

  function openQuickSearch() {
    const modal = document.getElementById('quickSearchModal');
    const input = document.getElementById('quickSearchModalInput');
    modal.classList.add('show');
    input.value = '';
    renderQuickSearchResults('');
    setTimeout(() => input.focus(), 50);
  }

  function closeQuickSearch() {
    document.getElementById('quickSearchModal').classList.remove('show');
  }

  function renderQuickSearchResults(query) {
    const list = document.getElementById('quickSearchResultsList');
    if (!list) return;

    const q = (query || '').toLowerCase().trim();
    let matches = state.transactions;
    if (q) {
      matches = state.transactions.filter(t => 
        t.name.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.paymentMethod.toLowerCase().includes(q) ||
        t.amount.toString().includes(q)
      );
    }

    if (matches.length === 0) {
      list.innerHTML = `
        <div style="padding: 24px; text-align: center; color: var(--text-muted); font-size: 0.9rem;">
          No transactions found for "${escapeHTML(q)}"
        </div>
      `;
      return;
    }

    list.innerHTML = matches.slice(0, 7).map(t => {
      const isIncome = t.type === 'INCOME';
      const amt = (isIncome ? '+' : '-') + formatMoney(t.amount);
      const meta = CATEGORY_META[t.category] || CATEGORY_META.Other;

      return `
        <div class="search-result-item" data-id="${t.id}">
          <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 1.1rem;">${meta.emoji}</span>
            <div>
              <div style="font-weight: 600; font-size: 0.9rem;">${escapeHTML(t.name)}</div>
              <div style="font-size: 0.76rem; color: var(--text-muted);">${formatDate(t.date)} • ${escapeHTML(t.category)}</div>
            </div>
          </div>
          <span style="font-weight: 700; color: ${isIncome ? 'var(--income)' : 'var(--expense)'}; font-size: 0.94rem;">
            ${amt}
          </span>
        </div>
      `;
    }).join('');

    // Click to edit
    list.querySelectorAll('.search-result-item').forEach(el => {
      el.addEventListener('click', () => {
        const id = el.dataset.id;
        closeQuickSearch();
        openEditTransactionModal(id);
      });
    });
  }

  // Keyboard shortcut Ctrl+K / Cmd+K
  window.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      const modal = document.getElementById('quickSearchModal');
      if (modal.classList.contains('show')) {
        closeQuickSearch();
      } else {
        openQuickSearch();
      }
    } else if (e.key === 'Escape') {
      closeQuickSearch();
      closeTransactionModal();
      closeGoalModal();
    }
  });

  // =========================================================================
  // 21. EVENT LISTENERS SETUP
  // =========================================================================

  function setupEventListeners() {
    // 1. Sidebar Nav Click Router
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
      item.addEventListener('click', e => {
        e.preventDefault();
        const view = item.dataset.view;
        if (view) switchView(view);
      });
    });

    // Mobile Sidebar Toggles
    const hamburger = document.getElementById('hamburgerBtn');
    if (hamburger) hamburger.addEventListener('click', openMobileSidebar);

    const closeSidebarBtn = document.getElementById('sidebarCloseBtn');
    if (closeSidebarBtn) closeSidebarBtn.addEventListener('click', closeMobileSidebar);

    const backdrop = document.getElementById('sidebarBackdrop');
    if (backdrop) backdrop.addEventListener('click', closeMobileSidebar);

    // Auto-close mobile sidebar if screen resized to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 992) {
        closeMobileSidebar();
      }
    });

    // Profile in sidebar footer -> switch to Settings
    const profileBtn = document.getElementById('sidebarUserProfile');
    if (profileBtn) profileBtn.addEventListener('click', () => switchView('settings'));

    const footerSettingsBtn = document.getElementById('sidebarFooterSettingsBtn');
    if (footerSettingsBtn) footerSettingsBtn.addEventListener('click', () => switchView('settings'));

    // 2. Top Navbar Buttons
    const themeBtn = document.getElementById('themeToggleBtn');
    if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

    const notifBtn = document.getElementById('notificationsBtn');
    if (notifBtn) {
      notifBtn.addEventListener('click', e => {
        e.stopPropagation();
        document.getElementById('notificationsPanel').classList.toggle('show');
      });
    }

    const markAllRead = document.getElementById('markAllReadBtn');
    if (markAllRead) {
      markAllRead.addEventListener('click', () => {
        document.querySelector('.notification-badge').style.display = 'none';
        showToast('All notifications marked as read', 'info');
      });
    }

    // Currency Switcher Dropdown
    const currToggleBtn = document.getElementById('currencyToggleBtn');
    if (currToggleBtn) {
      currToggleBtn.addEventListener('click', e => {
        e.stopPropagation();
        document.getElementById('currencyMenu').classList.toggle('show');
      });
    }

    document.querySelectorAll('.currency-option').forEach(opt => {
      opt.addEventListener('click', function () {
        const curr = this.dataset.currency;
        changeCurrency(curr);
        document.getElementById('currencyMenu').classList.remove('show');
      });
    });

    // Quick Search Modal Trigger
    const searchBtn = document.getElementById('quickSearchBtn');
    if (searchBtn) searchBtn.addEventListener('click', openQuickSearch);

    const searchInput = document.getElementById('quickSearchModalInput');
    if (searchInput) {
      searchInput.addEventListener('input', e => {
        renderQuickSearchResults(e.target.value);
      });
    }

    const searchModal = document.getElementById('quickSearchModal');
    if (searchModal) {
      searchModal.addEventListener('click', e => {
        if (e.target === searchModal) closeQuickSearch();
      });
    }

    // 3. Add Transaction Modals
    const openAddTx1 = document.getElementById('btnOpenAddTx');
    if (openAddTx1) openAddTx1.addEventListener('click', openAddTransactionModal);

    const openAddTx2 = document.getElementById('btnOpenAddTxSecondary');
    if (openAddTx2) openAddTx2.addEventListener('click', openAddTransactionModal);

    const openAddTxEmpty = document.getElementById('btnEmptyAddTx');
    if (openAddTxEmpty) openAddTxEmpty.addEventListener('click', openAddTransactionModal);

    const closeTxModalBtn = document.getElementById('modalCloseBtn');
    if (closeTxModalBtn) closeTxModalBtn.addEventListener('click', closeTransactionModal);

    const cancelTxModalBtn = document.getElementById('modalCancelBtn');
    if (cancelTxModalBtn) cancelTxModalBtn.addEventListener('click', closeTransactionModal);

    const txModal = document.getElementById('transactionModal');
    if (txModal) {
      txModal.addEventListener('click', e => {
        if (e.target === txModal) closeTransactionModal();
      });
    }

    // Modal Segmented Type Switcher
    document.querySelectorAll('.type-toggle-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        setModalTxType(this.dataset.txType);
      });
    });

    // Transaction Form Submission
    const txForm = document.getElementById('transactionForm');
    if (txForm) {
      txForm.addEventListener('submit', e => {
        e.preventDefault();
        const editId = document.getElementById('editTxId').value;
        const txData = {
          name: document.getElementById('txInputName').value.trim(),
          amount: parseFloat(document.getElementById('txInputAmount').value),
          type: activeTxType,
          category: document.getElementById('txInputCategory').value,
          date: document.getElementById('txInputDate').value,
          paymentMethod: document.getElementById('txInputPaymentMethod').value,
          notes: document.getElementById('txInputNotes').value.trim()
        };

        if (!txData.name || isNaN(txData.amount) || txData.amount <= 0) {
          showToast('Please provide a valid name and positive amount.', 'error');
          return;
        }

        if (editId) {
          editTransaction(editId, txData);
        } else {
          addTransaction(txData);
        }

        closeTransactionModal();
      });
    }

    // 4. Hero AI Card View Actions
    const heroViewBtn = document.getElementById('btnHeroViewInsights');
    if (heroViewBtn) heroViewBtn.addEventListener('click', () => switchView('ai-insights'));

    const heroRefreshBtn = document.getElementById('btnRefreshAiInsight');
    if (heroRefreshBtn) heroRefreshBtn.addEventListener('click', runAiInsightGenerator);

    const runAiAnalysisBtn = document.getElementById('btnRunAiAnalysis');
    if (runAiAnalysisBtn) runAiAnalysisBtn.addEventListener('click', runAiInsightGenerator);

    // 5. Timeframe Controls for Main Chart
    const tfControls = document.getElementById('timeframeControls');
    if (tfControls) {
      tfControls.querySelectorAll('.timeframe-btn').forEach(btn => {
        btn.addEventListener('click', function () {
          tfControls.querySelectorAll('.timeframe-btn').forEach(b => b.classList.remove('active'));
          this.classList.add('active');
          state.timeframe = this.dataset.range;
          initMainChart();
        });
      });
    }

    // 6. Navigation Shortcuts inside dashboard
    const viewAllTxBtn = document.getElementById('btnViewAllTransactions');
    if (viewAllTxBtn) viewAllTxBtn.addEventListener('click', () => switchView('transactions'));

    const viewBudgetsTabBtn = document.getElementById('btnViewBudgetsTab');
    if (viewBudgetsTabBtn) viewBudgetsTabBtn.addEventListener('click', () => switchView('budgets'));

    // Dashboard Summary Cards interactive navigation
    const cardTotalBalance = document.getElementById('cardTotalBalance');
    if (cardTotalBalance) {
      cardTotalBalance.addEventListener('click', () => {
        state.filter.type = 'ALL';
        const typeTabs = document.getElementById('txTypeFilterTabs');
        if (typeTabs) {
          typeTabs.querySelectorAll('.tab-filter-btn').forEach(b => {
            b.classList.toggle('active', b.dataset.type === 'ALL');
          });
        }
        switchView('transactions');
      });
    }

    const cardIncome = document.getElementById('cardIncome');
    if (cardIncome) {
      cardIncome.addEventListener('click', () => {
        state.filter.type = 'INCOME';
        const typeTabs = document.getElementById('txTypeFilterTabs');
        if (typeTabs) {
          typeTabs.querySelectorAll('.tab-filter-btn').forEach(b => {
            b.classList.toggle('active', b.dataset.type === 'INCOME');
          });
        }
        switchView('transactions');
      });
    }

    const cardExpenses = document.getElementById('cardExpenses');
    if (cardExpenses) {
      cardExpenses.addEventListener('click', () => {
        state.filter.type = 'EXPENSE';
        const typeTabs = document.getElementById('txTypeFilterTabs');
        if (typeTabs) {
          typeTabs.querySelectorAll('.tab-filter-btn').forEach(b => {
            b.classList.toggle('active', b.dataset.type === 'EXPENSE');
          });
        }
        switchView('transactions');
      });
    }

    const cardSavings = document.getElementById('cardSavings');
    if (cardSavings) {
      cardSavings.addEventListener('click', () => {
        switchView('goals');
      });
    }

    // Analytics Timeframe Controls
    const analyticsTfControls = document.getElementById('analyticsTimeframeControls');
    if (analyticsTfControls) {
      analyticsTfControls.querySelectorAll('.timeframe-btn').forEach(btn => {
        btn.addEventListener('click', function () {
          analyticsTfControls.querySelectorAll('.timeframe-btn').forEach(b => b.classList.remove('active'));
          this.classList.add('active');
          state.analyticsTimeframe = this.dataset.analyticsRange || '30d';
          initAnalyticsCharts();
        });
      });
    }

    // 7. Budgets Modal
    const openBudgetBtn = document.getElementById('btnOpenAddBudgetModal');
    if (openBudgetBtn) openBudgetBtn.addEventListener('click', () => openBudgetModal());

    const closeBudgetBtn = document.getElementById('budgetModalCloseBtn');
    if (closeBudgetBtn) closeBudgetBtn.addEventListener('click', closeBudgetModal);

    const cancelBudgetBtn = document.getElementById('budgetModalCancelBtn');
    if (cancelBudgetBtn) cancelBudgetBtn.addEventListener('click', closeBudgetModal);

    const budgetModal = document.getElementById('budgetModal');
    if (budgetModal) {
      budgetModal.addEventListener('click', e => {
        if (e.target === budgetModal) closeBudgetModal();
      });
    }

    const budgetCatSelect = document.getElementById('budgetCategorySelect');
    if (budgetCatSelect) {
      budgetCatSelect.addEventListener('change', e => {
        const selectedCat = e.target.value;
        const existing = state.budgets.find(b => b.category === selectedCat);
        const limitInput = document.getElementById('budgetLimitInput');
        if (limitInput) {
          limitInput.value = existing ? existing.budget : 500;
        }
      });
    }

    const budgetForm = document.getElementById('budgetForm');
    if (budgetForm) {
      budgetForm.addEventListener('submit', e => {
        e.preventDefault();
        const category = document.getElementById('budgetCategorySelect').value;
        const limit = parseFloat(document.getElementById('budgetLimitInput').value) || 500;

        const existing = state.budgets.find(b => b.category === category);
        if (existing) {
          existing.budget = limit;
        } else {
          const meta = CATEGORY_META[category] || { emoji: '🏷️' };
          state.budgets.push({ category, budget: limit, spent: 0, icon: meta.emoji });
        }
        saveData();
        updateBudgets();
        updateDashboard();
        closeBudgetModal();
        showToast(`Budget for ${category} adjusted to ${formatMoney(limit)}.`, 'success');
      });
    }

    // 8. Goals Modal
    const openGoalBtn = document.getElementById('btnOpenAddGoalModal');
    if (openGoalBtn) openGoalBtn.addEventListener('click', openGoalModal);

    const openGoalBtn2 = document.getElementById('btnOpenNewGoalModal');
    if (openGoalBtn2) openGoalBtn2.addEventListener('click', openGoalModal);

    const closeGoalBtn = document.getElementById('goalModalCloseBtn');
    if (closeGoalBtn) closeGoalBtn.addEventListener('click', closeGoalModal);

    const cancelGoalBtn = document.getElementById('goalModalCancelBtn');
    if (cancelGoalBtn) cancelGoalBtn.addEventListener('click', closeGoalModal);

    const goalModal = document.getElementById('goalModal');
    if (goalModal) {
      goalModal.addEventListener('click', e => {
        if (e.target === goalModal) closeGoalModal();
      });
    }

    const goalForm = document.getElementById('goalForm');
    if (goalForm) {
      goalForm.addEventListener('submit', e => {
        e.preventDefault();
        const name = document.getElementById('goalInputName').value.trim();
        const current = parseFloat(document.getElementById('goalInputCurrent').value) || 0;
        const target = parseFloat(document.getElementById('goalInputTarget').value) || 1000;
        const icon = document.getElementById('goalInputIcon').value;

        if (!name || target <= 0) {
          showToast('Please provide a valid goal name and target.', 'error');
          return;
        }

        const newGoal = {
          id: 'goal-' + Date.now(),
          name,
          current,
          target,
          icon
        };

        state.goals.push(newGoal);
        saveData();
        updateGoals();
        closeGoalModal();
        showToast('Savings goal created successfully!', 'success');
      });
    }

    // 8. Transactions Search & Filters
    const searchFilter = document.getElementById('txFilterSearchInput');
    if (searchFilter) {
      searchFilter.addEventListener('input', e => {
        state.filter.search = e.target.value;
        renderTransactions();
      });
    }

    const typeTabs = document.getElementById('txTypeFilterTabs');
    if (typeTabs) {
      typeTabs.querySelectorAll('.tab-filter-btn').forEach(btn => {
        btn.addEventListener('click', function () {
          typeTabs.querySelectorAll('.tab-filter-btn').forEach(b => b.classList.remove('active'));
          this.classList.add('active');
          state.filter.type = this.dataset.type;
          renderTransactions();
        });
      });
    }

    const catFilter = document.getElementById('txCategoryFilterSelect');
    if (catFilter) {
      catFilter.addEventListener('change', e => {
        state.filter.category = e.target.value;
        renderTransactions();
      });
    }

    const sortFilter = document.getElementById('txSortSelect');
    if (sortFilter) {
      sortFilter.addEventListener('change', e => {
        state.filter.sort = e.target.value;
        renderTransactions();
      });
    }

    // 9. Settings Profile Form
    const profileForm = document.getElementById('settingsProfileForm');
    if (profileForm) {
      profileForm.addEventListener('submit', e => {
        e.preventDefault();
        const name = document.getElementById('settingsUserName').value.trim();
        const email = document.getElementById('settingsUserEmail').value.trim();
        const curr = document.getElementById('settingsCurrencySelect').value;

        state.profile.name = name;
        state.profile.email = email;
        state.currency = curr;

        saveData();
        updateCurrencyUI();
        updateDashboard();

        // Update sidebar names
        document.getElementById('sidebarUserName').textContent = name;
        document.getElementById('greetingTitle').innerHTML = `${getTimeGreeting()}, ${name.split(' ')[0]} <span class="wave">👋</span>`;

        showToast('Profile settings saved successfully.', 'success');
      });
    }

    // Settings Toggles
    const settingsDarkToggle = document.getElementById('settingsDarkModeToggle');
    if (settingsDarkToggle) {
      settingsDarkToggle.addEventListener('change', e => {
        setTheme(e.target.checked ? 'dark' : 'light');
      });
    }

    // Reset Demo Data
    const resetDemoBtn = document.getElementById('btnResetDemoData');
    if (resetDemoBtn) {
      resetDemoBtn.addEventListener('click', () => {
        state.transactions = JSON.parse(JSON.stringify(DEMO_TRANSACTIONS));
        state.budgets = JSON.parse(JSON.stringify(DEMO_BUDGETS));
        state.goals = JSON.parse(JSON.stringify(DEMO_GOALS));
        saveData();
        updateDashboard();
        showToast('Dashboard restored to default demo data.', 'info');
      });
    }

    // Top Nav User Avatar Click -> switch to Settings
    const topNavAvatar = document.getElementById('topNavUserAvatar');
    if (topNavAvatar) {
      topNavAvatar.addEventListener('click', () => switchView('settings'));
    }

    // Close notifications panel and currency menu when clicking/tapping outside
    document.addEventListener('click', e => {
      const notifPanel = document.getElementById('notificationsPanel');
      const notifBtn = document.getElementById('notificationsBtn');
      if (notifPanel && notifBtn && !notifBtn.contains(e.target) && !notifPanel.contains(e.target)) {
        notifPanel.classList.remove('show');
      }

      const currMenu = document.getElementById('currencyMenu');
      const currToggleBtn = document.getElementById('currencyToggleBtn');
      if (currMenu && currToggleBtn && !currToggleBtn.contains(e.target) && !currMenu.contains(e.target)) {
        currMenu.classList.remove('show');
      }
    });

    // Export Data JSON
    const exportBtn = document.getElementById('btnExportData');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        const exportObj = {
          version: '1.0',
          exportedAt: new Date().toISOString(),
          transactions: state.transactions,
          budgets: state.budgets,
          goals: state.goals
        };

        const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportObj, null, 2));
        const dlAnchor = document.createElement('a');
        dlAnchor.setAttribute('href', dataStr);
        dlAnchor.setAttribute('download', `finova-export-${new Date().toISOString().slice(0, 10)}.json`);
        document.body.appendChild(dlAnchor);
        dlAnchor.click();
        dlAnchor.remove();
        showToast('Financial records exported to JSON.', 'success');
      });
    }
  }

  // =========================================================================
  // 22. SCROLL OBSERVER (VIEWPORT REVEALS)
  // =========================================================================

  function initScrollObserver() {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal-on-scroll').forEach(el => el.classList.add('revealed'));
      return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.reveal-on-scroll').forEach(el => {
      observer.observe(el);
    });
  }

  // =========================================================================
  // 23. UTILITY HELPERS
  // =========================================================================

  function getTimeGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }

  function formatDate(dateStr) {
    if (!dateStr) return '—';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const date = new Date(parts[0], parts[1] - 1, parts[2]);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  }

  function escapeHTML(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // =========================================================================
  // 23. INITIALIZATION ON DOM READY
  // =========================================================================

  document.addEventListener('DOMContentLoaded', () => {
    loadData();
    setTheme(state.theme);
    updateCurrencyUI();
    setupEventListeners();
    initCustomCursor();
    initRippleEffect();
    initScrollObserver();
    updateDashboard();

    // Set dynamic greeting based on time of day
    const greetingEl = document.getElementById('greetingTitle');
    if (greetingEl) {
      const firstName = state.profile.name.split(' ')[0] || 'Alex';
      greetingEl.innerHTML = `${getTimeGreeting()}, ${firstName} <span class="wave">👋</span>`;
    }
  });

})();
