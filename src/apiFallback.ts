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

function isApiUrl(url: string) {
  try {
    return new URL(url, window.location.origin).pathname.startsWith('/api/');
  } catch {
    return url.startsWith('/api/');
  }
}

function fallbackBody(url: string, method: string) {
  const pathname = new URL(url, window.location.origin).pathname.replace(/^\/api\/?/, '');

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
    const response = await nativeFetch(input, init);
    const url = typeof input === 'string' || input instanceof URL ? input.toString() : input.url;

    if (!isApiUrl(url)) {
      return response;
    }

    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      return response;
    }

    const method = (init?.method || (input instanceof Request ? input.method : 'GET')).toUpperCase();
    const status = method === 'GET' ? 200 : 503;

    return new Response(JSON.stringify(fallbackBody(url, method)), {
      status,
      headers: {
        'content-type': 'application/json; charset=utf-8',
      },
    });
  };
}
