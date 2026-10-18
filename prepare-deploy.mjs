import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const deployDir = path.join(__dirname, 'dist_deploy');
fs.mkdirSync(deployDir, { recursive: true });

// Copy index.html and bundle.js
fs.copyFileSync(path.join(__dirname, 'index.html'), path.join(deployDir, 'index.html'));
fs.copyFileSync(path.join(__dirname, 'bundle.js'), path.join(deployDir, 'bundle.js'));

// Create _redirects for Netlify SPA routing (single page app)
fs.writeFileSync(path.join(deployDir, '_redirects'), '/*    /index.html   200\n', 'utf8');

// Create netlify.toml
const netlifyToml = `[build]
  publish = "."

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
`;
fs.writeFileSync(path.join(deployDir, 'netlify.toml'), netlifyToml, 'utf8');

// Also put _redirects and netlify.toml directly in root of sales-website for convenience
fs.writeFileSync(path.join(__dirname, '_redirects'), '/*    /index.html   200\n', 'utf8');
fs.writeFileSync(path.join(__dirname, 'netlify.toml'), netlifyToml, 'utf8');

console.log('dist_deploy files created:', fs.readdirSync(deployDir));
