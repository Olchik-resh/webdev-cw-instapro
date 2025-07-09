const express = require('express');
const crypto = require('crypto');

const app = express();

function generateNonce() {
  const nonceBuffer = crypto.randomBytes(16);
  const nonce = nonceBuffer.toString('base64');
  return nonce;
}

app.use((req, res, next) => {
  const nonce = generateNonce();
  res.setHeader('Content-Security-Policy', `script-src 'nonce-${nonce}'`);
  res.locals.nonce = nonce; // Передаем nonce в шаблоны
  next();
});

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="ru">
      <head>
        <meta charset="utf-8" />
        <title>Instapro</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="./styles.css" />
        <link rel="stylesheet" href="./ui-kit.css" />
        <link rel="icon" href="./favicon.ico" />
      </head>
      <body>
        <div id="app"></div>
        <script src="./dist/main.js" nonce="${res.locals.nonce}"></script>
      </body>
    </html>
  `);
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});