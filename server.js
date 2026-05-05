require('dotenv').config();
const express = require('express');
const ejsLayouts = require('express-ejs-layouts');
const helmet = require('helmet');
const path = require('path');

const { formatDate, statusClass } = require('./utils/helpers');
const pagesRouter = require('./routes/pages');
const apiRouter = require('./routes/api');
const smartCardRouter = require('./routes/smart-card');
const webinarRouter = require('./routes/webinar-registration');

const app = express();
const PORT = process.env.PORT || 3000;

// Security headers
app.use(helmet({ contentSecurityPolicy: false }));

// Parse request bodies (conservative size limit)
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));

// Static files — CSS, JS, images
app.use(express.static(path.join(__dirname, 'public')));

// Self-contained project pages (each lives in /projects/<name>/index.html)
app.use('/projects-static', express.static(path.join(__dirname, 'projects')));

// EJS templating — pages/home.ejs etc. are wrapped by views/layouts/main.ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(ejsLayouts);
app.set('layout', 'layouts/main');

// Make helper functions available in every EJS template without importing them.
// To add a new helper: define it in utils/helpers.js, import it here, add it below.
app.locals.formatDate = formatDate;
app.locals.statusClass = statusClass;

// Page routes (HTML)
app.use('/', pagesRouter);

// Data routes (JSON) — hub project metadata
app.use('/api', apiRouter);

// Tool-specific API routes — each tool gets its own sub-path
app.use('/api/smart-card', smartCardRouter);
app.use('/api/webinar-registration', webinarRouter);

// Health check — returns JSON; useful for uptime monitors and confirming deploys
app.get('/health', (req, res) => {
  res.json({ status: 'ok', app: 'vimeo-home', timestamp: new Date().toISOString() });
});

// 404 — rendered as a styled page, not a plain-text error
app.use((req, res) => {
  res.status(404).render('pages/error', {
    title: 'Page Not Found',
    statusCode: 404,
    message: "The page you're looking for doesn't exist.",
  });
});

// 500 — four-argument signature is required by Express to recognize error handlers
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.error(err.stack);
  res.status(500).render('pages/error', {
    title: 'Server Error',
    statusCode: 500,
    message: 'Something went wrong on the server.',
  });
});

app.listen(PORT, () => {
  console.log(`vimeo-home running at http://localhost:${PORT}`);
});
