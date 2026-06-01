// ── Debug ─────────────────────────────────────────────────────────────────────
// Set to false to silence verbose SDK tracing once events are confirmed working.
const DEBUG = true;
const dbg = (...args) => DEBUG && console.debug('[vimeo-embeds]', ...args);

dbg('script loaded — Vimeo SDK available:', typeof window.Vimeo !== 'undefined');

// If the SDK CDN script hasn't loaded yet it will be available by the time the
// user submits the form (it loads synchronously in <head>). Log if it's missing
// on DOMContentLoaded so we catch load failures early.
document.addEventListener('DOMContentLoaded', () => {
  dbg('DOM ready — Vimeo SDK available:', typeof window.Vimeo !== 'undefined');
  if (typeof window.Vimeo === 'undefined') {
    console.warn('[vimeo-embeds] Vimeo Player SDK not found on window. Check that player.vimeo.com/api/player.js loaded without error (Network tab).');
  }
});

// ── State ─────────────────────────────────────────────────────────────────────
const state = {
  videoId: null,
  player: null,
  lastTimeupdateLog: 0,
};

// ── DOM refs ──────────────────────────────────────────────────────────────────
const loadForm        = document.getElementById('loadForm');
const videoInput      = document.getElementById('videoInput');
const loadBtn         = document.getElementById('loadBtn');
const inputError      = document.getElementById('inputError');
const contentSection  = document.getElementById('contentSection');
const playerContainer = document.getElementById('playerContainer');
const videoTitle      = document.getElementById('videoTitle');
const videoSubtitle   = document.getElementById('videoSubtitle');
const vimeoLink       = document.getElementById('vimeoLink');
const schemaTableBody = document.getElementById('schemaTableBody');
const ogTableBody     = document.getElementById('ogTableBody');
const jsonldOutput    = document.getElementById('jsonldOutput');
const jsonldDetails   = document.getElementById('jsonldDetails');
const jsonldPanel     = document.getElementById('jsonldPanel');
const jsonldToggle    = document.getElementById('jsonldToggle');
const ogPanel         = document.getElementById('ogPanel');
const ogToggle        = document.getElementById('ogToggle');
const eventsSection   = document.getElementById('eventsSection');
const eventsToggle    = document.getElementById('eventsToggle');
const eventLog        = document.getElementById('eventLog');
const eventLogEmpty   = document.getElementById('eventLogEmpty');
const toastContainer  = document.getElementById('toastContainer');

// ── Helpers ───────────────────────────────────────────────────────────────────
function extractVimeoId(input) {
  const trimmed = input.trim();
  if (/^\d+$/.test(trimmed)) return trimmed;
  const p1 = /\/videos?\/(\d+)(?:\/|\?|$)/;
  const p2 = /vimeo\.com\/(\d+)(?:\/|\?|$)/;
  const m = p1.exec(trimmed) || p2.exec(trimmed);
  return m ? m[1] : null;
}

function isoDuration(totalSeconds) {
  const s = Math.round(totalSeconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  let iso = 'PT';
  if (h) iso += `${h}H`;
  if (m) iso += `${m}M`;
  if (sec || (!h && !m)) iso += `${sec}S`;
  return iso;
}

function escHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function extractIframeSrc(html) {
  if (!html) return '';
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const iframe = doc.querySelector('iframe');
  return iframe ? iframe.getAttribute('src') : '';
}

function formatTime(seconds) {
  if (seconds == null) return '—';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

// ── Toasts ────────────────────────────────────────────────────────────────────
function showToast(message, type = 'info', duration = 4000) {
  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.textContent = message;
  toastContainer.appendChild(toast);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('toast--visible'));
  });
  setTimeout(() => {
    toast.classList.remove('toast--visible');
    toast.addEventListener('transitionend', () => toast.remove(), { once: true });
  }, duration);
}

// ── Loading state ─────────────────────────────────────────────────────────────
function setLoading(loading) {
  loadBtn.disabled = loading;
  loadBtn.textContent = loading ? 'Loading…' : 'Load Video';
}

// ── Event log ─────────────────────────────────────────────────────────────────
function logEvent(icon, text) {
  const time = new Date().toLocaleTimeString();
  const entry = document.createElement('div');
  entry.className = 'event-log__entry';

  const timeEl = document.createElement('span');
  timeEl.className = 'event-log__time';
  timeEl.textContent = time;

  const iconEl = document.createElement('span');
  iconEl.className = 'event-log__icon';
  iconEl.textContent = icon;

  const textNode = document.createTextNode(' ' + text);

  entry.appendChild(timeEl);
  entry.appendChild(iconEl);
  entry.appendChild(textNode);

  // Newest at top
  eventLog.insertBefore(entry, eventLog.firstChild || null);

  // Cap at 100 entries
  while (eventLog.children.length > 100) {
    eventLog.removeChild(eventLog.lastChild);
  }

  eventLogEmpty.classList.add('hidden');
}

function clearEventLog() {
  eventLog.innerHTML = '';
  eventLogEmpty.classList.remove('hidden');
}

// ── Player event definitions ──────────────────────────────────────────────────
// Event names are from the Vimeo Player SDK reference:
// https://developer.vimeo.com/player/sdk/reference#events
//
// NOTE: The 'loaded' SDK event fires only when player.loadVideo() is called on
// an already-initialized player — NOT on initial creation. Initial readiness
// is handled via player.ready() below.
const EVENT_DEFS = [
  { name: 'play',               icon: '▶',  fmt: (d) => `Play at ${formatTime(d.seconds)}` },
  { name: 'pause',              icon: '⏸',  fmt: (d) => `Pause at ${formatTime(d.seconds)}` },
  { name: 'ended',              icon: '⏹',  fmt: () => 'Ended' },
  { name: 'seeking',            icon: '⤳',  fmt: (d) => `Seeking to ${formatTime(d.seconds)}` },
  { name: 'seeked',             icon: '↩',  fmt: (d) => `Seeked to ${formatTime(d.seconds)}` },
  { name: 'bufferstart',        icon: '⏳',  fmt: () => 'Buffering…' },
  { name: 'bufferend',          icon: '✓',  fmt: () => 'Buffer ready' },
  { name: 'volumechange',       icon: '🔊',  fmt: (d) => `Volume: ${Math.round((d.volume ?? 0) * 100)}%` },
  { name: 'playbackratechange', icon: '⚡',  fmt: (d) => `Playback rate: ${d.playbackRate}×` },
  { name: 'fullscreenchange',   icon: '⛶',  fmt: (d) => `Fullscreen: ${d.fullscreen ? 'on' : 'off'}` },
  { name: 'qualitychange',      icon: '◉',  fmt: (d) => `Quality: ${d.quality}` },
  { name: 'error',              icon: '✗',  fmt: (d) => `Error: ${d.message || JSON.stringify(d)}` },
];

function attachPlayerEvents(player) {
  dbg('attachPlayerEvents called — attaching', EVENT_DEFS.length, 'listeners');

  EVENT_DEFS.forEach(({ name, icon, fmt }) => {
    dbg('  attaching listener for:', name);
    player.on(name, (data) => {
      dbg(`event fired: "${name}"`, data);
      try {
        logEvent(icon, fmt(data));
      } catch (err) {
        console.error('[vimeo-embeds] error in handler for event', name, err);
      }
    });
  });

  // timeupdate fires multiple times per second — throttle to one log per 5s
  player.on('timeupdate', (data) => {
    const now = Date.now();
    if (now - state.lastTimeupdateLog < 5000) return;
    state.lastTimeupdateLog = now;
    dbg('event fired: "timeupdate" (throttled)', data);
    logEvent('⏱', `${formatTime(data.seconds)} / ${formatTime(data.duration)}`);
  });

  dbg('all listeners attached');
}

// ── Load player ───────────────────────────────────────────────────────────────
async function loadPlayer(videoId) {
  dbg('loadPlayer called with videoId:', videoId);

  if (state.player) {
    dbg('destroying previous player');
    try { await state.player.destroy(); } catch (e) { dbg('destroy error (ignored):', e); }
    state.player = null;
  }
  playerContainer.innerHTML = '';
  state.lastTimeupdateLog = 0;

  dbg('creating new Vimeo.Player');
  const player = new Vimeo.Player(playerContainer, {
    id: parseInt(videoId, 10),
    responsive: true,
  });
  state.player = player;
  dbg('Vimeo.Player instance created:', player);

  // Attach all event listeners immediately — the SDK queues them internally
  // until the player iframe is ready.
  attachPlayerEvents(player);

  // player.ready() resolves when the iframe has fully initialized and is
  // accepting commands. This is the correct hook for the initial load signal
  // (not the 'loaded' event, which fires only on subsequent loadVideo() calls).
  dbg('awaiting player.ready()');
  try {
    await player.ready();
    dbg('player.ready() resolved — player is operational');
    logEvent('✓', `Player ready — video ID ${videoId}`);
  } catch (err) {
    dbg('player.ready() rejected:', err);
    console.error('[vimeo-embeds] player.ready() failed:', err);
    logEvent('✗', `Player failed to initialize: ${err.message}`);
    throw err;
  }
}

// ── JSON-LD generation + head injection ───────────────────────────────────────
function buildJsonLd(data) {
  const embedSrc = extractIframeSrc(data.embed?.html);
  const thumb = data.pictures?.base_link || '';
  const plays = data.stats?.plays;

  const jsonld = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: data.name || '',
    description: data.description || '',
    thumbnailUrl: thumb,
    uploadDate: data.created_time || '',
    duration: isoDuration(data.duration || 0),
    contentUrl: data.link || '',
    embedUrl: embedSrc,
    author: {
      '@type': 'Person',
      name: data.user?.name || '',
    },
  };

  if (plays != null) {
    jsonld.interactionStatistic = {
      '@type': 'InteractionCounter',
      interactionType: { '@type': 'WatchAction' },
      userInteractionCount: plays,
    };
  }

  return jsonld;
}

function injectJsonLd(jsonld) {
  const existing = document.getElementById('vimeo-jsonld');
  if (existing) existing.remove();

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id = 'vimeo-jsonld';
  script.textContent = JSON.stringify(jsonld, null, 2);
  document.head.appendChild(script);
  dbg('JSON-LD injected into <head>');
}

// ── Metadata tables ───────────────────────────────────────────────────────────
const SCHEMA_NOTES = {
  name:                   'Primary title indexed by search engines; appears in video rich results',
  description:            'Helps engines understand context; used for snippet generation and AEO answers',
  thumbnailUrl:           'Required for rich result eligibility in Google Search',
  uploadDate:             'Required for rich results; affects content freshness scoring',
  duration:               'ISO 8601 format (e.g. PT4M30S); surfaced in Google video rich results',
  contentUrl:             'Canonical URL of the video; used for deduplication across syndication',
  embedUrl:               'Confirms this page hosts an embed, not just a link',
  'author.name':          'Associates content with a creator; supports E-E-A-T signals',
  interactionStatistic:   'Play count helps engines gauge popularity and engagement',
};

const OG_PURPOSES = {
  'og:type':         'Tells platforms this is a video page, enabling video-specific features',
  'og:title':        'Title shown in rich link previews',
  'og:description':  'Description shown in rich link previews and shares',
  'og:image':        'Thumbnail image for social share cards',
  'og:url':          'Canonical URL; prevents duplicate content issues across shares',
  'og:video':        'Enables inline video playback on Facebook and some other platforms',
  'og:video:type':   'MIME type of the embed',
  'og:video:width':  'Player dimensions for embed rendering',
  'og:video:height': 'Player dimensions for embed rendering',
};

function renderSchemaTable(jsonld) {
  const rows = [
    ['name',               jsonld.name],
    ['description',        jsonld.description],
    ['thumbnailUrl',       jsonld.thumbnailUrl],
    ['uploadDate',         jsonld.uploadDate],
    ['duration',           jsonld.duration],
    ['contentUrl',         jsonld.contentUrl],
    ['embedUrl',           jsonld.embedUrl],
    ['author.name',        jsonld.author?.name],
  ];

  if (jsonld.interactionStatistic) {
    rows.push(['interactionStatistic', jsonld.interactionStatistic.userInteractionCount.toLocaleString() + ' plays']);
  }

  schemaTableBody.innerHTML = rows.map(([field, value]) => `
    <tr>
      <td><code>${escHtml(field)}</code></td>
      <td class="metadata-value" title="${escHtml(value || '')}">${escHtml(value || '—')}</td>
      <td class="metadata-note">${escHtml(SCHEMA_NOTES[field] || '')}</td>
    </tr>
  `).join('');
}

function renderOgTable(data, jsonld) {
  const tags = [
    ['og:type',          'video.other'],
    ['og:title',         jsonld.name],
    ['og:description',   jsonld.description],
    ['og:image',         jsonld.thumbnailUrl],
    ['og:url',           jsonld.contentUrl],
    ['og:video',         jsonld.embedUrl],
    ['og:video:type',    'text/html'],
    ['og:video:width',   data.width  ? String(data.width)  : '—'],
    ['og:video:height',  data.height ? String(data.height) : '—'],
  ];

  ogTableBody.innerHTML = tags.map(([prop, content]) => `
    <tr>
      <td><code>${escHtml(prop)}</code></td>
      <td class="metadata-value" title="${escHtml(content || '')}">${escHtml(content || '—')}</td>
      <td class="metadata-note">${escHtml(OG_PURPOSES[prop] || '')}</td>
    </tr>
  `).join('');
}

function populateMetadata(data) {
  dbg('populateMetadata called');
  const jsonld = buildJsonLd(data);

  videoTitle.textContent = data.name || 'Video';
  videoSubtitle.textContent = data.user?.name ? `by ${data.user.name}` : '';
  vimeoLink.href = data.link || '#';

  renderSchemaTable(jsonld);
  renderOgTable(data, jsonld);

  jsonldOutput.textContent = JSON.stringify(jsonld, null, 2);
  jsonldDetails.removeAttribute('open');

  injectJsonLd(jsonld);
}

// ── Collapsible helpers ───────────────────────────────────────────────────────
function makeToggle(panel, toggle) {
  function doToggle() {
    const isOpen = panel.classList.toggle('collapsible--open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  }
  toggle.addEventListener('click', doToggle);
  toggle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); doToggle(); }
  });
  return {
    open()  { panel.classList.add('collapsible--open');    toggle.setAttribute('aria-expanded', 'true'); },
    close() { panel.classList.remove('collapsible--open'); toggle.setAttribute('aria-expanded', 'false'); },
  };
}

const jsonldCollapsible  = makeToggle(jsonldPanel,   jsonldToggle);
const ogCollapsible      = makeToggle(ogPanel,       ogToggle);
const eventsCollapsible  = makeToggle(eventsSection, eventsToggle);

// ── Reset between loads ───────────────────────────────────────────────────────
function resetContent() {
  schemaTableBody.innerHTML = '';
  ogTableBody.innerHTML = '';
  jsonldOutput.textContent = '';
  clearEventLog();

  const existing = document.getElementById('vimeo-jsonld');
  if (existing) existing.remove();

  jsonldCollapsible.close();
  ogCollapsible.close();
  eventsCollapsible.close();
}

// ── Form submit ───────────────────────────────────────────────────────────────
loadForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  inputError.classList.add('hidden');

  const raw = videoInput.value;
  const videoId = extractVimeoId(raw);
  dbg('form submitted — raw input:', raw, '— parsed videoId:', videoId);

  if (!videoId) {
    inputError.textContent = 'Could not find a Vimeo video ID. Try a URL like https://vimeo.com/76979871 or just the numeric ID.';
    inputError.classList.remove('hidden');
    return;
  }

  state.videoId = videoId;
  setLoading(true);
  resetContent();

  try {
    dbg('fetching video metadata for', videoId);
    const res = await fetch(`/api/vimeo/videos/${videoId}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Vimeo API returned ${res.status}`);
    }
    const data = await res.json();
    dbg('metadata fetched successfully:', data.name);

    await loadPlayer(videoId);
    populateMetadata(data);

    // Auto-open the metadata panels so the structured data is immediately visible
    jsonldCollapsible.open();
    ogCollapsible.open();

    contentSection.classList.remove('hidden');
    contentSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch (err) {
    dbg('load failed:', err);
    showToast(`Failed to load video: ${err.message}`, 'error', 6000);
  } finally {
    setLoading(false);
  }
});
