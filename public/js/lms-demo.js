// ── SCORM 1.2 Runtime ────────────────────────────────────────────────────────
// Exposes window.API so the SCORM iframe content can call LMSSetValue() etc.
// Because we serve the SCORM content from our own domain, the iframe can access
// window.parent.API directly — no cross-origin postMessage needed.
window.API = {
  _data: {},

  LMSInitialize() {
    this._data = {};
    updateGradebook();
    return 'true';
  },

  LMSFinish() {
    updateGradebook();
    return 'true';
  },

  LMSGetValue(el) {
    return this._data[el] !== undefined ? String(this._data[el]) : '';
  },

  LMSSetValue(el, val) {
    this._data[el] = val;
    document.dispatchEvent(new CustomEvent('scorm:set', { detail: { el, val } }));
    return 'true';
  },

  LMSCommit() { return 'true'; },
  LMSGetLastError() { return '0'; },
  LMSGetErrorString() { return ''; },
  LMSGetDiagnostic() { return ''; },
};

// ── DOM refs ──────────────────────────────────────────────────────────────────
const dropZone       = document.getElementById('lms-drop-zone');
const dropOverlay    = document.getElementById('lms-drop-overlay');
const iframe         = document.getElementById('lms-iframe');
const fileInputTop   = document.getElementById('lms-file-input');
const fileInputCenter = document.getElementById('lms-file-input-center');
const courseTitle    = document.getElementById('lms-course-title');
const noCourseEl     = document.getElementById('lms-no-course');
const courseItemEl   = document.getElementById('lms-course-item');
const courseItemTitle = document.getElementById('lms-course-item-title');
const courseItemStatus = document.getElementById('lms-course-item-status');
const statusChip     = document.getElementById('lms-status-chip');
const scoreEl        = document.getElementById('lms-score');
const resultEl       = document.getElementById('lms-result');
const timeEl         = document.getElementById('lms-time');
const noInteractions = document.getElementById('lms-no-interactions');
const interactionsTable = document.getElementById('lms-interactions-table');
const interactionsBody  = document.getElementById('lms-interactions-body');
const toast          = document.getElementById('toast');

// ── Upload & course loading ───────────────────────────────────────────────────
fileInputTop.addEventListener('change', () => handleFileSelect(fileInputTop.files[0]));
fileInputCenter.addEventListener('change', () => handleFileSelect(fileInputCenter.files[0]));

// Drag-and-drop on the center drop zone
dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropOverlay.classList.remove('hidden');
});

dropZone.addEventListener('dragleave', (e) => {
  if (!dropZone.contains(e.relatedTarget)) {
    dropOverlay.classList.add('hidden');
  }
});

dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropOverlay.classList.add('hidden');
  const file = e.dataTransfer.files[0];
  if (file) handleFileSelect(file);
});

// Also accept drops anywhere on the page when a course is already loaded
document.addEventListener('dragover', (e) => e.preventDefault());
document.addEventListener('drop', (e) => {
  e.preventDefault();
  const file = e.dataTransfer.files[0];
  if (file) handleFileSelect(file);
});

function handleFileSelect(file) {
  if (!file) return;
  if (!file.name.toLowerCase().endsWith('.zip')) {
    showToast('Please select a .zip SCORM package.', 'error');
    return;
  }
  uploadScorm(file);
}

async function uploadScorm(file) {
  courseTitle.textContent = 'Loading…';
  showToast('Uploading SCORM package…', 'info');

  const formData = new FormData();
  formData.append('scorm', file);

  try {
    const res = await fetch('/api/lms-demo/upload', { method: 'POST', body: formData });
    const data = await res.json();

    if (!res.ok) throw new Error(data.error || 'Upload failed.');

    loadCourse(data.launchPath, data.title);
    showToast(`"${data.title}" loaded successfully.`, 'success');
  } catch (err) {
    courseTitle.textContent = 'No course loaded';
    showToast(err.message, 'error');
  }

  // Reset file inputs so the same file can be re-selected
  fileInputTop.value = '';
  fileInputCenter.value = '';
}

function loadCourse(launchPath, title) {
  // Update topbar and sidebar
  courseTitle.textContent = title;
  courseItemTitle.textContent = title;
  courseItemStatus.textContent = 'In Progress';
  noCourseEl.classList.add('hidden');
  courseItemEl.classList.remove('hidden');

  // Reset SCORM data store and gradebook
  window.API._data = {};
  updateGradebook();

  // Show iframe, hide drop zone
  dropZone.classList.add('hidden');
  iframe.classList.remove('hidden');
  iframe.src = `/api/lms-demo/content/${launchPath}`;
}

// ── SCORM data → Gradebook ────────────────────────────────────────────────────
document.addEventListener('scorm:set', () => {
  updateGradebook();
  updateInteractions();
});

function updateGradebook() {
  const data = window.API._data;

  // Status
  const rawStatus = (data['cmi.core.lesson_status'] || 'not attempted').toLowerCase();
  const { label, cssClass } = statusInfo(rawStatus);
  statusChip.textContent = label;
  statusChip.className = `lms-status-chip lms-status-chip--${cssClass}`;
  if (courseItemStatus) courseItemStatus.textContent = label;

  // Score
  const raw = data['cmi.core.score.raw'];
  const max = data['cmi.core.score.max'] || '100';
  scoreEl.textContent = raw !== undefined ? `${raw} / ${max}` : '—';

  // Result (pass/fail derived from lesson_status)
  if (rawStatus === 'passed') {
    resultEl.innerHTML = '<span style="color:var(--color-live)">✓ Passed</span>';
  } else if (rawStatus === 'failed') {
    resultEl.innerHTML = '<span style="color:var(--color-archived)">✗ Failed</span>';
  } else {
    resultEl.textContent = '—';
  }

  // Session time (SCORM format: HH:MM:SS.SS)
  const sessionTime = data['cmi.core.session_time'];
  timeEl.textContent = sessionTime ? formatScormTime(sessionTime) : '—';
}

function updateInteractions() {
  const data = window.API._data;
  const indices = new Set();

  for (const key of Object.keys(data)) {
    const m = key.match(/^cmi\.interactions\.(\d+)\./);
    if (m) indices.add(Number(m[1]));
  }

  if (indices.size === 0) {
    noInteractions.classList.remove('hidden');
    interactionsTable.classList.add('hidden');
    return;
  }

  noInteractions.classList.add('hidden');
  interactionsTable.classList.remove('hidden');
  interactionsBody.innerHTML = '';

  for (const i of [...indices].sort((a, b) => a - b)) {
    const id       = data[`cmi.interactions.${i}.id`] || `Q${i + 1}`;
    const response = data[`cmi.interactions.${i}.student_response`] || '—';
    const result   = (data[`cmi.interactions.${i}.result`] || 'unknown').toLowerCase();

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${escapeHtml(id)}</td>
      <td>${escapeHtml(response)}</td>
      <td>${resultCell(result)}</td>
    `;
    interactionsBody.appendChild(tr);
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function statusInfo(status) {
  switch (status) {
    case 'passed':     return { label: 'Passed',       cssClass: 'success' };
    case 'failed':     return { label: 'Failed',       cssClass: 'error' };
    case 'completed':  return { label: 'Completed',    cssClass: 'success' };
    case 'incomplete': return { label: 'In Progress',  cssClass: 'progress' };
    case 'browsed':    return { label: 'Browsed',      cssClass: 'neutral' };
    default:           return { label: 'Not Started',  cssClass: 'neutral' };
  }
}

function resultCell(result) {
  if (result === 'correct')   return '<span style="color:var(--color-live)">✓ Correct</span>';
  if (result === 'incorrect') return '<span style="color:var(--color-archived)">✗ Incorrect</span>';
  return `<span style="color:var(--color-text-muted)">${escapeHtml(result)}</span>`;
}

// Parse SCORM HH:MM:SS.SS duration into a human-readable string
function formatScormTime(t) {
  const parts = String(t).split(':');
  if (parts.length < 3) return t;
  const h = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  const s = Math.floor(parseFloat(parts[2]));
  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── Toast ─────────────────────────────────────────────────────────────────────
let toastTimer;
function showToast(message, type = 'info') {
  toast.textContent = message;
  toast.className = `toast toast--${type} toast--visible`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('toast--visible'), 4000);
}
