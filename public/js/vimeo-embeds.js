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
const eventsPanel     = document.getElementById('eventsSection');
const eventsToggle    = document.getElementById('eventsToggle');
const eventsBody      = document.getElementById('eventsBody');
const eventLog        = document.getElementById('eventLog');
const eventLogEmpty   = document.getElementById('eventLogEmpty');
const toastContainer  = document.getElementById('toastContainer');

// ── Helpers ───────────────────────────────────────────────────────────────────
function extractVimeoId(input) {
  const trimmed = input.trim();
  // Bare numeric ID
  if (/^\d+$/.test(trimmed)) return trimmed;
  // URL with /videos/ID or /video/ID
  const p1 = /\/videos?\/(\d+)(?:\/|\?|$)/;
  // URL with vimeo.com/ID
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
  entry.innerHTML = `<span class="event-log__time">${escHtml(time)}</span><span class="event-log__icon">${escHtml(icon)}</span> ${escHtml(text)}`;

  // Newest at top
  if (eventLog.firstChild) {
    eventLog.insertBefore(entry, eventLog.firstChild);
  } else {
    eventLog.appendChild(entry);
  }

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

// ── Player events ─────────────────────────────────────────────────────────────
const EVENT_DEFS = [
  { name: 'loaded',              icon: '📼', fmt: (d) => `Loaded — video ID: ${d.id}` },
  { name: 'play',                icon: '▶',  fmt: (d) => `Play at ${formatTime(d.seconds)}` },
  { name: 'pause',               icon: '⏸',  fmt: (d) => `Pause at ${formatTime(d.seconds)}` },
  { name: 'ended',               icon: '⏹',  fmt: () => 'Ended' },
  { name: 'seeked',              icon: '↩',  fmt: (d) => `Seeked to ${formatTime(d.seconds)}` },
  { name: 'bufferstart',         icon: '⏳',  fmt: () => 'Buffering…' },
  { name: 'bufferend',           icon: '✓',  fmt: () => 'Buffer ready' },
  { name: 'volumechange',        icon: '🔊',  fmt: (d) => `Volume: ${Math.round((d.volume ?? 0) * 100)}%${d.muted ? ' (muted)' : ''}` },
  { name: 'playbackratechange',  icon: '⚡',  fmt: (d) => `Playback rate: ${d.playbackRate}×` },
  { name: 'fullscreenchange',    icon: '⛶',  fmt: (d) => `Fullscreen: ${d.fullscreen ? 'on' : 'off'}` },
  { name: 'error',               icon: '✗',  fmt: (d) => `Error: ${d.message || JSON.stringify(d)}` },
];

function formatTime(seconds) {
  if (seconds == null) return '—';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

function attachPlayerEvents(player) {
  EVENT_DEFS.forEach(({ name, icon, fmt }) => {
    player.on(name, (data) => logEvent(icon, fmt(data)));
  });

  // Throttled timeupdate — at most once per 5 seconds
  player.on('timeupdate', (data) => {
    const now = Date.now();
    if (now - state.lastTimeupdateLog < 5000) return;
    state.lastTimeupdateLog = now;
    logEvent('⏱', `${formatTime(data.seconds)} / ${formatTime(data.duration)}`);
  });
}

// ── Load player ───────────────────────────────────────────────────────────────
async function loadPlayer(videoId) {
  // Destroy existing player to avoid iframe leaks
  if (state.player) {
    try { await state.player.destroy(); } catch (_) {}
    state.player = null;
  }
  playerContainer.innerHTML = '';
  state.lastTimeupdateLog = 0;

  state.player = new Vimeo.Player(playerContainer, {
    id: parseInt(videoId, 10),
    responsive: true,
  });

  attachPlayerEvents(state.player);
}

// ── Inject JSON-LD into <head> ────────────────────────────────────────────────
function injectJsonLd(jsonld) {
  // Remove any previously injected block
  const existing = document.getElementById('vimeo-jsonld');
  if (existing) existing.remove();

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id = 'vimeo-jsonld';
  script.textContent = JSON.stringify(jsonld, null, 2);
  document.head.appendChild(script);
}

// ── Populate metadata tables ──────────────────────────────────────────────────
const SCHEMA_FIELD_NOTES = {
  name:                 'Primary title indexed by search engines; appears in video rich results',
  description:          'Helps engines understand context; used for snippet generation and AEO answers',
  thumbnailUrl:         'Required for rich result eligibility in Google Search',
  uploadDate:           'Required for rich results; affects freshness scoring',
  duration:             'ISO 8601 format (e.g. PT4M30S); shown in Google rich results',
  contentUrl:           'Canonical URL of the video content',
  embedUrl:             'Allows engines to understand the embed context',
  'author.name':        'Associates content with a creator for E-E-A-T signals',
  'interactionStatistic': 'Play count helps engines gauge content popularity',
};

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

function renderSchemaTable(jsonld) {
  const rows = [
    ['name',                 jsonld.name,            SCHEMA_FIELD_NOTES.name],
    ['description',          jsonld.description,     SCHEMA_FIELD_NOTES.description],
    ['thumbnailUrl',         jsonld.thumbnailUrl,    SCHEMA_FIELD_NOTES.thumbnailUrl],
    ['uploadDate',           jsonld.uploadDate,      SCHEMA_FIELD_NOTES.uploadDate],
    ['duration',             jsonld.duration,        SCHEMA_FIELD_NOTES.duration],
    ['contentUrl',           jsonld.contentUrl,      SCHEMA_FIELD_NOTES.contentUrl],
    ['embedUrl',             jsonld.embedUrl,        SCHEMA_FIELD_NOTES['embedUrl']],
    ['author.name',          jsonld.author?.name,   SCHEMA_FIELD_NOTES['author.name']],
  ];

  if (jsonld.interactionStatistic) {
    rows.push(['interactionStatistic', jsonld.interactionStatistic.userInteractionCount.toLocaleString() + ' plays', SCHEMA_FIELD_NOTES.interactionStatistic]);
  }

  schemaTableBody.innerHTML = rows.map(([field, value, note]) => `
    <tr>
      <td><code>${escHtml(field)}</code></td>
      <td class="metadata-value">${escHtml(value || '—')}</td>
      <td class="metadata-note">${escHtml(note || '')}</td>
    </tr>
  `).join('');
}

function renderOgTable(data, jsonld) {
  const embedSrc = jsonld.embedUrl;
  const thumb = jsonld.thumbnailUrl;

  const tags = [
    ['og:type',           'video.other',          'Tells platforms this is a video page'],
    ['og:title',          jsonld.name,             'Title shown in rich link previews'],
    ['og:description',    jsonld.description,      'Description shown in rich link previews'],
    ['og:image',          thumb,                   'Thumbnail for social share cards'],
    ['og:url',            jsonld.contentUrl,       'Canonical URL for deduplication'],
    ['og:video',          embedSrc,                'Enables inline video playback in some platforms'],
    ['og:video:type',     'text/html',             'Embed content type'],
    ['og:video:width',    data.width ? String(data.width) : '—',   'Player width'],
    ['og:video:height',   data.height ? String(data.height) : '—', 'Player height'],
  ];

  ogTableBody.innerHTML = tags.map(([prop, content, note]) => `
    <tr>
      <td><code>${escHtml(prop)}</code></td>
      <td class="metadata-value">${escHtml(content || '—')}</td>
    </tr>
  `).join('');
}

function populateMetadata(data) {
  const jsonld = buildJsonLd(data);

  // Header
  videoTitle.textContent = data.name || 'Video';
  videoSubtitle.textContent = data.user?.name ? `by ${data.user.name}` : '';
  vimeoLink.href = data.link || '#';

  // Tables
  renderSchemaTable(jsonld);
  renderOgTable(data, jsonld);

  // Raw JSON-LD code block
  jsonldOutput.textContent = JSON.stringify(jsonld, null, 2);
  jsonldDetails.removeAttribute('open');

  // Actually inject the JSON-LD into <head>
  injectJsonLd(jsonld);
}

// ── Reset state between loads ─────────────────────────────────────────────────
function resetContent() {
  schemaTableBody.innerHTML = '';
  ogTableBody.innerHTML = '';
  jsonldOutput.textContent = '';
  clearEventLog();

  const existing = document.getElementById('vimeo-jsonld');
  if (existing) existing.remove();

  // Collapse the events panel
  eventsPanel.classList.remove('collapsible--open');
  eventsToggle.setAttribute('aria-expanded', 'false');
}

// ── Form submit ───────────────────────────────────────────────────────────────
loadForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  inputError.classList.add('hidden');

  const videoId = extractVimeoId(videoInput.value);
  if (!videoId) {
    inputError.textContent = 'Could not find a Vimeo video ID. Try a URL like https://vimeo.com/76979871 or just the numeric ID.';
    inputError.classList.remove('hidden');
    return;
  }

  state.videoId = videoId;
  setLoading(true);
  resetContent();

  try {
    const res = await fetch(`/api/vimeo/videos/${videoId}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Vimeo API returned ${res.status}`);
    }
    const data = await res.json();

    await loadPlayer(videoId);
    populateMetadata(data);

    contentSection.classList.remove('hidden');
    contentSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch (err) {
    showToast(`Failed to load video: ${err.message}`, 'error', 6000);
  } finally {
    setLoading(false);
  }
});

// ── Events collapsible ────────────────────────────────────────────────────────
eventsToggle.addEventListener('click', toggleEvents);
eventsToggle.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleEvents(); }
});

function toggleEvents() {
  const isOpen = eventsPanel.classList.toggle('collapsible--open');
  eventsToggle.setAttribute('aria-expanded', String(isOpen));
}
