const http = require('http');
const fs = require('fs');

const config = require('./config.json')



http.createServer((req, res) => {
  let responseCode = 200;
  let content = fs.readFileSync('index.html');

  res.writeHead(responseCode, {
    'content-type': 'text/html;charset=utf-8',
  });

  res.write(content);
  res.end();
}).listen(config.port);