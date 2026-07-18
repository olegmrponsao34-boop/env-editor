const http = require('http');
const fs = require('fs');
const path = require('path');


const PORT = 3462;
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
};

function parseEnv(content) {
  const lines = content.split('\n');
  const parsed = [];
  const errors = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed === '' || trimmed.startsWith('#')) continue;

    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) {
      errors.push({ line: i + 1, message: `Строка ${i + 1}: не содержит "="`, raw: trimmed });
      continue;
    }

    let key = trimmed.slice(0, eqIndex).trim();
    let value = trimmed.slice(eqIndex + 1).trim();

    if (key.includes(' ')) {
      errors.push({ line: i + 1, message: `Строка ${i + 1}: ключ "${key}" содержит пробелы`, raw: trimmed });
      continue;
    }

    const existing = parsed.find(p => p.key === key);
    if (existing) {
      errors.push({ line: i + 1, message: `Строка ${i + 1}: дубликат ключа "${key}"`, raw: trimmed });
      continue;
    }

    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    parsed.push({ key, value });
  }

  return { parsed, errors };
}

function generateEnv(pairs) {
  return pairs.map(p => {
    const val = p.value.includes(' ') || p.value.includes('#') || p.value === ''
      ? `"${p.value}"`
      : p.value;
    return `${p.key}=${val}`;
  }).join('\n') + '\n';
}

function serveFile(res, filePath) {
  const ext = path.extname(filePath);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found');
      return;
    }
    res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const method = req.method;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (method === 'GET') {
    const p = parsedUrl.pathname === '/' ? '/index.html' : parsedUrl.pathname;
    const filePath = path.join(__dirname, p);
    if (fs.existsSync(filePath) && filePath.startsWith(__dirname)) {
      serveFile(res, filePath);
      return;
    }
    serveFile(res, path.join(__dirname, 'index.html'));
    return;
  }

  if (method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);

        if (parsedUrl.pathname === '/api/parse') {
          const result = parseEnv(data.content || '');
          res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify(result));
          return;
        }

        if (parsedUrl.pathname === '/api/generate') {
          const content = generateEnv(data.pairs || []);
          res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ content }));
          return;
        }

        res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ error: 'Not found' }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
    return;
  }

  res.writeHead(405, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Method Not Allowed');
});

server.listen(PORT, () => {
  console.log(`🌍 env-editor запущен на http://localhost:${PORT}`);
});
