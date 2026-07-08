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

function sendJson(res: any, statusCode: number, body: unknown) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
}

function missingDatabase(res: any) {
  sendJson(res, 503, {
    error: 'Database is not configured. Connect DATABASE_URL to store real Ledgerly data.',
  });
}

function getApiPath(req: any) {
  const queryPath = req.query?.path;
  if (Array.isArray(queryPath)) {
    return queryPath.join('/');
  }
  if (typeof queryPath === 'string') {
    return queryPath;
  }

  const pathname = new URL(req.url || '/', 'https://ledgerly.local').pathname;
  return pathname.replace(/^\/api\/?/, '');
}

export default function handler(req: any, res: any) {
  const method = req.method || 'GET';
  const apiPath = getApiPath(req);

  if (method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (method === 'GET') {
    if (apiPath === 'dashboard') {
      sendJson(res, 200, emptyDashboardData);
      return;
    }

    if (['sales', 'expenses', 'customers', 'udhaar', 'inventory'].includes(apiPath)) {
      sendJson(res, 200, []);
      return;
    }

    if (apiPath.startsWith('customers/')) {
      missingDatabase(res);
      return;
    }
  }

  if (method === 'POST' || method === 'PUT') {
    if (
      ['sales', 'expenses', 'customers', 'udhaar', 'payments', 'inventory'].includes(apiPath) ||
      /^udhaar\/[^/]+\/payment$/.test(apiPath)
    ) {
      missingDatabase(res);
      return;
    }
  }

  sendJson(res, 404, { error: 'API route not found' });
}
