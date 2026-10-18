import { build } from 'file:///C:/ashish/project2.0.3/frontend/node_modules/vite/dist/node/index.js';
import react from 'file:///C:/ashish/project2.0.3/frontend/node_modules/@vitejs/plugin-react/dist/index.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frontendNodeModules = 'C:/ashish/project2.0.3/frontend/node_modules';

console.log('⚡ Compiling LandingPageView.tsx with Vite & Rollup...');

await build({
  root: __dirname,
  plugins: [react()],
  resolve: {
    extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json'],
    alias: {
      'react': path.join(frontendNodeModules, 'react'),
      'react-dom': path.join(frontendNodeModules, 'react-dom'),
      'lucide-react': path.join(frontendNodeModules, 'lucide-react'),
      'xlsx': path.join(frontendNodeModules, 'xlsx'),
      'recharts': path.join(frontendNodeModules, 'recharts'),
      'pdf-lib': path.join(frontendNodeModules, 'pdf-lib'),
    }
  },
  build: {
    rollupOptions: {
      input: path.join(__dirname, 'entry.tsx'),
      output: {
        format: 'iife',
        name: 'CorpvexLandingApp',
        entryFileNames: 'bundle.js',
        inlineDynamicImports: true,
      }
    },
    outDir: path.join(__dirname, 'dist-bundle'),
    emptyOutDir: true,
    minify: true,
  }
});

const bundlePath = path.join(__dirname, 'dist-bundle', 'bundle.js');
const bundleCode = fs.readFileSync(bundlePath, 'utf8');

// Copy bundle.js to root directory as well for modular use
fs.writeFileSync(path.join(__dirname, 'bundle.js'), bundleCode, 'utf8');

// Build standalone index.html
const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>CorpVEX ERP — Next-Gen Enterprise Suite for Garment, Wholesale & Modern Trade</title>
  <meta name="description" content="India's fastest desktop & cloud ERP for Garment, Wholesale, Manufacturing and Modern Trade. Automated GST billing, 1-click e-Invoice, WhatsApp PDF delivery, multi-godown stock, and double-entry accounting." />
  <meta name="keywords" content="CorpVEX ERP, GST Billing Software, Garment ERP, Wholesale Accounting, e-Invoice software, Surat ERP, Indian Business ERP" />
  <meta property="og:title" content="CorpVEX ERP — Next-Gen Enterprise Suite" />
  <meta property="og:description" content="High-speed ERP built for high-throughput Indian enterprises. Invoicing, Inventory, Ledger, WhatsApp and 1-Click e-Invoice." />
  <meta property="og:type" content="website" />
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23e8a838' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><rect x='4' y='2' width='16' height='20' rx='2'/><path d='M9 22v-4h6v4'/><path d='M8 6h.01'/><path d='M16 6h.01'/><path d='M12 6h.01'/><path d='M12 10h.01'/><path d='M12 14h.01'/><path d='M16 10h.01'/><path d='M16 14h.01'/><path d='M8 10h.01'/><path d='M8 14h.01'/></svg>" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Poppins:wght@600;700;800;900&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body {
      font-family: 'Poppins', 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #070e1b;
      color: #f8fafc;
      min-height: 100vh;
      overflow-x: hidden;
      scroll-behavior: smooth;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    #root { min-height: 100vh; }
    /* Scrollbar styling */
    ::-webkit-scrollbar { width: 8px; height: 8px; }
    ::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); }
    ::-webkit-scrollbar-thumb { background: rgba(232, 168, 56, 0.4); border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: rgba(232, 168, 56, 0.7); }
  </style>
</head>
<body>
  <div id="root"></div>
  <script>
${bundleCode}
  </script>
</body>
</html>`;

fs.writeFileSync(path.join(__dirname, 'index.html'), htmlContent, 'utf8');
console.log('✅ Generated standalone index.html (' + Math.round(htmlContent.length / 1024) + ' KB)!');
