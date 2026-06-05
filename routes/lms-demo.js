const express = require('express');
const router = express.Router();
const multer = require('multer');
const AdmZip = require('adm-zip');
const path = require('path');
const fs = require('fs');

const CONTENT_DIR = path.join('/tmp', 'lms-demo-content');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
  fileFilter(req, file, cb) {
    cb(null, file.mimetype === 'application/zip' || file.originalname.endsWith('.zip'));
  },
});

// Find the SCO launch file inside an imsmanifest.xml string.
// Tries the adlcp:scormType="sco" attribute first; falls back to the first
// resource href that looks like an HTML file.
function findLaunchPath(xml) {
  const scoAttr =
    xml.match(/adlcp:scormType=["']sco["'][^>]*\shref=["']([^"'#?]+)["']/i) ||
    xml.match(/\shref=["']([^"'#?]+)["'][^>]*adlcp:scormType=["']sco["']/i);
  if (scoAttr) return scoAttr[1];

  const anyHref = xml.match(/<resource[^>]+\shref=["']([^"'#?]*\.html?)["']/i);
  return anyHref ? anyHref[1] : null;
}

// Accept a SCORM ZIP, extract it, and return the launch path + course title.
router.post('/upload', upload.single('scorm'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded. Please select a .zip file.' });
  }

  try {
    // Clear previous content and re-extract
    fs.rmSync(CONTENT_DIR, { recursive: true, force: true });
    fs.mkdirSync(CONTENT_DIR, { recursive: true });

    const zip = new AdmZip(req.file.buffer);
    zip.extractAllTo(CONTENT_DIR, true);

    const manifestPath = path.join(CONTENT_DIR, 'imsmanifest.xml');
    if (!fs.existsSync(manifestPath)) {
      return res.status(400).json({ error: 'No imsmanifest.xml found. This does not appear to be a valid SCORM package.' });
    }

    const manifestXml = fs.readFileSync(manifestPath, 'utf-8');
    const launchPath = findLaunchPath(manifestXml);

    if (!launchPath) {
      return res.status(400).json({ error: 'Could not locate the SCO launch file in the manifest. Try re-exporting from Vimeo.' });
    }

    const titleMatch = manifestXml.match(/<title>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : "Sample Course";

    res.json({ launchPath, title });
  } catch (err) {
    console.error('[lms-demo] upload error:', err);
    res.status(500).json({ error: 'Failed to process the SCORM package.' });
  }
});

// Serve extracted SCORM content files (same-origin, so window.parent.API works directly).
router.use('/content', express.static(CONTENT_DIR));

module.exports = router;
