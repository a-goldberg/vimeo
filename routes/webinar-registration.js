const express = require('express');
const router = express.Router();
const { VIMEO_API } = require('../utils/vimeo');

const VIMEO_VERSION = '3.4';

// Token from Authorization header; eventId from query string. Both fall back to env.
function resolveCredentials(req) {
  const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '').trim()
    || process.env.VIMEO_TOKEN;
  const eventId = (req.query.eventId || '').trim() || process.env.VIMEO_EVENT_ID;
  return { token, eventId };
}

function vimeoHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: `application/vnd.vimeo.*+json;version=${VIMEO_VERSION}`,
    'Content-Type': 'application/json',
  };
}

// POST /api/webinar-registration/check-registered
// Headers: Authorization: Bearer <token>  (optional — falls back to VIMEO_TOKEN env)
// Query:   ?eventId=<id>                  (optional — falls back to VIMEO_EVENT_ID env)
// Body:    { email }
// Returns: { registered: boolean }
// Pages through all registrants (up to 100 per request) to avoid false negatives.
router.post('/check-registered', async (req, res) => {
  const { email } = req.body;
  const { token, eventId } = resolveCredentials(req);

  if (!email) return res.status(400).json({ error: 'email is required.' });
  if (!token) return res.status(500).json({ error: 'No Vimeo token configured. Add VIMEO_TOKEN to .env or enter one above.' });
  if (!eventId) return res.status(500).json({ error: 'No event ID configured. Add VIMEO_EVENT_ID to .env or enter one above.' });

  const normalizedEmail = email.trim().toLowerCase();
  let nextUrl = `${VIMEO_API}/lead_capture/live_events/${eventId}/registrants?fields=email&per_page=100`;

  try {
    while (nextUrl) {
      const vimeoRes = await fetch(nextUrl, { headers: vimeoHeaders(token) });
      const text = await vimeoRes.text();
      let body = {};
      try { body = JSON.parse(text); } catch (_) {}

      if (!vimeoRes.ok) {
        console.error(`[webinar] check-registered ${vimeoRes.status}:`, text);
        return res.status(vimeoRes.status).json({ error: body.error || `Vimeo API returned ${vimeoRes.status}.` });
      }

      const found = (body.data || []).some(r => (r.email || '').toLowerCase() === normalizedEmail);
      if (found) return res.json({ registered: true });

      // Vimeo returns a relative path in paging.next; prepend the base URL.
      nextUrl = body.paging?.next ? `${VIMEO_API}${body.paging.next}` : null;
    }
  } catch (err) {
    console.error('[webinar] network error:', err.message);
    return res.status(502).json({ error: 'Could not reach Vimeo API.' });
  }

  return res.json({ registered: false });
});

// POST /api/webinar-registration/register
// Headers: Authorization: Bearer <token>  (optional — falls back to VIMEO_TOKEN env)
// Query:   ?eventId=<id>                  (optional — falls back to VIMEO_EVENT_ID env)
// Body:    { first_name, last_name, email }
router.post('/register', async (req, res) => {
  const { first_name, last_name, email } = req.body;
  const { token, eventId } = resolveCredentials(req);

  if (!first_name || !last_name || !email) {
    return res.status(400).json({ error: 'first_name, last_name, and email are required.' });
  }
  if (!token) return res.status(500).json({ error: 'No Vimeo token configured. Add VIMEO_TOKEN to .env or enter one above.' });
  if (!eventId) return res.status(500).json({ error: 'No event ID configured. Add VIMEO_EVENT_ID to .env or enter one above.' });

  let vimeoRes;
  try {
    vimeoRes = await fetch(
      `${VIMEO_API}/lead_capture/live_events/${eventId}/registrants`,
      {
        method: 'PUT',
        headers: vimeoHeaders(token),
        body: JSON.stringify({ first_name, last_name, email }),
      }
    );
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
// Headers: Authorization: Bearer <token>  (optional — falls back to VIMEO_TOKEN env)
// Query:   ?eventId=<id>                  (optional — falls back to VIMEO_EVENT_ID env)
// Returns: { attendees: [] }
// Pages through all registrants (up to 100 per request) to return the full list.
router.post('/get-attendees', async (req, res) => {
    const { token, eventId } = resolveCredentials(req);

  if (!token) return res.status(500).json({ error: 'No Vimeo token configured. Add VIMEO_TOKEN to .env or enter one above.' });
  if (!eventId) return res.status(500).json({ error: 'No event ID configured. Add VIMEO_EVENT_ID to .env or enter one above.' });

  let nextUrl = `${VIMEO_API}/lead_capture/live_events/${eventId}/registrants?fields=email,first_name,last_name&per_page=100`;
  const attendees = [];

  try {
    while (nextUrl) {
      const vimeoRes = await fetch(nextUrl, { headers: vimeoHeaders(token) });
      const text = await vimeoRes.text();
      let body = {};
      try { body = JSON.parse(text); } catch (_) {}

      if (!vimeoRes.ok) {
        console.error(`[webinar] get-attendees ${vimeoRes.status}:`, text);
        return res.status(vimeoRes.status).json({ error: body.error || `Vimeo API returned ${vimeoRes.status}.` });
      }

      attendees.push(...(body.data || []));
      nextUrl = body.paging?.next ? `${VIMEO_API}${body.paging.next}` : null;
    }
  } catch (err) {
    console.error('[webinar] network error:', err.message);
    return res.status(502).json({ error: 'Could not reach Vimeo API.' });
  }

  return res.json({ attendees });
});

module.exports = router;
