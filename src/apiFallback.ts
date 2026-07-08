import { isGuestMode } from './guestMode';

const GUEST_STORE_KEY = 'ledgerly_guest_store';
const GUEST_LIMIT = 5;

type GuestStore = {
  sales: any[];
  expenses: any[];
  customers: any[];
  udhaar: any[];
  inventory: any[];
};

const emptyDashboardData = {
  stats: {
    todaySales: 0,
    todayExpenses: 0,
    netProfit: 0,
    outstandingUdhaar: 0,
    cashBalance: 0,
    digitalBalance: 0,
    monthlyGrowth: 0,
  },
  revenueTrends: [],
  recentTransactions: [],
};

function emptyStore(): GuestStore {
  return {
    sales: [],
    expenses: [],
    customers: [],
    udhaar: [],
    inventory: [],
  };
}

function readStore(): GuestStore {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(GUEST_STORE_KEY) || '{}');
    return { ...emptyStore(), ...parsed };
  } catch {
    return emptyStore();
  }
}

function writeStore(store: GuestStore) {
  window.localStorage.setItem(GUEST_STORE_KEY, JSON.stringify(store));
}

function jsonResponse(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
    },
  });
}

function isApiUrl(url: string) {
  try {
    return new URL(url, window.location.origin).pathname.startsWith('/api/');
  } catch {
    return url.startsWith('/api/');
  }
}

function apiPath(url: string) {
  return new URL(url, window.location.origin).pathname.replace(/^\/api\/?/, '');
}

async function readBody(init?: RequestInit) {
  if (!init?.body || typeof init.body !== 'string') {
    return {};
  }

  try {
    return JSON.parse(init.body);
  } catch {
    return {};
  }
}

function dashboardFromStore(store: GuestStore) {
  const todaySales = store.sales.reduce((sum, sale) => sum + Number(sale.total || 0), 0);
  const todayExpenses = store.expenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
  const outstandingUdhaar = store.customers.reduce((sum, customer) => sum + Number(customer.amountOwed || customer.pendingAmount || 0), 0);

  return {
    stats: {
      todaySales,
      todayExpenses,
      netProfit: todaySales - todayExpenses,
      outstandingUdhaar,
      cashBalance: 0,
      digitalBalance: 0,
      monthlyGrowth: 0,
    },
    revenueTrends: [],
    recentTransactions: [
      ...store.sales.map((sale) => ({
        type: 'credit',
        amount: Number(sale.total || 0),
        desc: sale.product,
        method: sale.method,
        time: 'Guest',
      })),
      ...store.expenses.map((expense) => ({
        type: 'debit',
        amount: Number(expense.amount || 0),
        desc: expense.description,
        method: expense.method,
        time: 'Guest',
      })),
    ].slice(0, GUEST_LIMIT),
  };
}

function limitedAppend<T extends Record<string, any>>(items: T[], item: T, prefix: string) {
  if (items.length >= GUEST_LIMIT) {
    return null;
  }

  return {
    id: `${prefix}-${Date.now()}`,
    date: new Date().toISOString(),
    status: item.status || 'Completed',
    ...item,
  };
}

async function guestResponse(url: string, method: string, init?: RequestInit) {
  const path = apiPath(url);
  const store = readStore();

  if (method === 'GET') {
    if (path === 'dashboard') {
      return jsonResponse(200, dashboardFromStore(store));
    }

    if (path === 'sales') return jsonResponse(200, store.sales);
    if (path === 'expenses') return jsonResponse(200, store.expenses);
    if (path === 'inventory') return jsonResponse(200, store.inventory);
    if (path === 'udhaar') return jsonResponse(200, store.udhaar);
    if (path === 'customers') return jsonResponse(200, store.customers.map((customer) => ({
      ...customer,
      totalUdhaar: customer.amountOwed || 0,
      paidAmount: 0,
      pendingAmount: customer.amountOwed || 0,
      entriesCount: 0,
      paymentsCount: 0,
    })));
    if (path.startsWith('customers/')) {
      const customer = store.customers.find((item) => String(item.id) === path.split('/')[1]);
      return jsonResponse(customer ? 200 : 404, customer ? {
        customer,
        totalUdhaar: customer.amountOwed || 0,
        paidAmount: 0,
        pendingAmount: customer.amountOwed || 0,
        history: [],
      } : { error: 'Customer not found in guest mode.' });
    }
  }

  if (method === 'POST') {
    const body = await readBody(init);

    if (path === 'sales') {
      const record = limitedAppend(store.sales, body, 'GUEST-SALE');
      if (!record) return jsonResponse(403, { error: 'Guest limit reached: 5 sales.' });
      store.sales.unshift(record);
      writeStore(store);
      return jsonResponse(201, record);
    }

    if (path === 'expenses') {
      const record = limitedAppend(store.expenses, body, 'GUEST-EXP');
      if (!record) return jsonResponse(403, { error: 'Guest limit reached: 5 expenses.' });
      store.expenses.unshift(record);
      writeStore(store);
      return jsonResponse(201, record);
    }

    if (path === 'inventory') {
      const record = limitedAppend(store.inventory, body, 'GUEST-ITEM');
      if (!record) return jsonResponse(403, { error: 'Guest limit reached: 5 inventory items.' });
      store.inventory.push(record);
      writeStore(store);
      return jsonResponse(201, record);
    }

    if (path === 'customers') {
      const record = limitedAppend(store.customers, { ...body, amountOwed: 0, status: 'Good' }, 'GUEST-CUST');
      if (!record) return jsonResponse(403, { error: 'Guest limit reached: 5 customers.' });
      store.customers.push(record);
      writeStore(store);
      return jsonResponse(201, record);
    }

    if (path === 'udhaar') {
      const record = limitedAppend(store.udhaar, { ...body, status: body.status || 'Unpaid' }, 'GUEST-UDHAAR');
      if (!record) return jsonResponse(403, { error: 'Guest limit reached: 5 udhaar records.' });
      store.udhaar.push(record);
      writeStore(store);
      return jsonResponse(201, record);
    }

    if (path === 'payments') {
      return jsonResponse(403, { error: 'Guest mode does not support payments. Sign in to record real payments.' });
    }
  }

  if (method === 'PUT' && /^udhaar\/[^/]+\/payment$/.test(path)) {
    return jsonResponse(403, { error: 'Guest mode does not support payments. Sign in to record real payments.' });
  }

  return jsonResponse(404, { error: 'API route not found' });
}

function fallbackBody(url: string, method: string) {
  const pathname = apiPath(url);

  if (method === 'GET') {
    if (pathname === 'dashboard') {
      return emptyDashboardData;
    }

    if (['sales', 'expenses', 'customers', 'udhaar', 'inventory'].includes(pathname)) {
      return [];
    }
  }

  return {
    error: 'Database is not configured. Connect DATABASE_URL to store real Ledgerly data.',
  };
}

export function installApiJsonFallback() {
  if (typeof window === 'undefined' || (window as any).__ledgerlyApiFallbackInstalled) {
    return;
  }

  (window as any).__ledgerlyApiFallbackInstalled = true;
  const nativeFetch = window.fetch.bind(window);

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' || input instanceof URL ? input.toString() : input.url;

    if (!isApiUrl(url)) {
      return nativeFetch(input, init);
    }

    const method = (init?.method || (input instanceof Request ? input.method : 'GET')).toUpperCase();

    if (isGuestMode()) {
      return guestResponse(url, method, init);
    }

    const response = await nativeFetch(input, init);
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      return response;
    }

    const status = method === 'GET' ? 200 : 503;
    return jsonResponse(status, fallbackBody(url, method));
  };
}
