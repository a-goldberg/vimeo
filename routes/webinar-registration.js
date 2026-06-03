const express = require('express');
const router = express.Router();
const { vimeo, VIMEO_API } = require('../utils/vimeo');
const requireVimeoAuth = require('../middleware/require-vimeo-auth');

router.use(requireVimeoAuth);

// Token from OAuth session; eventId from query string, falls back to env.
function resolveCredentials(req) {
  const token = req.session.vimeoAuth.accessToken;
  const eventId = (req.query.eventId || '').trim() || process.env.VIMEO_EVENT_ID;
  return { token, eventId };
}

function meta(req) {
  return {
    referer: req.headers.referer || null,
    ip: (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket.remoteAddress,
    userAgent: req.headers['user-agent'] || null,
  };
}

// POST /api/webinar-registration/check-registered
// Auth:    requires active Vimeo OAuth session (enforced by requireVimeoAuth middleware)
// Query:   ?eventId=<id>  (optional — falls back to VIMEO_EVENT_ID env)
// Body:    { email }
// Returns: { registered: boolean }
// Pages through all registrants (up to 100 per request) to avoid false negatives.
router.post('/check-registered', async (req, res) => {
  const { email } = req.body;
  const { token, eventId } = resolveCredentials(req);

  if (!email) return res.status(400).json({ error: 'email is required.' });
  if (!eventId) return res.status(500).json({ error: 'No event ID configured. Add VIMEO_EVENT_ID to .env or enter an Event ID above.' });

  const normalizedEmail = email.trim().toLowerCase();
  let endpoint = `/lead_capture/live_events/${eventId}/registrants?fields=email&per_page=100`;

  try {
    while (endpoint) {
      const vimeoRes = await vimeo('GET', endpoint, { token, _meta: meta(req) });
      const text = await vimeoRes.text();
      let body = {};
      try { body = JSON.parse(text); } catch (_) {}

      if (!vimeoRes.ok) {
        console.error(`[webinar] check-registered ${vimeoRes.status}:`, text);
        return res.status(vimeoRes.status).json({ error: body.error || `Vimeo API returned ${vimeoRes.status}.` });
      }

      const found = (body.data || []).some((r) => (r.email || '').toLowerCase() === normalizedEmail);
      if (found) return res.json({ registered: true });

      // paging.next is already a relative path — use it directly as the next endpoint
      endpoint = body.paging?.next || null;
    }
  } catch (err) {
    console.error('[webinar] network error:', err.message);
    return res.status(502).json({ error: 'Could not reach Vimeo API.' });
  }

  return res.json({ registered: false });
});

// POST /api/webinar-registration/register
// Auth:    requires active Vimeo OAuth session (enforced by requireVimeoAuth middleware)
// Query:   ?eventId=<id>  (optional — falls back to VIMEO_EVENT_ID env)
// Body:    { first_name, last_name, email }
router.post('/register', async (req, res) => {
  const { first_name, last_name, email } = req.body;
  const { token, eventId } = resolveCredentials(req);

  if (!first_name || !last_name || !email) {
    return res.status(400).json({ error: 'first_name, last_name, and email are required.' });
  }
  if (!eventId) return res.status(500).json({ error: 'No event ID configured. Add VIMEO_EVENT_ID to .env or enter an Event ID above.' });

  let vimeoRes;
  try {
    vimeoRes = await vimeo('PUT', `/lead_capture/live_events/${eventId}/registrants`, {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ first_name, last_name, email }),
      token,
      _meta: meta(req),
    });
  } catch (err) {
    console.error('[webinar] network error:', err.message);
    return res.status(502).json({ error: 'Could not reach Vimeo API.' });
  }

  const text = await vimeoRes.text();
  let body = {};
  try { body = JSON.parse(text); } catch (_) {}

  if (!vimeoRes.ok) {
    console.error(`[webinar] register ${vimeoRes.status}:`, text);
    return res.status(vimeoRes.status).json({
      error: body.error || `Vimeo API returned ${vimeoRes.status}.`,
      developer_message: body.developer_message,
    });
  }

  console.log(`[webinar] registered: ${first_name} ${last_name} <${email}>`);
  return res.json({ success: true });
});


// POST /api/webinar-registration/get-attendees
// Auth:    requires active Vimeo OAuth session (enforced by requireVimeoAuth middleware)
// Query:   ?eventId=<id>  (optional — falls back to VIMEO_EVENT_ID env)
// Returns: { attendees: [] }
// Pages through all registrants (up to 100 per request) to return the full list.
router.post('/get-attendees', async (req, res) => {
  const { token, eventId } = resolveCredentials(req);

  if (!eventId) return res.status(500).json({ error: 'No event ID configured. Add VIMEO_EVENT_ID to .env or enter an Event ID above.' });

  let endpoint = `/lead_capture/live_events/${eventId}/registrants?fields=email,first_name,last_name&per_page=100`;
  const attendees = [];

  try {
    while (endpoint) {
      const vimeoRes = await vimeo('GET', endpoint, { token, _meta: meta(req) });
      const text = await vimeoRes.text();
      let body = {};
      try { body = JSON.parse(text); } catch (_) {}

      if (!vimeoRes.ok) {
        console.error(`[webinar] get-attendees ${vimeoRes.status}:`, text);
        return res.status(vimeoRes.status).json({ error: body.error || `Vimeo API returned ${vimeoRes.status}.` });
      }

      attendees.push(...(body.data || []));
      endpoint = body.paging?.next || null;
    }
  } catch (err) {
    console.error('[webinar] network error:', err.message);
    return res.status(502).json({ error: 'Could not reach Vimeo API.' });
  }

  return res.json({ attendees });
});

module.exports = router;
