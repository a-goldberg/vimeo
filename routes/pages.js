const express = require('express');
const router = express.Router();
const projects = require('../data/projects');
const updates = require('../data/updates');

// Home
router.get('/', (req, res) => {
  const featured = projects.filter((p) => p.featured);
  const recent = updates.slice(0, 5);
  res.render('pages/home', { title: 'Project Hub', featured, recent, projects });
});

// Tools index
router.get('/tools', (req, res) => {
  res.render('pages/tools', {
    title: 'Tools',
    projects: projects.filter((p) => p.category === 'Tools'),
  });
});

// Customer Projects index
router.get('/customer-projects', (req, res) => {
  res.render('pages/customer-projects', {
    title: 'Customer Projects',
    projects: projects.filter((p) => p.category === 'Customer Projects'),
  });
});

// API Docs index
router.get('/api-docs', (req, res) => {
  res.render('pages/api-docs', {
    title: 'API Docs',
    projects: projects.filter((p) => p.category === 'API Docs'),
  });
});

// Testing index
router.get('/testing', (req, res) => {
  res.render('pages/testing', {
    title: 'Testing',
    projects: projects.filter((p) => p.category === 'Testing'),
  });
});

// Smart Card tool
router.get('/smart-card', (req, res) => {
  res.render('pages/smart-card', {
    title: 'Smart Card Preview',
    extraScripts: '<script src="/js/smart-card.js"></script>',
  });
});

// Project detail — driven entirely by data/projects.js
router.get('/projects/:slug', (req, res, next) => {
  const project = projects.find((p) => p.slug === req.params.slug);
  if (!project) return next(); // passes to the 404 handler in server.js
  res.render('pages/project-detail', { title: project.title, project });
});

module.exports = router;
