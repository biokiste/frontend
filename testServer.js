const http = require("http");
const url = require("url");

const PORT = 9001;

const server = http.createServer((req, res) => {
  const { pathname } = url.parse(req.url, true);
  switch (pathname) {
    case "/api/status": {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.write("Ok!");
      break;
    }
    default: {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.write("Not found!");
    }
  }
  res.end();
});

server.listen(9001);
console.log(`test server listen on port ${PORT}`);
