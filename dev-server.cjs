const chalk = require('chalk');
(async () => {
  const chalk = (await import('chalk')).default;console.log(chalk.cyan(`
╔═════════════════════════════════════════════════════╗
║  ${chalk.red('█████')}  ${chalk.white('██╗  ██╗')} ${chalk.cyan('██████')}  ${chalk.yellow('██████')}  ${chalk.magenta('█████████')}  ${chalk.green('█████')}   ║
║ ${chalk.red('██╔══██╗')}${chalk.white('╚██╗██╔╝')}${chalk.cyan('██╔════╝')}${chalk.yellow('██╔═══██╗')}${chalk.magenta('██     ██')} ${chalk.green('██╔══██╗')} ║
║ ${chalk.red('███████║')} ${chalk.white('╚███╔╝')} ${chalk.cyan('██║     ')}${chalk.yellow('██║   ██║')}${chalk.magenta('█████████')} ${chalk.green('███████║')} ║
║ ${chalk.red('██╔══██║')} ${chalk.white('██╔██╗')} ${chalk.cyan('██║     ')}${chalk.yellow('██║   ██║')}${chalk.magenta('██ ██ ')}    ${chalk.green('██╔══██║')} ║
║ ${chalk.red('██║  ██║')}${chalk.white('██╔╝ ██╗')}${chalk.cyan('╚██████╗')}${chalk.yellow('╚██████╔╝')}${chalk.magenta('██ ██████╗')}${chalk.green('██║  ██║')} ║
╚═════════════════════════════════════════════════════╝
  `));
  
  console.log(chalk.bold.cyan("  Axcora Modern and Super Light Static Site Generator"));
  console.log(chalk.bold.cyan("  Start on https://localhost:3000"));
  console.log(chalk.gray("    ════════════════════════════════════════════════\n"));
})();

const http = require("http");
const fs = require("fs");
const path = require("path");
const chokidar = require("chokidar");
const { WebSocketServer } = require("ws");
const { execSync } = require("child_process");

// Folder hasil build
const OUTPUT = path.join(process.cwd(), "public");
const PORT_HTTP = 3000;
const PORT_WS = 3001;

// Dev server untuk preview + live reload
const server = http.createServer((req, res) => {
  let filePath = path.join(OUTPUT, req.url === "/" ? "index.html" : req.url);

  // INI LOGIKA BARU untuk clean URL
  if (fs.existsSync(filePath)) {
    // JIKA YANG DIMINTA ADALAH FOLDER, SERVE index.html DI DALAMNYA
    if (fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, "index.html");
    }
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      // INJEKSI HOT RELOAD jika html
      if (filePath.endsWith(".html")) {
        let html = fs.readFileSync(filePath, "utf8");
        html = html.replace('</body>', `
        <script>
        (() => {
          try {
            const ws = new WebSocket('ws://' + location.hostname + ':3001');
            ws.onmessage = e => { if(e.data==="reload") location.reload(); }
            ws.onclose = () => setTimeout(()=>location.reload(), 1600);
          } catch(e){}
        })();
        </script></body>`);
        res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
        return res.end(html);
      }
      // File statis lain
      const ext = path.extname(filePath);
      const contentTypes = { ".css": "text/css", ".js": "application/javascript" };
      res.writeHead(200, {"Content-Type": contentTypes[ext]||"text/plain"});
      return res.end(fs.readFileSync(filePath));
    }
  }

  // FALLBACK jika tidak ditemukan
  res.writeHead(404);
  res.end("404 Not found");
});


const open = require('open');
// ... other imports

server.listen(PORT_HTTP, () => {
    console.log(`Dev server ready: http://localhost:${PORT_HTTP} (hot reload enabled)`);
    open.default(`http://localhost:${PORT_HTTP}`);
});
// Watcher (panggil build otomatis setiap source berubah)
const watcher = chokidar.watch(
  [    path.join(process.cwd(), "content"),
    path.join(process.cwd(), "src", "templates"),
  ],
  { ignoreInitial: true }
);

watcher.on("all", async (event, file) => {
  console.log("🔄 File changed:", file);
  execSync("npm run build", { stdio: "inherit" });
  reloadBrowsers();
});

// WebSocket reload
let wsClients = new Set();
const wsServer = new WebSocketServer({ port: PORT_WS });
wsServer.on("connection", (ws) => {
  wsClients.add(ws); ws.on("close", ()=>wsClients.delete(ws));
});
function reloadBrowsers() {
  wsClients.forEach(ws => { try{ws.send("reload");}catch{} });
  console.log("↻ Reload browser.");
}
