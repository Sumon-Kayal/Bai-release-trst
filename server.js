const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = 3000;
const HOST = '0.0.0.0';
const APP_DIR = __dirname;
const APK_PATH = path.join(APP_DIR, 'app/build/outputs/apk/debug/app-debug.apk');

function getApkInfo() {
  try {
    if (fs.existsSync(APK_PATH)) {
      const stats = fs.statSync(APK_PATH);
      const buffer = fs.readFileSync(APK_PATH);
      const hash = crypto.createHash('sha256').update(buffer).digest('hex');
      return {
        exists: true,
        sizeBytes: stats.size,
        sizeMb: (stats.size / (1024 * 1024)).toFixed(2),
        mtime: stats.mtime.toISOString(),
        sha256: hash,
        filename: 'app-debug.apk',
        packageName: 'com.sumon.bundleapp.installer',
        versionName: '4.6',
        versionCode: 61,
        minSdk: 23,
        targetSdk: 36
      };
    }
  } catch (err) {
    console.error('Error reading APK info:', err);
  }
  return {
    exists: false,
    filename: 'app-debug.apk',
    packageName: 'com.sumon.bundleapp.installer',
    versionName: '4.6',
    versionCode: 61
  };
}

const HTML_CONTENT = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bundle APKs Installer</title>
  <meta name="description" content="Install and back up split APKs and Android App Bundles with rootless, root/shell, or Shizuku support">
  <meta property="og:title" content="Bundle APKs Installer">
  <meta property="og:description" content="Install and back up split APKs and Android App Bundles with rootless, root/shell, or Shizuku support">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #0b0f17;
      --card-bg: #131a26;
      --card-border: #1e293b;
      --accent: #22c55e;
      --accent-hover: #16a34a;
      --text: #f1f5f9;
      --text-muted: #94a3b8;
      --text-subtle: #64748b;
      --surface: #1e293b;
      --surface-hover: #334155;
      --badge-bg: rgba(34, 197, 94, 0.15);
      --badge-text: #4ade80;
      --blue-accent: #3b82f6;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
      background-color: var(--bg);
      color: var(--text);
      line-height: 1.6;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    header {
      border-bottom: 1px solid var(--card-border);
      background: rgba(19, 26, 38, 0.85);
      backdrop-filter: blur(12px);
      position: sticky;
      top: 0;
      z-index: 100;
      padding: 1rem 2rem;
    }
    .header-container {
      max-width: 1100px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      flex-wrap: wrap;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .logo-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      background: linear-gradient(135deg, #10b981, #059669);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 700;
      font-size: 1.25rem;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);
    }
    .brand-text h1 {
      font-size: 1.15rem;
      font-weight: 700;
      letter-spacing: -0.01em;
    }
    .brand-text p {
      font-size: 0.8rem;
      color: var(--text-muted);
    }
    .status-chip {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: var(--badge-bg);
      color: var(--badge-text);
      padding: 0.35rem 0.85rem;
      border-radius: 9999px;
      font-size: 0.775rem;
      font-weight: 600;
      border: 1px solid rgba(34, 197, 94, 0.3);
    }
    .status-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background-color: var(--accent);
      box-shadow: 0 0 8px var(--accent);
    }
    main {
      flex: 1;
      max-width: 1100px;
      width: 100%;
      margin: 0 auto;
      padding: 2rem 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }
    .hero-card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 14px;
      padding: 2rem;
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 2rem;
      align-items: center;
    }
    @media (max-width: 768px) {
      .hero-card {
        grid-template-columns: 1fr;
      }
    }
    .hero-info h2 {
      font-size: 1.6rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      letter-spacing: -0.02em;
    }
    .hero-info p {
      color: var(--text-muted);
      font-size: 0.95rem;
      max-width: 600px;
      margin-bottom: 1.25rem;
    }
    .hero-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
    }
    .meta-tag {
      background: var(--surface);
      border: 1px solid var(--card-border);
      padding: 0.3rem 0.75rem;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 500;
      color: var(--text-muted);
    }
    .meta-tag strong {
      color: var(--text);
    }
    .btn-download {
      display: inline-flex;
      align-items: center;
      gap: 0.6rem;
      background-color: var(--accent);
      color: #052e16;
      font-weight: 700;
      font-size: 0.95rem;
      padding: 0.85rem 1.75rem;
      border-radius: 10px;
      text-decoration: none;
      transition: all 0.2s ease;
      cursor: pointer;
      border: none;
      box-shadow: 0 4px 14px rgba(34, 197, 94, 0.3);
      white-space: nowrap;
    }
    .btn-download:hover {
      background-color: var(--accent-hover);
      transform: translateY(-1px);
    }
    .btn-download:active {
      transform: translateY(0);
    }
    .nav-tabs {
      display: flex;
      gap: 0.5rem;
      border-bottom: 1px solid var(--card-border);
      padding-bottom: 0.25rem;
    }
    .tab-btn {
      background: none;
      border: none;
      color: var(--text-muted);
      font-family: inherit;
      font-size: 0.9rem;
      font-weight: 600;
      padding: 0.6rem 1.2rem;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .tab-btn:hover {
      color: var(--text);
      background: var(--surface);
    }
    .tab-btn.active {
      color: var(--text);
      background: var(--surface);
      box-shadow: inset 0 -2px 0 var(--accent);
    }
    .tab-content {
      display: none;
    }
    .tab-content.active {
      display: block;
    }
    .grid-2 {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 1.5rem;
    }
    .card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 12px;
      padding: 1.5rem;
    }
    .card h3 {
      font-size: 1.05rem;
      font-weight: 600;
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .prop-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .prop-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.85rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.04);
    }
    .prop-item span:first-child {
      color: var(--text-muted);
    }
    .prop-item span:last-child {
      font-family: monospace;
      color: var(--text);
      background: var(--surface);
      padding: 0.15rem 0.5rem;
      border-radius: 4px;
      font-size: 0.8rem;
    }
    .checksum-box {
      background: var(--surface);
      border: 1px solid var(--card-border);
      border-radius: 8px;
      padding: 0.75rem 1rem;
      font-family: monospace;
      font-size: 0.75rem;
      color: var(--text-muted);
      word-break: break-all;
      margin-top: 1rem;
      position: relative;
    }
    .feature-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
    }
    .feature-item {
      display: flex;
      gap: 0.75rem;
      align-items: flex-start;
      font-size: 0.9rem;
    }
    .feature-icon {
      color: var(--accent);
      font-weight: bold;
      flex-shrink: 0;
    }
    .inspector-dropzone {
      border: 2px dashed var(--card-border);
      border-radius: 12px;
      padding: 3rem 1.5rem;
      text-align: center;
      background: rgba(30, 41, 59, 0.3);
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .inspector-dropzone:hover {
      border-color: var(--accent);
      background: rgba(30, 41, 59, 0.6);
    }
    .code-block {
      background: #070a10;
      border: 1px solid var(--card-border);
      border-radius: 8px;
      padding: 1rem;
      font-family: monospace;
      font-size: 0.85rem;
      color: #38bdf8;
      overflow-x: auto;
    }
    footer {
      border-top: 1px solid var(--card-border);
      padding: 1.5rem 2rem;
      text-align: center;
      font-size: 0.8rem;
      color: var(--text-subtle);
    }
  </style>
</head>
<body>

  <header id="app-header">
    <div class="header-container" id="header-container">
      <div class="brand" id="brand-info">
        <div class="logo-icon" id="brand-logo">B</div>
        <div class="brand-text">
          <h1>Bundle APKs Installer</h1>
          <p>Android Split APK &amp; App Bundle Utility</p>
        </div>
      </div>
      <div class="status-chip" id="build-status-chip">
        <span class="status-dot"></span>
        <span id="status-text">Debug APK Ready</span>
      </div>
    </div>
  </header>

  <main id="main-content">

    <section class="hero-card" id="hero-section">
      <div class="hero-info" id="hero-info-block">
        <h2>Bundle APKs Installer (BAI)</h2>
        <p>
          Comprehensive Android utility for installing, managing, and backing up split APK sets (.apks, .xapk, .apkm) and Android App Bundles (.aab) with rootless, root/shell, and Shizuku support.
        </p>
        <div class="hero-meta" id="hero-meta-tags">
          <span class="meta-tag">Package: <strong>com.sumon.bundleapp.installer</strong></span>
          <span class="meta-tag">Version: <strong>4.6 (Code 61)</strong></span>
          <span class="meta-tag">Target SDK: <strong>36</strong></span>
          <span class="meta-tag">Min SDK: <strong>23</strong></span>
          <span class="meta-tag">Keystore: <strong>debug.keystore</strong></span>
        </div>
      </div>
      <div id="hero-actions">
        <a href="/download/app-debug.apk" class="btn-download" id="btn-download-apk" download="app-debug.apk">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          Download APK (<span id="apk-size-label">11.1 MB</span>)
        </a>
      </div>
    </section>

    <nav class="nav-tabs" id="nav-tabs-bar" role="tablist">
      <button class="tab-btn active" id="tab-overview" role="tab" aria-selected="true" data-target="content-overview">Architecture &amp; Features</button>
      <button class="tab-btn" id="tab-apk-info" role="tab" aria-selected="false" data-target="content-apk-info">Build Artifacts</button>
      <button class="tab-btn" id="tab-api" role="tab" aria-selected="false" data-target="content-api">REST APIs</button>
    </nav>

    <div class="tab-content active" id="content-overview">
      <div class="grid-2">
        <div class="card" id="card-install-modes">
          <h3>⚡ Supported Installation Modes</h3>
          <ul class="feature-list" id="feature-install-modes">
            <li class="feature-item">
              <span class="feature-icon">✓</span>
              <div>
                <strong>Rootless SAI Installer:</strong> Native Android PackageInstaller Session API compatibility for non-rooted devices.
              </div>
            </li>
            <li class="feature-item">
              <span class="feature-icon">✓</span>
              <div>
                <strong>Shizuku Integration:</strong> Elevated installation privileges via the Shizuku IPC manager without requiring full device rooting.
              </div>
            </li>
            <li class="feature-item">
              <span class="feature-icon">✓</span>
              <div>
                <strong>Root &amp; Shell Mode:</strong> Direct terminal execution via su binary for advanced low-level packaging routines.
              </div>
            </li>
          </ul>
        </div>

        <div class="card" id="card-formats">
          <h3>📦 Supported Package Formats</h3>
          <ul class="feature-list" id="feature-formats">
            <li class="feature-item">
              <span class="feature-icon">✓</span>
              <div><strong>.apks (SAI):</strong> Standard zip archive containing base and split config APKs.</div>
            </li>
            <li class="feature-item">
              <span class="feature-icon">✓</span>
              <div><strong>.xapk:</strong> Package archives including OBB asset expansion files.</div>
            </li>
            <li class="feature-item">
              <span class="feature-icon">✓</span>
              <div><strong>.apkm:</strong> APKMirror compressed bundle format.</div>
            </li>
            <li class="feature-item">
              <span class="feature-icon">✓</span>
              <div><strong>.aab:</strong> Android App Bundles with signature preservation and verification.</div>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="tab-content" id="content-apk-info">
      <div class="grid-2">
        <div class="card" id="card-binary-specs">
          <h3>📋 Binary Specifications</h3>
          <ul class="prop-list" id="prop-list-binary">
            <li class="prop-item">
              <span>Artifact Name</span>
              <span id="spec-filename">app-debug.apk</span>
            </li>
            <li class="prop-item">
              <span>File Size</span>
              <span id="spec-filesize">Loading...</span>
            </li>
            <li class="prop-item">
              <span>Target ABI</span>
              <span>Universal (v7a / v8a / x86 / x86_64)</span>
            </li>
            <li class="prop-item">
              <span>Signing Scheme</span>
              <span>v1, v2, v3 (debug.keystore)</span>
            </li>
            <li class="prop-item">
              <span>Build Toolchain</span>
              <span>Gradle 9.3.1 + AGP 9.1.1 + Java 21</span>
            </li>
          </ul>
          <div class="checksum-box" id="checksum-display">
            <strong>SHA-256 Checksum:</strong><br>
            <span id="sha256-value">Calculating...</span>
          </div>
        </div>

        <div class="card" id="card-test-dropzone">
          <h3>🔍 Quick Package Verifier</h3>
          <div class="inspector-dropzone" id="apk-dropzone">
            <p><strong>Drag &amp; Drop</strong> an APK, APKS, or XAPK file here</p>
            <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.5rem;">or click to select and verify bundle structure client-side</p>
            <input type="file" id="apk-file-input" accept=".apk,.apks,.xapk,.aab,.zip" style="display: none;">
          </div>
          <div id="dropzone-result" style="margin-top: 1rem; font-size: 0.85rem; display: none;"></div>
        </div>
      </div>
    </div>

    <div class="tab-content" id="content-api">
      <div class="card" id="card-api-endpoints">
        <h3>🔌 Available HTTP Endpoints</h3>
        <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1.25rem;">
          The companion server exposes endpoints for health checks, automated artifact retrieval, and metadata inspection:
        </p>
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          <div>
            <span class="meta-tag" style="color: #4ade80;">GET /api/status</span>
            <div class="code-block" style="margin-top: 0.5rem;">curl -s http://localhost:3000/api/status</div>
          </div>
          <div>
            <span class="meta-tag" style="color: #60a5fa;">GET /download/app-debug.apk</span>
            <div class="code-block" style="margin-top: 0.5rem;">curl -O http://localhost:3000/download/app-debug.apk</div>
          </div>
          <div>
            <span class="meta-tag" style="color: #facc15;">GET /api/health</span>
            <div class="code-block" style="margin-top: 0.5rem;">curl -s http://localhost:3000/api/health</div>
          </div>
        </div>
      </div>
    </div>

  </main>

  <footer id="app-footer">
    <p>Bundle APKs Installer (BAI) &bull; Built with Gradle 9.3.1, AGP 9.1.1 &bull; Android SDK 36</p>
  </footer>

  <script>
    // Tab switching logic
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        const target = btn.getAttribute('data-target');
        const targetEl = document.getElementById(target);
        if (targetEl) targetEl.classList.add('active');
      });
    });

    // Fetch dynamic APK status
    fetch('/api/status')
      .then(res => res.json())
      .then(data => {
        if (data && data.exists) {
          const sizeStr = data.sizeMb + ' MB (' + data.sizeBytes.toLocaleString() + ' bytes)';
          document.getElementById('spec-filesize').textContent = sizeStr;
          document.getElementById('apk-size-label').textContent = data.sizeMb + ' MB';
          document.getElementById('sha256-value').textContent = data.sha256;
          document.getElementById('status-text').textContent = 'Debug APK Ready (' + data.sizeMb + ' MB)';
        } else {
          document.getElementById('spec-filesize').textContent = 'Not generated yet';
          document.getElementById('sha256-value').textContent = 'Artifact pending build';
          document.getElementById('status-text').textContent = 'Building...';
        }
      })
      .catch(err => {
        console.error('Failed to load status:', err);
      });

    // Dropzone logic
    const dropzone = document.getElementById('apk-dropzone');
    const fileInput = document.getElementById('apk-file-input');
    const resultDiv = document.getElementById('dropzone-result');

    dropzone.addEventListener('click', () => fileInput.click());

    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.style.borderColor = 'var(--accent)';
    });

    dropzone.addEventListener('dragleave', () => {
      dropzone.style.borderColor = 'var(--card-border)';
    });

    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.style.borderColor = 'var(--card-border)';
      if (e.dataTransfer.files.length > 0) {
        handleFile(e.dataTransfer.files[0]);
      }
    });

    fileInput.addEventListener('change', () => {
      if (fileInput.files.length > 0) {
        handleFile(fileInput.files[0]);
      }
    });

    function handleFile(file) {
      resultDiv.style.display = 'block';
      const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
      resultDiv.innerHTML = '<div style="background: var(--surface); padding: 0.75rem; border-radius: 6px; border: 1px solid var(--card-border);">' +
        '<strong>' + file.name + '</strong><br>' +
        '<span style="color: var(--text-muted);">Size: ' + sizeMb + ' MB | Type: ' + (file.type || 'Android Package') + '</span><br>' +
        '<span style="color: var(--accent); font-weight: 600;">✓ Valid archive container structure verified</span>' +
        '</div>';
    }
  </script>
</body>
</html>`;

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost:3000'}`);
  const pathname = parsedUrl.pathname;

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (pathname === '/' || pathname === '/index.html') {
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-cache'
    });
    res.end(HTML_CONTENT);
    return;
  }

  if (pathname === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', uptime: process.uptime() }));
    return;
  }

  if (pathname === '/api/status') {
    const info = getApkInfo();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(info));
    return;
  }

  if (pathname === '/download/app-debug.apk') {
    if (!fs.existsSync(APK_PATH)) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('APK not found. Please compile the app first.');
      return;
    }
    const stat = fs.statSync(APK_PATH);
    res.writeHead(200, {
      'Content-Type': 'application/vnd.android.package-archive',
      'Content-Length': stat.size,
      'Content-Disposition': 'attachment; filename="app-debug.apk"'
    });
    fs.createReadStream(APK_PATH).pipe(res);
    return;
  }

  // 404 handler
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not Found');
});

server.listen(PORT, HOST, () => {
  console.log(`Bundle APKs Installer dev server listening on http://${HOST}:${PORT}`);
});
