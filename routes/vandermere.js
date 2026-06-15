const express = require('express');
const router = express.Router();
const course = require('../data/vandermere-course');

const EXTRA_SCRIPTS = '<script src="/js/vandermere-course.js"></script>';

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
