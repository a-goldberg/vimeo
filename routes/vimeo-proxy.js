const express = require('express');
const router = express.Router();
const { vimeo, handleVimeoError } = require('../utils/vimeo');

// Capture raw body for all content types, including application/vnd.vimeo.*+json.
// express.json() (mounted globally) only parses application/json, so Vimeo-specific
// content types would arrive with an empty req.body without this middleware.
router.use(express.raw({ type: '*/*', limit: '100kb' }));

// Forwards any METHOD /api/vimeo/<path>?<qs> → METHOD https://api.vimeo.com/<path>?<qs>
// req.url inside this router is already relative to the mount point and includes the query string.
//
// Token priority: session token (user connected their own Vimeo account) > VIMEO_TOKEN env var.
// Routes that explicitly require user auth should apply the requireVimeoAuth middleware from
// middleware/require-vimeo-auth.js — those routes will 401 rather than fall back to the admin token.
router.all('*', async (req, res) => {
  const token = req.session?.vimeoAuth?.accessToken || process.env.VIMEO_TOKEN;
  if (!token) {
    return res.status(500).json({ error: 'No Vimeo token available. Configure VIMEO_TOKEN or connect a Vimeo account.' });
  }
  try {
    const opts = {
      token,
      _meta: {
        referer: req.headers.referer || req.headers.origin || null,
        ip: (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket.remoteAddress,
        userAgent: req.headers['user-agent'] || null,
        vimeoUserUri: req.session?.vimeoAuth?.userUri || null,
      },
    };
    if (req.body && req.body.length) {
      opts.body = req.body;
      if (req.headers['content-type']) {
        opts.headers = { 'Content-Type': req.headers['content-type'] };
      }
    }
    const r = await vimeo(req.method, req.url, opts);
    res.status(r.status);
    const text = await r.text();
    if (text) {
      try { res.json(JSON.parse(text)); } catch { res.send(text); }
    } else {
      res.end();
    }
  } catch (e) {
    handleVimeoError(res, e);
  }
});

module.exports = router;
