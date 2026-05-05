const express = require('express');
const router = express.Router();
const { VIMEO_API } = require('../utils/vimeo');

const VIMEO_VERSION = '3.4';

// Resolve token and eventId from the request body, falling back to env vars.
function resolveCredentials(body) {
  return {
    token: (body.token || '').trim() || process.env.VIMEO_TOKEN,
    eventId: (body.eventId || '').trim() || process.env.VIMEO_EVENT_ID,
  };
}

function vimeoHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: `application/vnd.vimeo.*+json;version=${VIMEO_VERSION}`,
    'Content-Type': 'application/json',
  };
}

// POST /api/webinar-registration/check-registered
// Body: { email, token?, eventId? }
// Returns: { registered: boolean }
// Pages through all registrants (up to 100 per request) to ensure no false negatives.
router.post('/check-registered', async (req, res) => {
  const { email } = req.body;
  const { token, eventId } = resolveCredentials(req.body);

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
// Body: { first_name, last_name, email, token?, eventId? }
router.post('/register', async (req, res) => {
  const { first_name, last_name, email } = req.body;
  const { token, eventId } = resolveCredentials(req.body);

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

module.exports = router;
