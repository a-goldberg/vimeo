const express = require('express');
const router = express.Router();
const requestLog = require('../utils/request-log');
const requireVimeoAuth = require('../middleware/require-vimeo-auth');

function entryScope(req) {
  const userUri = req.session?.vimeoAuth?.userUri || null;
  return userUri
    ? (entry) => entry.vimeoUserUri === userUri
    : (entry) => !entry.vimeoUserUri;
}

router.get('/log', (req, res) => {
  res.json(requestLog.getEntries(entryScope(req)));
});

router.get('/stats', (req, res) => {
  res.json(requestLog.getStats(entryScope(req)));
});

router.delete('/log', requireVimeoAuth, (req, res) => {
  requestLog.clear(entryScope(req));
  res.json({ ok: true });
});

module.exports = router;
