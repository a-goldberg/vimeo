const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { vimeo, requireToken, handleVimeoError } = require('../utils/vimeo');

const SPEC_PATH = path.join(__dirname, '../data/vimeo-spec.json');
const PRIVATE_PATH = path.join(__dirname, '../data/vimeo-private-endpoints.json');

// Returns the cached OpenAPI spec from disk. If the cache doesn't exist yet,
// fetches it from Vimeo (requires auth) and writes it to disk before responding.
router.get('/spec', async (req, res) => {
  if (fs.existsSync(SPEC_PATH)) {
    return res.sendFile(SPEC_PATH);
  }
  if (!requireToken(res)) return;
  try {
    const r = await vimeo('GET', '/?openapi=true');
    const spec = await r.json();
    await fs.promises.writeFile(SPEC_PATH, JSON.stringify(spec));
    res.json(spec);
  } catch (e) {
    handleVimeoError(res, e);
  }
});

// Re-fetches the spec from Vimeo and overwrites the disk cache.
// Trigger this manually after Vimeo releases API updates.
router.post('/refresh-spec', async (req, res) => {
  if (!requireToken(res)) return;
  try {
    const r = await vimeo('GET', '/?openapi=true');
    const spec = await r.json();
    await fs.promises.writeFile(SPEC_PATH, JSON.stringify(spec));
    res.json({ ok: true, paths: Object.keys(spec.paths).length });
  } catch (e) {
    handleVimeoError(res, e);
  }
});

// Returns the private-endpoints annotation list. Initially an empty array —
// populate data/vimeo-private-endpoints.json after Gemini research on Vimeo's docs.
router.get('/private', (req, res) => {
  if (fs.existsSync(PRIVATE_PATH)) {
    return res.sendFile(PRIVATE_PATH);
  }
  res.json([]);
});

module.exports = router;
