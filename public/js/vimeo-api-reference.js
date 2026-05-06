/* Vimeo API Reference — client-side spec browser and documentation renderer */

const state = {
  spec: null,
  ops: [],
  groups: {},
  privateList: [],
  activeOp: null,
  searchQuery: '',
};

const dom = {
  nav: document.getElementById('api-nav'),
  doc: document.getElementById('api-doc'),
  empty: document.getElementById('api-empty'),
  search: document.getElementById('api-search'),
  toast: document.getElementById('toast'),
};

// ── Spec helpers ──────────────────────────────────────────────────────────────

function resolveRef(schemaOrRef, spec) {
  if (!schemaOrRef || !schemaOrRef.$ref) return schemaOrRef;
  const name = schemaOrRef.$ref.split('/').pop();
  return spec.components?.schemas?.[name] ?? schemaOrRef;
}

function flattenSpec(spec, privateList) {
  const ops = [];
  for (const [path, pathItem] of Object.entries(spec.paths)) {
    for (const method of ['get', 'post', 'patch', 'put', 'delete']) {
      const op = pathItem[method];
      if (!op) continue;
      const scopes = op.security?.[0]?.oauth2 ?? [];
      const isPrivate = privateList.some(
        p => p.method.toLowerCase() === method && p.path === path
      );
      ops.push({
        method,
        path,
        operationId: op.operationId || `${method}_${path}`,
        summary: op.summary || '',
        description: op.description || '',
        tags: op.tags || [],
        parameters: op.parameters || [],
        requestBody: op.requestBody || null,
        responses: op.responses || {},
        scopes,
        isPrivate,
      });
    }
  }
  return ops;
}

function groupByTag(ops) {
  const groups = {};
  for (const op of ops) {
    const tag = op.tags[0] || 'Other';
    const backslash = tag.indexOf('\\');
    const cat = backslash > -1 ? tag.slice(0, backslash) : tag;
    const sub = backslash > -1 ? tag.slice(backslash + 1) : '';
    if (!groups[cat]) groups[cat] = {};
    if (!groups[cat][sub]) groups[cat][sub] = [];
    groups[cat][sub].push(op);
  }
  return groups;
}

function prettifyId(id) {
  return id.replace(/_alt\d+$/, '').replace(/_/g, ' ').replace(/^./, c => c.toUpperCase());
}

// ── Sidebar rendering ─────────────────────────────────────────────────────────

function renderSidebar(groups, activeOp) {
  dom.nav.innerHTML = '';
  const cats = Object.keys(groups).sort();
  for (const cat of cats) {
    const subs = groups[cat];
    const allOps = Object.values(subs).flat();
    if (allOps.length === 0) continue;

    const group = document.createElement('div');
    group.className = 'collapsible';

    const toggle = document.createElement('button');
    toggle.className = 'collapsible__toggle api-nav__group-toggle';
    toggle.innerHTML = `
      <svg class="collapsible__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="m9 18 6-6-6-6"/>
      </svg>
      <span>${escHtml(cat)}</span>
      <span class="api-nav__count">${allOps.length}</span>
    `;
    toggle.addEventListener('click', () => group.classList.toggle('collapsible--open'));

    const body = document.createElement('div');
    body.className = 'collapsible__body';
    const inner = document.createElement('div');
    inner.className = 'collapsible__content';

    const subKeys = Object.keys(subs).sort();
    for (const sub of subKeys) {
      if (sub) {
        const label = document.createElement('div');
        label.className = 'api-nav__subtag';
        label.textContent = sub;
        inner.appendChild(label);
      }
      for (const op of subs[sub]) {
        const row = document.createElement('div');
        const isActive = activeOp && activeOp.operationId === op.operationId;
        row.className = 'api-nav__row' + (isActive ? ' is-active' : '');
        row.dataset.opId = op.operationId;
        row.innerHTML = `
          <span class="method-badge method-badge--${op.method}">${op.method.toUpperCase()}</span>
          <span class="api-nav__name">${escHtml(prettifyId(op.operationId))}</span>
        `;
        row.addEventListener('click', () => selectEndpoint(op));
        inner.appendChild(row);
      }
    }

    body.appendChild(inner);
    group.appendChild(toggle);
    group.appendChild(body);

    // Auto-open group containing the active op
    if (activeOp && allOps.some(o => o.operationId === activeOp.operationId)) {
      group.classList.add('collapsible--open');
    }

    dom.nav.appendChild(group);
  }
}

// ── Documentation panel rendering ─────────────────────────────────────────────

function getCapLabel(op) {
  if (op.isPrivate) return { label: 'Private', cls: 'cap-badge--private' };
  if (op.scopes.length === 0) return null;
  return { label: 'Public', cls: 'cap-badge--public' };
}

function buildPathHtml(path) {
  return escHtml(path).replace(/\{([^}]+)\}/g, '<span class="url-block__param">{$1}</span>');
}

function buildParamTable(params, spec, privateList, path) {
  if (params.length === 0) return '';
  const rows = params.map(p => {
    const schema = resolveRef(p.schema, spec) || {};
    const isPriv = privateList.some(
      e => e.path === path && e.param === p.name
    );
    const typeStr = schema.type || (schema.$ref ? schema.$ref.split('/').pop() : '—');
    const enumVals = schema.enum ? `<div class="param-enum">Values: ${schema.enum.map(v => `<code>${escHtml(String(v))}</code>`).join(' ')}</div>` : '';
    const privBadge = isPriv ? ' <span class="priv-tag">PRIVATE</span>' : '';
    const reqDot = p.required ? '<span class="req-dot" title="Required"></span>' : '';
    return `<tr>
      <td><div class="param-name">${reqDot}<span>${escHtml(p.name)}</span>${privBadge}</div></td>
      <td><span class="param-type">${escHtml(typeStr)}</span></td>
      <td class="param-desc">${escHtml(p.description || '')}${enumVals}</td>
    </tr>`;
  }).join('');
  return `<table class="param-table">
    <thead><tr><th style="width:160px">Parameter</th><th style="width:90px">Type</th><th>Description</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>`;
}

function buildBodyTable(requestBody, spec) {
  if (!requestBody) return '';
  const content = requestBody.content || {};
  const contentType = Object.keys(content)[0] || 'application/json';
  const schema = resolveRef(content[contentType]?.schema, spec) || {};
  const props = schema.properties || {};
  const required = schema.required || [];

  if (Object.keys(props).length === 0) return `<div class="content-type-label">${escHtml(contentType)}</div>`;

  const rows = Object.entries(props).map(([name, rawSchema]) => {
    const propSchema = resolveRef(rawSchema, spec) || {};
    const typeStr = propSchema.type || (propSchema.$ref ? propSchema.$ref.split('/').pop() : '—');
    const enumVals = propSchema.enum ? `<div class="param-enum">Values: ${propSchema.enum.map(v => `<code>${escHtml(String(v))}</code>`).join(' ')}</div>` : '';
    const reqDot = required.includes(name) ? '<span class="req-dot" title="Required"></span>' : '';
    return `<tr>
      <td><div class="param-name">${reqDot}<span>${escHtml(name)}</span></div></td>
      <td><span class="param-type">${escHtml(typeStr)}</span></td>
      <td class="param-desc">${escHtml(propSchema.description || '')}${enumVals}</td>
    </tr>`;
  }).join('');

  return `<div class="content-type-label">${escHtml(contentType)}</div>
  <table class="param-table">
    <thead><tr><th style="width:160px">Parameter</th><th style="width:90px">Type</th><th>Description</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>`;
}

function buildResponseSection(responses, spec) {
  const statusRows = Object.entries(responses).map(([code, resp]) => {
    const cls = code.startsWith('2') ? 's-2xx' : code.startsWith('5') ? 's-5xx' : 's-4xx';
    return `<tr>
      <td><span class="status-badge ${cls}">${escHtml(code)}</span></td>
      <td class="param-desc">${escHtml(resp.description || '')}</td>
    </tr>`;
  }).join('');

  // Build JSON example from first 2xx response schema
  let exampleHtml = '';
  for (const [code, resp] of Object.entries(responses)) {
    if (!code.startsWith('2')) continue;
    const content = resp.content || {};
    const ct = Object.keys(content)[0];
    if (!ct) break;
    const schema = resolveRef(content[ct]?.schema, spec);
    if (!schema) break;
    const example = content[ct]?.example || schema.example || buildExampleFromSchema(schema, spec, 0);
    if (example) {
      exampleHtml = `<pre class="ex-json">${escHtml(JSON.stringify(example, null, 2))}</pre>`;
    }
    break;
  }

  return `
    <div class="resp-section">
      <div class="resp-tabs" role="tablist">
        <button class="resp-tab is-active" onclick="switchRespTab(this,'resp-status')">Status codes</button>
        ${exampleHtml ? '<button class="resp-tab" onclick="switchRespTab(this,\'resp-example\')">Example response</button>' : ''}
      </div>
      <div id="resp-status" class="resp-pane is-active">
        <table class="param-table">
          <thead><tr><th style="width:72px">Status</th><th>Description</th></tr></thead>
          <tbody>${statusRows}</tbody>
        </table>
      </div>
      ${exampleHtml ? `<div id="resp-example" class="resp-pane">${exampleHtml}</div>` : ''}
    </div>`;
}

function buildExampleFromSchema(schema, spec, depth) {
  if (depth > 2) return null;
  const resolved = resolveRef(schema, spec) || {};
  if (resolved.example !== undefined) return resolved.example;
  if (resolved.type === 'object' && resolved.properties) {
    const obj = {};
    for (const [k, v] of Object.entries(resolved.properties).slice(0, 6)) {
      const child = resolveRef(v, spec) || {};
      obj[k] = child.example !== undefined ? child.example :
                child.type === 'string' ? '' :
                child.type === 'number' || child.type === 'integer' ? 0 :
                child.type === 'boolean' ? false :
                child.type === 'array' ? [] : null;
    }
    return obj;
  }
  if (resolved.type === 'array') return [];
  return null;
}

function selectEndpoint(op) {
  state.activeOp = op;

  // Update sidebar active state
  document.querySelectorAll('.api-nav__row').forEach(r => {
    r.classList.toggle('is-active', r.dataset.opId === op.operationId);
  });

  const cap = getCapLabel(op);
  const capBadge = cap ? `<span class="cap-badge ${cap.cls}">${cap.label}</span>` : '';

  const pathParams = op.parameters.filter(p => p.in === 'path');
  const queryParams = op.parameters.filter(p => p.in === 'query');
  const hasBody = !!op.requestBody;

  const [cat, sub] = (op.tags[0] || 'Other').split('\\');
  const breadcrumb = [cat, sub, prettifyId(op.operationId)].filter(Boolean)
    .map((s, i, arr) => i < arr.length - 1
      ? `<span>${escHtml(s)}</span><span class="breadcrumb__sep">›</span>`
      : `<span>${escHtml(s)}</span>`)
    .join('');

  const scopeSection = op.scopes.length > 0 ? `
    <div class="scope-banner">
      <svg class="scope-banner__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      <div>
        <div class="scope-banner__label">Required scope${op.scopes.length > 1 ? 's' : ''}</div>
        <div class="scope-tags">${op.scopes.map(s => `<span class="scope-badge">${escHtml(s)}</span>`).join('')}</div>
        <div class="scope-banner__note">Your access token must include ${op.scopes.length > 1 ? 'these scopes' : 'this scope'}.</div>
      </div>
    </div>` : '';

  dom.doc.innerHTML = `
    <nav class="breadcrumb">${breadcrumb}</nav>

    <div class="api-ep-header">
      <div>
        <h1 class="api-ep-title">${escHtml(prettifyId(op.operationId))} ${capBadge}</h1>
        <p class="api-ep-summary">${escHtml(op.summary)}</p>
      </div>
      <a href="/vimeo-api-playground?op=${encodeURIComponent(op.operationId)}" class="btn btn--primary api-try-btn">
        Try it out
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
          <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
        </svg>
      </a>
    </div>

    <hr class="api-divider">

    <div class="url-block">
      <span class="method-badge method-badge--${op.method} url-block__method">${op.method.toUpperCase()}</span>
      <span class="url-block__base">https://api.vimeo.com</span>
      <span class="url-block__path">${buildPathHtml(op.path)}</span>
    </div>

    ${scopeSection}

    ${pathParams.length > 0 ? `<h3 class="api-section-heading">Path parameters</h3>${buildParamTable(pathParams, state.spec, state.privateList, op.path)}` : ''}
    ${queryParams.length > 0 ? `<h3 class="api-section-heading">Query parameters</h3>${buildParamTable(queryParams, state.spec, state.privateList, op.path)}` : ''}
    ${hasBody ? `<h3 class="api-section-heading">Body parameters</h3>${buildBodyTable(op.requestBody, state.spec)}` : ''}

    <hr class="api-divider">
    <h3 class="api-section-heading">Responses</h3>
    ${buildResponseSection(op.responses, state.spec)}
  `;

  dom.empty.hidden = true;
  dom.doc.hidden = false;
  dom.doc.scrollTop = 0;
  dom.doc.parentElement.scrollTop = 0;
}

// ── Search ────────────────────────────────────────────────────────────────────

function applySearch(query) {
  state.searchQuery = query;
  const q = query.toLowerCase().trim();
  const filtered = q ? state.ops.filter(op =>
    op.path.toLowerCase().includes(q) ||
    op.summary.toLowerCase().includes(q) ||
    prettifyId(op.operationId).toLowerCase().includes(q) ||
    op.tags.some(t => t.toLowerCase().includes(q))
  ) : state.ops;
  renderSidebar(groupByTag(filtered), state.activeOp);
}

// ── Tab switching (for response section) ─────────────────────────────────────

window.switchRespTab = function(btn, paneId) {
  const section = btn.closest('.resp-section');
  section.querySelectorAll('.resp-tab').forEach(t => t.classList.remove('is-active'));
  section.querySelectorAll('.resp-pane').forEach(p => p.classList.remove('is-active'));
  btn.classList.add('is-active');
  const pane = document.getElementById(paneId);
  if (pane) pane.classList.add('is-active');
};

// ── Toast ─────────────────────────────────────────────────────────────────────

function showToast(msg, type = 'error') {
  dom.toast.textContent = msg;
  dom.toast.className = `toast toast--${type} toast--visible`;
  setTimeout(() => dom.toast.classList.remove('toast--visible'), 4000);
}

// ── Utility ───────────────────────────────────────────────────────────────────

function escHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── Init ──────────────────────────────────────────────────────────────────────

async function init() {
  try {
    const [specRes, privateRes] = await Promise.all([
      fetch('/api/vimeo-reference/spec'),
      fetch('/api/vimeo-reference/private'),
    ]);
    if (!specRes.ok) throw new Error(`Spec fetch failed: ${specRes.status}`);
    state.spec = await specRes.json();
    state.privateList = await privateRes.json();
    state.ops = flattenSpec(state.spec, state.privateList);
    state.groups = groupByTag(state.ops);
    renderSidebar(state.groups, null);
  } catch (e) {
    showToast('Failed to load API spec. Check the server logs.', 'error');
    console.error(e);
  }

  dom.search.addEventListener('input', e => applySearch(e.target.value));

  // Support deep-linking: /vimeo-api-reference?op=<operationId>
  const params = new URLSearchParams(window.location.search);
  const opId = params.get('op');
  if (opId) {
    const op = state.ops.find(o => o.operationId === opId);
    if (op) selectEndpoint(op);
  }
}

init();
