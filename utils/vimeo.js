// Shared Vimeo API client.
// Import this in any route file that needs to talk to the Vimeo API.
//
// Usage:
//   const { vimeo, requireToken, handleVimeoError } = require('./utils/vimeo');
//
// VIMEO_TOKEN is read from process.env at call time, so it's always
// up-to-date with whatever is in .env without needing a server restart.

const requestLog = require('./request-log');

const VIMEO_API = 'https://api.vimeo.com';
const VIMEO_VERSION = '3.4';

// Returns true if VIMEO_TOKEN is present; otherwise sends a 500 and returns false.
// Call this at the top of any route handler that requires authentication.
function requireToken(res) {
  if (!process.env.VIMEO_TOKEN) {
    res.status(500).json({
      error: 'VIMEO_TOKEN is not configured. Add it to your .env file.',
    });
    return false;
  }
  return true;
}

// Builds the standard Vimeo auth + version headers.
// Pass extra = { 'Content-Type': 'application/json' } etc. when needed.
// Pass token to override the default VIMEO_TOKEN env var.
function vimeoHeaders(extra = {}, token) {
  return {
    Authorization: `Bearer ${token || process.env.VIMEO_TOKEN}`,
    Accept: `application/vnd.vimeo.*+json;version=${VIMEO_VERSION}`,
    ...extra,
  };
}

// Authenticated fetch to the Vimeo API.
//
//   method   — 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'
//   endpoint — path starting with '/', e.g. '/videos/123456'
//   options  — {
//     headers  — extra request headers (optional)
//     body     — request body (optional)
//     token    — override the default VIMEO_TOKEN (optional)
//     _meta    — { referer, ip, userAgent } for request logging (optional)
//   }
//
// Returns the raw fetch Response so callers can inspect status and parse JSON
// however they need to. Does not throw on non-2xx — callers handle that.
// Every call is automatically logged to utils/request-log.js.
async function vimeo(method, endpoint, { headers = {}, body, token, _meta = {} } = {}) {
  const startTime = Date.now();
  const r = await fetch(`${VIMEO_API}${endpoint}`, {
    method,
    headers: vimeoHeaders(headers, token),
    body,
  });
  requestLog.logCall(method, endpoint, r, startTime, _meta);
  return r;
}

// Standard error handler for route catch blocks.
// Logs to the server console and sends a JSON error to the client.
function handleVimeoError(res, err) {
  console.error('[vimeo]', err.message);
  res.status(500).json({ error: err.message });
}

module.exports = { vimeo, requireToken, handleVimeoError, VIMEO_API };
