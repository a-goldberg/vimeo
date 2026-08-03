const express = require('express');
const router = express.Router();
const course = require('../data/vandermere-course');
const { getVimeoAccess } = require('../middleware/vimeo-access');
const { vimeo } = require('../utils/vimeo');

const EXTRA_SCRIPTS = '<script src="/js/vandermere-course.js"></script>';

// ─── Federated video search ───────────────────────────────────────────────────

// Map Vimeo numeric ID → lesson path, derived from course data at startup.
const lessonByNumericId = {};
course.modules.forEach((m) => {
  if (m.vimeoId) {
    const numericId = String(m.vimeoId).split(':')[0];
    lessonByNumericId[numericId] = `/vandermere/lesson/${m.number}`;
  }
});

// Module-level metadata cache. One Vimeo API call fetches all Vandermere
// videos; subsequent searches are matched locally with no per-query calls.
const metaCaches = new Map();
const META_TTL = 60 * 60 * 1000; // 1 hour

async function fetchVandermereVideos(token, meta) {
  if (!token) return [];

  const params = new URLSearchParams({
    query: 'vandermere',
    filter: 'video',
    per_page: 25,
    fields: 'video.uri,video.name,video.description,video.tags.tag,video.pictures',
  });

  try {
    const res = await vimeo('GET', `/search/189331235/items?${params}`, { token, _meta: meta });
    if (!res.ok) return [];

    const data = await res.json();
    // filter=video in the query guarantees only video items; no need to check item.type
    // (the fields param strips root-level fields like type from the response)
    return (data.data || [])
      .filter((item) => item.video?.uri)
      .map((item) => {
        const numericId = item.video.uri.split('/').pop();
        if (!lessonByNumericId[numericId]) return null;
        const sizes = item.video.pictures?.sizes || [];
        const thumb = (sizes.find((s) => s.width >= 200 && s.width <= 400) || sizes[0])?.link || null;
        return {
          name: item.video.name || '',
          description: item.video.description || '',
          tags: (item.video.tags || []).map((t) => (typeof t === 'string' ? t : t.tag || '')),
          thumbnail: thumb,
          lessonPath: lessonByNumericId[numericId],
        };
      })
      .filter(Boolean);
  } catch (_) {
    return [];
  }
}

router.get('/search', async (req, res) => {
  const q = (req.query.q || '').trim().slice(0, 100).toLowerCase();
  if (q.length < 2) return res.json({ videos: [] });

  const access = getVimeoAccess(req);
  const cacheKey = access.connected ? req.session.vimeoAuth.userUri || 'oauth' : 'demo';
  const metaCache = metaCaches.get(cacheKey) || { ts: 0, videos: [] };
  const requestMeta = {
    referer: req.headers.referer || null,
    ip: (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket.remoteAddress,
    userAgent: req.headers['user-agent'] || null,
    vimeoUserUri: req.session?.vimeoAuth?.userUri || null,
  };

  if (Date.now() - metaCache.ts > META_TTL) {
    const fresh = await fetchVandermereVideos(access.token, requestMeta);
    if (fresh.length > 0 || metaCache.videos.length === 0) {
      metaCache.videos = fresh;
      metaCache.ts = Date.now();
      metaCaches.set(cacheKey, metaCache);
    }
  }

  const videos = metaCache.videos
    .filter(
      (v) =>
        v.name.toLowerCase().includes(q) ||
        v.description.toLowerCase().includes(q) ||
        v.tags.some((t) => t.toLowerCase().includes(q))
    )
    .map((v) => ({ title: v.name, thumbnail: v.thumbnail, lessonPath: v.lessonPath }));

  res.json({ videos });
});

router.get('/', (req, res) => {
  res.render('pages/vandermere/index', {
    title: 'STS-1000 Sales Readiness — Vandermere Applied Dynamics',
    course,
    extraScripts: EXTRA_SCRIPTS,
  });
});

router.get('/lesson/:id', (req, res, next) => {
  const id = parseInt(req.params.id, 10);
  const module = course.modules.find((m) => m.number === id);
  if (!module) return next();

  const prevModule = course.modules.find((m) => m.number === id - 1) || null;
  const nextModule = course.modules.find((m) => m.number === id + 1) || null;
  const relatedResources = course.resources.filter((r) => module.relatedResourceIds.includes(r.id));

  res.render('pages/vandermere/lesson', {
    title: `Lesson ${id}: ${module.title} — STS-1000 Sales Readiness`,
    course,
    module,
    prevModule,
    nextModule,
    relatedResources,
    extraScripts: EXTRA_SCRIPTS,
  });
});

router.get('/resources', (req, res) => {
  res.render('pages/vandermere/resources', {
    title: 'Resource Library — STS-1000 Sales Readiness',
    course,
    resources: course.resources,
    categories: course.resourceCategories,
    extraScripts: EXTRA_SCRIPTS,
  });
});

router.get('/glossary', (req, res) => {
  res.render('pages/vandermere/glossary', {
    title: 'Glossary — STS-1000 Sales Readiness',
    course,
    glossary: course.glossary,
    extraScripts: EXTRA_SCRIPTS,
  });
});

router.get('/readiness', (req, res) => {
  res.render('pages/vandermere/readiness', {
    title: 'Sales Readiness Checkpoint — STS-1000',
    course,
    readiness: course.finalReadiness,
    extraScripts: EXTRA_SCRIPTS,
  });
});

module.exports = router;
