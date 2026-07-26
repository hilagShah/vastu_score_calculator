const express = require('express');
const app = express();

app.get('/', (req, res) => res.send('OK'));

const ports = [3000, 3001, 5000, 5001, 8000, 8080, 8081, 9000, 9090, 10000];

const tryNextPort = (index) => {
  if (index >= ports.length) {
    console.error('All ports failed with EPERM or other errors.');
    process.exit(1);
  }

  const port = ports[index];
  console.log(`Attempting to bind to 127.0.0.1:${port}...`);
  
  const server = app.listen(port, '127.0.0.1', () => {
    console.log(`SUCCESS! Server is listening on 127.0.0.1:${port}`);
    server.close();
    process.exit(0);
  });

  server.on('error', (err) => {
    console.error(`Port ${port} failed: ${err.code} - ${err.message}`);
    tryNextPort(index + 1);
  });
};

tryNextPort(0);
