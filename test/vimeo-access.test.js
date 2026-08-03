const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const fs = require('node:fs');
const vm = require('node:vm');
const express = require('express');

const {
  getVimeoAccess,
  clientVimeoAccess,
  requireVimeoRead,
  requireVimeoWrite,
  createAnonymousVimeoRateLimit,
} = require('../middleware/vimeo-access');

function preserveDemoToken(t, value) {
  const original = process.env.VIMEO_TOKEN;
  if (value === undefined) delete process.env.VIMEO_TOKEN;
  else process.env.VIMEO_TOKEN = value;
  t.after(() => {
    if (original === undefined) delete process.env.VIMEO_TOKEN;
    else process.env.VIMEO_TOKEN = original;
  });
}

function responseStub() {
  return {
    statusCode: 200,
    headers: {},
    body: null,
    status(code) { this.statusCode = code; return this; },
    set(name, value) { this.headers[name] = value; return this; },
    json(body) { this.body = body; return this; },
  };
}

function createTestApp(router, mountPath) {
  const app = express();
  app.use(express.json());
  app.use((req, res, next) => {
    req.session = req.headers['x-test-connected'] === 'yes'
      ? { vimeoAuth: { accessToken: 'session-token', userUri: '/users/test' } }
      : {};
    next();
  });
  app.use(mountPath, router);
  return app;
}

async function withServer(app, run) {
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();
  try {
    return await run(port);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

function request(port, path, { method = 'GET', headers = {}, body } = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request({ hostname: '127.0.0.1', port, path, method, headers }, (res) => {
      let text = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => { text += chunk; });
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, text }));
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

test('OAuth session token takes precedence over the demo token', (t) => {
  preserveDemoToken(t, 'demo-token');
  const access = getVimeoAccess({
    session: { vimeoAuth: { accessToken: 'session-token' } },
  });

  assert.equal(access.token, 'session-token');
  assert.equal(access.mode, 'oauth');
  assert.equal(access.canWrite, true);

  const clientAccess = clientVimeoAccess({
    session: { vimeoAuth: { accessToken: 'session-token' } },
  });
  assert.equal(Object.hasOwn(clientAccess, 'token'), false);
});

test('anonymous reads use the demo token and writes require OAuth', (t) => {
  preserveDemoToken(t, 'demo-token');
  const req = { session: {} };
  const readRes = responseStub();
  let readNext = false;
  requireVimeoRead(req, readRes, () => { readNext = true; });

  assert.equal(readNext, true);
  assert.equal(req.vimeoAccess.token, 'demo-token');
  assert.equal(req.vimeoAccess.mode, 'demo');

  const writeRes = responseStub();
  let writeNext = false;
  requireVimeoWrite({ session: {} }, writeRes, () => { writeNext = true; });

  assert.equal(writeNext, false);
  assert.equal(writeRes.statusCode, 403);
  assert.equal(writeRes.body.code, 'VIMEO_OAUTH_REQUIRED');
});

test('missing demo and session tokens return a configuration error', (t) => {
  preserveDemoToken(t, undefined);
  const res = responseStub();
  requireVimeoRead({ session: {} }, res, () => assert.fail('read should not proceed'));

  assert.equal(res.statusCode, 503);
  assert.equal(res.body.code, 'VIMEO_ACCESS_UNAVAILABLE');
});

test('anonymous rate limiting returns 429 and does not limit connected users', () => {
  let timestamp = 1_000;
  const middleware = createAnonymousVimeoRateLimit({ limit: 2, windowMs: 10_000, now: () => timestamp });
  const anonymousReq = {
    headers: { 'x-forwarded-for': '203.0.113.10' },
    socket: {},
    vimeoAccess: { connected: false },
  };

  middleware(anonymousReq, responseStub(), () => {});
  middleware(anonymousReq, responseStub(), () => {});
  const limited = responseStub();
  middleware(anonymousReq, limited, () => assert.fail('limited request should not proceed'));
  assert.equal(limited.statusCode, 429);
  assert.equal(limited.headers['Retry-After'], '10');

  const connected = { ...anonymousReq, vimeoAccess: { connected: true } };
  let connectedNext = false;
  middleware(connected, responseStub(), () => { connectedNext = true; });
  assert.equal(connectedNext, true);

  timestamp += 10_000;
  let resetNext = false;
  middleware(anonymousReq, responseStub(), () => { resetNext = true; });
  assert.equal(resetNext, true);
});

test('Vimeo proxy forwards anonymous reads with the demo token', async (t) => {
  preserveDemoToken(t, 'demo-token');
  let upstream;
  t.mock.method(global, 'fetch', async (url, options) => {
    upstream = { url, options };
    return new Response(JSON.stringify({ uri: '/users/demo' }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  });

  const app = createTestApp(require('../routes/vimeo-proxy'), '/api/vimeo');
  await withServer(app, async (port) => {
    const res = await request(port, '/api/vimeo/me');
    assert.equal(res.status, 200);
    assert.equal(JSON.parse(res.text).uri, '/users/demo');
  });

  assert.equal(upstream.url, 'https://api.vimeo.com/me');
  assert.equal(upstream.options.headers.Authorization, 'Bearer demo-token');
});

test('Vimeo proxy rejects anonymous mutations without an upstream request', async (t) => {
  preserveDemoToken(t, 'demo-token');
  let upstreamCalled = false;
  t.mock.method(global, 'fetch', async () => {
    upstreamCalled = true;
    return new Response(null, { status: 204 });
  });

  const app = createTestApp(require('../routes/vimeo-proxy'), '/api/vimeo');
  await withServer(app, async (port) => {
    const res = await request(port, '/api/vimeo/videos/123', {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: 'Nope' }),
    });
    assert.equal(res.status, 403);
    assert.equal(JSON.parse(res.text).code, 'VIMEO_OAUTH_REQUIRED');
  });

  assert.equal(upstreamCalled, false);
});

test('Vimeo proxy forwards connected mutations with the session token and body', async (t) => {
  preserveDemoToken(t, 'demo-token');
  let upstream;
  t.mock.method(global, 'fetch', async (url, options) => {
    upstream = { url, options };
    return new Response(JSON.stringify({ name: 'Updated' }), { status: 200 });
  });

  const app = createTestApp(require('../routes/vimeo-proxy'), '/api/vimeo');
  await withServer(app, async (port) => {
    const res = await request(port, '/api/vimeo/videos/123', {
      method: 'PATCH',
      headers: { 'content-type': 'application/json', 'x-test-connected': 'yes' },
      body: JSON.stringify({ name: 'Updated' }),
    });
    assert.equal(res.status, 200);
  });

  assert.equal(upstream.options.headers.Authorization, 'Bearer session-token');
  assert.equal(upstream.options.body, JSON.stringify({ name: 'Updated' }));
});

test('Smart Card reads allow demo mode while writes remain OAuth-only', async (t) => {
  preserveDemoToken(t, 'demo-token');
  let upstreamCalls = 0;
  t.mock.method(global, 'fetch', async (url, options) => {
    upstreamCalls += 1;
    assert.equal(options.headers.Authorization, 'Bearer demo-token');
    return new Response(JSON.stringify({ uri: '/videos/123', name: 'Demo video' }), { status: 200 });
  });

  const app = createTestApp(require('../routes/smart-card'), '/api/smart-card');
  await withServer(app, async (port) => {
    const read = await request(port, '/api/smart-card/video/123');
    assert.equal(read.status, 200);

    const write = await request(port, '/api/smart-card/video/123', {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: 'Nope' }),
    });
    assert.equal(write.status, 403);
  });

  assert.equal(upstreamCalls, 1);
});

test('Admin reads are scoped by access mode while clear and webinar APIs remain OAuth-gated', async (t) => {
  const requestLog = require('../utils/request-log');
  requestLog.clear();
  t.after(() => requestLog.clear());
  const baseEntry = {
    timestamp: new Date().toISOString(),
    method: 'GET',
    path: '/videos/123',
    query: '',
    referer: null,
    status: 200,
    durationMs: 10,
    rateLimit: { limit: '100', remaining: '99', resetAt: null },
    client: { ip: '127.0.0.1', userAgent: 'test' },
  };
  requestLog.addEntry({ ...baseEntry, vimeoUserUri: null });
  requestLog.addEntry({ ...baseEntry, path: '/me', vimeoUserUri: '/users/test' });

  const app = express();
  app.use(express.json());
  app.use((req, res, next) => {
    req.session = req.headers['x-test-connected'] === 'yes'
      ? { vimeoAuth: { accessToken: 'session-token', userUri: '/users/test' } }
      : {};
    next();
  });
  app.use('/api/admin', require('../routes/admin'));
  app.use('/api/webinar-registration', require('../routes/webinar-registration'));

  await withServer(app, async (port) => {
    const anonymousLog = await request(port, '/api/admin/log');
    assert.equal(anonymousLog.status, 200);
    assert.deepEqual(JSON.parse(anonymousLog.text).map((entry) => entry.vimeoUserUri), [null]);

    const anonymousStats = await request(port, '/api/admin/stats');
    assert.equal(JSON.parse(anonymousStats.text).totalEntries, 1);

    const connectedLog = await request(port, '/api/admin/log', {
      headers: { 'x-test-connected': 'yes' },
    });
    assert.deepEqual(JSON.parse(connectedLog.text).map((entry) => entry.vimeoUserUri), ['/users/test']);

    const anonymousClear = await request(port, '/api/admin/log', { method: 'DELETE' });
    assert.equal(anonymousClear.status, 401);

    const connectedClear = await request(port, '/api/admin/log', {
      method: 'DELETE',
      headers: { 'x-test-connected': 'yes' },
    });
    assert.equal(connectedClear.status, 200);

    const connectedAfterClear = await request(port, '/api/admin/log', {
      headers: { 'x-test-connected': 'yes' },
    });
    assert.deepEqual(JSON.parse(connectedAfterClear.text), []);

    const anonymousAfterClear = await request(port, '/api/admin/log');
    assert.equal(JSON.parse(anonymousAfterClear.text).length, 1);

    const webinar = await request(port, '/api/webinar-registration/get-attendees', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: '{}',
    });
    assert.equal(webinar.status, 401);
  });
});

test('example video links populate and submit their configured form', () => {
  const listeners = {};
  const link = {
    dataset: {
      vimeoExampleUrl: 'https://vimeo.com/1105215442',
      inputId: 'urlInput',
      formId: 'urlForm',
    },
    addEventListener(type, listener) { listeners[type] = listener; },
  };
  const input = {
    value: '',
    inputDispatched: false,
    dispatchEvent() { this.inputDispatched = true; },
  };
  const form = {
    submitCount: 0,
    requestSubmit() { this.submitCount += 1; },
  };
  const document = {
    getElementById(id) {
      return { urlInput: input, urlForm: form }[id] || null;
    },
    querySelectorAll(selector) {
      return selector === '[data-vimeo-example-url]' ? [link] : [];
    },
  };
  const source = fs.readFileSync('public/js/main.js', 'utf8');
  vm.runInNewContext(source, {
    document,
    window: { location: { pathname: '/smart-card' }, VIMEO_ACCESS: { canWrite: false } },
    Event: class Event {},
    navigator: { clipboard: { writeText: async () => {} } },
    setTimeout,
  });

  let defaultPrevented = false;
  listeners.click({ preventDefault() { defaultPrevented = true; } });

  assert.equal(defaultPrevented, true);
  assert.equal(input.value, 'https://vimeo.com/1105215442');
  assert.equal(input.inputDispatched, true);
  assert.equal(form.submitCount, 1);
});
