const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const PORT = 8089;
const ROOT = path.resolve(__dirname, '..');

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = parsedUrl.pathname;

  if (pathname === '/log') {
    const msg = parsedUrl.searchParams.get('msg');
    console.log('[BROWSER LOG]', msg);
    res.writeHead(200);
    return res.end('OK');
  }

  if (pathname === '/save' && req.method === 'POST') {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => {
      const buffer = Buffer.concat(chunks);
      const outPath = path.join(ROOT, 'assets', 'targets.mind');
      fs.writeFileSync(outPath, buffer);
      console.log(`[SAVED] Written ${buffer.length} bytes to ${outPath}`);
      res.writeHead(200);
      res.end('OK');
    });
    return;
  }

  if (pathname === '/done') {
    console.log('[COMPLETED] Compilation finished successfully.');
    res.writeHead(200);
    res.end('OK');
    setTimeout(() => {
      server.close();
      process.exit(0);
    }, 500);
    return;
  }

  // Serve static files
  let filePath = path.join(ROOT, pathname === '/' ? 'compile.html' : pathname);
  if (!fs.existsSync(filePath)) {
    res.writeHead(404);
    return res.end('Not Found: ' + pathname);
  }

  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.mind': 'application/octet-stream',
    '.mp4': 'video/mp4'
  };

  res.writeHead(200, {
    'Content-Type': mimeTypes[ext] || 'application/octet-stream',
    'Access-Control-Allow-Origin': '*'
  });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
  
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const args = [
    '--headless=new',
    '--enable-webgl',
    '--ignore-gpu-blocklist',
    '--use-gl=angle',
    '--no-sandbox',
    `http://localhost:${PORT}/compile.html`
  ];
  
  console.log('Launching Chrome to compile targets...');
  const chrome = spawn(chromePath, args);

  chrome.stdout.on('data', (d) => console.log('[CHROME OUT]', d.toString()));
  chrome.stderr.on('data', (d) => console.log('[CHROME ERR]', d.toString()));

  chrome.on('error', (err) => {
    console.error('Failed to spawn Chrome:', err);
    process.exit(1);
  });
  chrome.on('exit', (code) => {
    console.log('[CHROME EXIT]', code);
  });
});
