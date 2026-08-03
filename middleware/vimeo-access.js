const READ_METHODS = new Set(['GET', 'HEAD']);

function getVimeoAccess(req) {
  const sessionToken = req.session?.vimeoAuth?.accessToken || null;
  const demoToken = process.env.VIMEO_TOKEN || null;
  const connected = Boolean(sessionToken);

  return {
    connected,
    demoAvailable: Boolean(demoToken),
    canRead: Boolean(sessionToken || demoToken),
    canWrite: connected,
    mode: connected ? 'oauth' : demoToken ? 'demo' : 'unavailable',
    token: sessionToken || demoToken,
  };
}

function clientVimeoAccess(req) {
  const { connected, demoAvailable, canRead, canWrite, mode } = getVimeoAccess(req);
  return { connected, demoAvailable, canRead, canWrite, mode };
}

function requireVimeoRead(req, res, next) {
  const access = getVimeoAccess(req);
  if (!access.canRead) {
    return res.status(503).json({
      error: 'Vimeo demo access is not configured. Connect your Vimeo account to continue.',
      code: 'VIMEO_ACCESS_UNAVAILABLE',
      authUrl: '/auth/vimeo/start',
    });
  }
  req.vimeoAccess = access;
  next();
}

function requireVimeoWrite(req, res, next) {
  const access = getVimeoAccess(req);
  if (!access.canWrite) {
    return res.status(403).json({
      error: 'Connect your Vimeo account to make changes.',
      code: 'VIMEO_OAUTH_REQUIRED',
      authUrl: '/auth/vimeo/start',
    });
  }
  req.vimeoAccess = access;
  next();
}

function requireVimeoMethodAccess(req, res, next) {
  return READ_METHODS.has(req.method)
    ? requireVimeoRead(req, res, next)
    : requireVimeoWrite(req, res, next);
}

function requestIp(req) {
  return (req.headers['x-forwarded-for'] || '').split(',')[0].trim()
    || req.socket?.remoteAddress
    || 'unknown';
}

function createAnonymousVimeoRateLimit({ limit = 60, windowMs = 60_000, now = Date.now } = {}) {
  const windows = new Map();

  return function anonymousVimeoRateLimit(req, res, next) {
    const access = req.vimeoAccess || getVimeoAccess(req);
    if (access.connected) return next();

    const timestamp = now();
    const ip = requestIp(req);
    const current = windows.get(ip);
    const entry = !current || timestamp - current.startedAt >= windowMs
      ? { startedAt: timestamp, count: 0 }
      : current;

    entry.count += 1;
    windows.set(ip, entry);

    if (entry.count > limit) {
      const retryAfter = Math.max(1, Math.ceil((entry.startedAt + windowMs - timestamp) / 1000));
      res.set('Retry-After', String(retryAfter));
      return res.status(429).json({
        error: 'Too many anonymous Vimeo requests. Please try again shortly.',
        code: 'VIMEO_RATE_LIMITED',
      });
    }

    next();
  };
}

module.exports = {
  READ_METHODS,
  getVimeoAccess,
  clientVimeoAccess,
  requireVimeoRead,
  requireVimeoWrite,
  requireVimeoMethodAccess,
  createAnonymousVimeoRateLimit,
};
