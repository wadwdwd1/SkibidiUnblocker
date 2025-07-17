const Corrosion = require('corrosion');
const proxy = new Corrosion();
const http = require('http');
const fs = require('fs');
const path = require('path');

// Create the server
http.createServer((req, res) => {
    // If the request is for anything other than WebSocket or proxy traffic, serve index.html
    if (req.url === '/' || req.url === '') {
        fs.readFile(path.join(__dirname, 'index.html'), 'utf-8', (err, data) => {
            if (err) {
                res.statusCode = 500;
                res.end('Error loading index.html');
                return;
            }
            res.setHeader('Content-Type', 'text/html');
            res.end(data);  // Serve the HTML content
        });
    } else {
        // Otherwise, handle it with the proxy
        proxy.request(req, res);  // Request Proxy
    }
}).on('upgrade', (req, socket, head) => {
    // Handle WebSocket upgrade requests with Corrosion's upgrade method
    proxy.upgrade(req, socket, head);  // WebSocket Proxy
}).listen(6969, () => {
    console.log('Server listening on http://localhost:80');
});
