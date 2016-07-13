
const http = require('http');
const os = require('os');
const port = process.env.PORT || 43034;

const server = http.createServer((req, res) => {
  const body = {
    now: new Date(),
    message: 'Hello from Echo',
    argv: process.argv,
    arch: process.arch,
    release: process.release,
    runtime: 'Node.js' + process.version,
    env: process.env,
    pid: process.pid,
    platform: os.platform(),
    port: port,
    hostname: os.hostname(),
    headers: req.headers
  };
  res.setHeader('content-type', 'application/json');
  res.statusCode = 200;
  res.end(JSON.stringify(body));
});

server.listen(port);
server.on('listening', () => {
  console.log('Listening on port', port);  
});
server.on('error', (e) => {
  console.log('ERROR:', e);
});
