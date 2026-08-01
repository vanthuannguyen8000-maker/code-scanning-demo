const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

// Load the HTML template at startup (fail fast if missing)
const sitePath = path.join(__dirname, 'index.html');
let template;
try {
  template = fs.readFileSync(sitePath, 'utf8');
} catch (err) {
  console.error(`Failed to read template ${sitePath}:`, err);
  process.exit(1);
}

// Simple, safe HTML escaper to prevent XSS when inserting user-provided values
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/\//g, '&#x2F;');
}

app.get('/', (req, res) => {
  const rawName = req.query.name;
  const name = rawName ? escapeHtml(rawName) : 'there';
  const greet = template.replace('%%_USER_NAME%%', name);
  res.type('html').send(greet);
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`The webpage is live on http://localhost:${port} :)`);
});
