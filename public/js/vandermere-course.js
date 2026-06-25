// vandermere-course.js — STS-1000 Sales Readiness course interactivity.
// Handles: progress tracking, knowledge checks, transcript toggle,
// resource/glossary search, and hooks for future Vimeo federated search.

(function () {
  'use strict';

  // ─── Progress (localStorage) ────────────────────────────────────────────────

  const STORAGE_KEY = 'vandermere-progress-v1';

  function loadProgress() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch (_) {
      return {};
    }
  }

  function saveProgress(progress) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (_) {}
  }

  function markLessonComplete(moduleId) {
    const progress = loadProgress();
    progress[moduleId] = { completedAt: new Date().toISOString() };
    saveProgress(progress);
    renderProgress(progress);
  }

  function isComplete(moduleId, progress) {
    return !!(progress && progress[moduleId]);
  }

  // Update all progress-related UI across the page.
  function renderProgress(progress) {
    const moduleItems = document.querySelectorAll('[data-module-id]');
    let completedCount = 0;
    let totalCount = 0;

    moduleItems.forEach(function (el) {
      const mid = el.dataset.moduleId;
      if (!mid) return;
      totalCount++;
      const done = isComplete(mid, progress);
      if (done) completedCount++;

      // Sidebar step check
      const check = el.querySelector('.course-nav__step-check');
      const numEl = el.querySelector('.course-nav__step-num');
      if (check) check.classList.toggle('is-hidden', !done);
      if (numEl) numEl.classList.toggle('is-hidden', done);

      // Landing module cards
      const badge = document.getElementById('mod-badge-' + mid);
      const checkEl = document.getElementById('mod-check-' + mid);
      if (badge) {
        badge.textContent = done ? 'Complete' : 'Not Started';
        badge.classList.toggle('course-module-card__badge--done', done);
      }
      if (checkEl) checkEl.classList.toggle('is-visible', done);

      // Readiness page rows
      const statusEl = document.getElementById('ready-status-' + mid);
      if (statusEl) {
        statusEl.innerHTML = done
          ? '<span class="readiness-badge readiness-badge--complete">Complete</span>'
          : '<span class="readiness-badge readiness-badge--incomplete">Incomplete</span>';
      }
    });

    // Sidebar progress bar
    const fill = document.getElementById('navProgressFill');
    const text = document.getElementById('navProgressText');
    const bar  = document.getElementById('navProgressBar');
    if (totalCount > 0) {
      const pct = Math.round((completedCount / totalCount) * 100);
      if (fill) fill.style.width = pct + '%';
      if (text) text.textContent = completedCount + ' of ' + totalCount + ' lessons complete';
      if (bar)  bar.setAttribute('aria-valuenow', completedCount);
    }

    // Landing page hero CTA
    const startBtn = document.getElementById('courseStartBtn');
    const heroBadge = document.getElementById('heroStatusBadge');
    if (startBtn && completedCount > 0 && completedCount < totalCount) {
      startBtn.textContent = 'Continue Course';
      if (heroBadge) { heroBadge.textContent = completedCount + '/' + totalCount + ' COMPLETE'; }
    } else if (completedCount >= totalCount && totalCount > 0) {
      if (startBtn) startBtn.textContent = 'Review Course';
      if (heroBadge) { heroBadge.textContent = 'COURSE COMPLETE'; heroBadge.classList.add('course-status-badge--done'); }
    }

    // Readiness page note
    const note = document.getElementById('readinessNote');
    const submitBtn = document.getElementById('finalQuizSubmit');
    if (note && submitBtn) {
      if (completedCount >= totalCount) {
        note.textContent = 'All lessons complete. You may now take the assessment.';
        submitBtn.disabled = false;
      }
    }
  }

  // ─── Knowledge Check (lesson page) ──────────────────────────────────────────

  function initKnowledgeCheck() {
    const kc = document.getElementById('knowledgeCheck');
    if (!kc) return;

    const moduleId = kc.dataset.moduleId;
    const answers  = kc.querySelectorAll('.knowledge-check__answer');
    const feedback = document.getElementById('kcFeedback');
    const result   = document.getElementById('kcResult');
    const retry    = document.getElementById('kcRetry');
    let answered   = false;

    answers.forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (answered) return;
        answered = true;
        const correct = btn.dataset.correct === 'true';

        answers.forEach(function (b) {
          b.disabled = true;
          b.setAttribute('aria-checked', b === btn ? 'true' : 'false');
          if (b.dataset.correct === 'true') b.classList.add('is-correct');
          if (b === btn && !correct) b.classList.add('is-wrong');
        });

        result.textContent = correct ? 'Correct.' : 'Not quite.';
        result.className = 'knowledge-check__feedback-result ' + (correct ? 'is-correct' : 'is-wrong');
        feedback.hidden = false;

        if (correct) {
          markLessonComplete(moduleId);
        }
      });
    });

    if (retry) {
      retry.addEventListener('click', function () {
        answered = false;
        feedback.hidden = true;
        answers.forEach(function (b) {
          b.disabled = false;
          b.classList.remove('is-correct', 'is-wrong');
          b.setAttribute('aria-checked', 'false');
        });
      });
    }
  }

  // ─── Transcript Toggle ───────────────────────────────────────────────────────

  function initTranscript() {
    const toggle = document.getElementById('transcriptToggle');
    const body   = document.getElementById('transcriptBody');
    if (!toggle || !body) return;

    toggle.addEventListener('click', function () {
      const open = !body.hidden;
      body.hidden = open;
      toggle.setAttribute('aria-expanded', String(!open));
      toggle.querySelector('.transcript-panel__chevron').style.transform = open ? '' : 'rotate(90deg)';
    });
  }

  // ─── Final Quiz (readiness page) ────────────────────────────────────────────

  function initFinalQuiz() {
    const quiz   = document.getElementById('finalQuiz');
    const submit = document.getElementById('finalQuizSubmit');
    if (!quiz || !submit) return;

    const questions   = quiz.querySelectorAll('.final-quiz__question');
    const answered    = new Set();

    questions.forEach(function (qEl) {
      const buttons = qEl.querySelectorAll('.knowledge-check__answer');
      buttons.forEach(function (btn) {
        btn.addEventListener('click', function () {
          if (answered.has(qEl.dataset.qid)) return;
          answered.add(qEl.dataset.qid);

          buttons.forEach(function (b) {
            b.disabled = true;
            if (b.dataset.correct === 'true') b.classList.add('is-correct');
            if (b === btn && b.dataset.correct !== 'true') b.classList.add('is-wrong');
          });

          const explanation = qEl.querySelector('.final-quiz__explanation');
          if (explanation) explanation.classList.remove('hidden');

          if (answered.size === questions.length) {
            submit.disabled = false;
          }
        });
      });
    });

    submit.addEventListener('click', function () {
      let correct = 0;
      questions.forEach(function (qEl) {
        const chosen = qEl.querySelector('.knowledge-check__answer.is-correct:not(.is-wrong)');
        if (chosen) correct++;
      });

      const completeEl = document.getElementById('readinessComplete');
      const scoreEl    = document.getElementById('finalScore');
      if (completeEl) {
        if (scoreEl) scoreEl.textContent = correct + ' of ' + questions.length + ' correct';
        quiz.closest('.readiness-section').style.display = 'none';
        submit.style.display = 'none';
        completeEl.classList.remove('hidden');
        completeEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  // ─── Resource Library Search + Filter ───────────────────────────────────────

  function initResourceLibrary() {
    const searchInput = document.getElementById('resourceSearch');
    const filterBtns  = document.querySelectorAll('.library-filter');
    const emptyState  = document.getElementById('libraryEmpty');
    if (!searchInput && !filterBtns.length) return;

    let activeCategory = 'all';

    function filterResources() {
      const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
      const items = document.querySelectorAll('.resource-item');
      const groups = document.querySelectorAll('.library-category-group');
      let visibleCount = 0;

      items.forEach(function (item) {
        const cat    = item.dataset.category || '';
        const tags   = item.dataset.tags || '';
        const title  = item.dataset.title || '';
        const summary = item.querySelector('.resource-item__summary');
        const sumText = summary ? summary.textContent.toLowerCase() : '';

        const matchCat   = activeCategory === 'all' || cat === activeCategory;
        const matchQuery = !query || title.includes(query) || tags.includes(query) || sumText.includes(query);

        const visible = matchCat && matchQuery;
        item.classList.toggle('hidden', !visible);
        if (visible) visibleCount++;
      });

      groups.forEach(function (g) {
        const catId  = g.dataset.categoryGroup;
        const visible = activeCategory === 'all' || catId === activeCategory;
        const hasVisibleItems = g.querySelectorAll('.resource-item:not(.hidden)').length > 0;
        g.classList.toggle('hidden', !visible || (query && !hasVisibleItems));
      });

      if (emptyState) emptyState.classList.toggle('hidden', visibleCount > 0);

      // Hook: if a query is present, also run Vimeo federated video search
      if (query.length >= 2) {
        searchVimeoVideos(query);
      } else {
        hideVideoResults();
      }
    }

    if (searchInput) {
      searchInput.addEventListener('input', filterResources);
    }

    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        activeCategory = btn.dataset.category;
        filterBtns.forEach(function (b) {
          b.classList.toggle('is-active', b === btn);
          b.setAttribute('aria-selected', b === btn ? 'true' : 'false');
        });
        filterResources();
      });
    });
  }

  // ─── Glossary Search ─────────────────────────────────────────────────────────

  function initGlossarySearch() {
    const searchInput = document.getElementById('glossarySearch');
    const emptyState  = document.getElementById('glossaryEmpty');
    if (!searchInput) return;

    searchInput.addEventListener('input', function () {
      const query = searchInput.value.toLowerCase().trim();
      const terms  = document.querySelectorAll('.glossary-term');
      let visible  = 0;

      terms.forEach(function (term) {
        const match = !query
          || (term.dataset.term     || '').includes(query)
          || (term.dataset.definition || '').includes(query)
          || (term.dataset.translation || '').includes(query);
        term.classList.toggle('hidden', !match);
        if (match) visible++;
      });

      if (emptyState) emptyState.classList.toggle('hidden', visible > 0);
    });
  }

  // ─── Vimeo Federated Search ───────────────────────────────────────────────────
  // Metadata for all Vandermere videos is cached server-side (1-hour TTL) via a
  // single Vimeo Federated Search API call (query=vandermere). Searches here do
  // local text matching against that cache — no per-query API calls.

  function searchVimeoVideos(query) {
    var spinner = document.getElementById('searchSpinner');
    if (spinner) spinner.classList.remove('hidden');

    fetch('/vandermere/search?q=' + encodeURIComponent(query))
      .then(function (r) { return r.json(); })
      .then(function (data) { renderVideoResults(data.videos || []); })
      .catch(function () { hideVideoResults(); })
      .finally(function () { if (spinner) spinner.classList.add('hidden'); });
  }

  function renderVideoResults(videos) {
    var container = document.getElementById('videoSearchResults');
    var list      = document.getElementById('videoResultsList');
    if (!container || !list) return;

    if (!videos.length) {
      hideVideoResults();
      return;
    }

    list.innerHTML = videos.map(function (v) {
      var img = v.thumbnail
        ? '<img src="' + v.thumbnail + '" alt="" class="video-result-item__thumb" loading="lazy">'
        : '';
      return '<a href="' + (v.lessonPath || '#') + '" class="video-result-item">'
        + img
        + '<span class="video-result-item__title">' + v.title + '</span>'
        + '</a>';
    }).join('');

    container.classList.remove('hidden');
  }

  function hideVideoResults() {
    const container = document.getElementById('videoSearchResults');
    if (container) container.classList.add('hidden');
  }

  // ─── Init ────────────────────────────────────────────────────────────────────

  document.addEventListener('DOMContentLoaded', function () {
    const progress = loadProgress();
    renderProgress(progress);
    initKnowledgeCheck();
    initTranscript();
    initFinalQuiz();
    initResourceLibrary();
    initGlossarySearch();
  });

})();
