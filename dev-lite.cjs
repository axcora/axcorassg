(async () => {
    const chalk = (await import('chalk')).default;
    const http = require("http");
    const fs = require("fs");
    const path = require("path");
    const chokidar = require("chokidar");
    const { WebSocketServer } = require("ws");
    const { execSync } = require("child_process");
    const open = require('open');

    // Display banner and initial info
    console.log(chalk.cyan(`
╔═════════════════════════════════════════════════════╗
║  ${chalk.red('█████')}  ${chalk.white('██╗  ██╗')} ${chalk.cyan('██████')}  ${chalk.yellow('██████')}  ${chalk.magenta('█████████')}  ${chalk.green('█████')}   ║
║ ${chalk.red('██╔══██╗')}${chalk.white('╚██╗██╔╝')}${chalk.cyan('██╔════╝')}${chalk.yellow('██╔═══██╗')}${chalk.magenta('██     ██')} ${chalk.green('██╔══██╗')} ║
║ ${chalk.red('███████║')} ${chalk.white('╚███╔╝')} ${chalk.cyan('██║     ')}${chalk.yellow('██║   ██║')}${chalk.magenta('█████████')} ${chalk.green('███████║')} ║
║ ${chalk.red('██╔══██║')} ${chalk.white('██╔██╗')} ${chalk.cyan('██║     ')}${chalk.yellow('██║   ██║')}${chalk.magenta('██ ██ ')}    ${chalk.green('██╔══██║')} ║
║ ${chalk.red('██║  ██║')}${chalk.white('██╔╝ ██╗')}${chalk.cyan('╚██████╗')}${chalk.yellow('╚██████╔╝')}${chalk.magenta('██ ██████╗')}${chalk.green('██║  ██║')} ║
╚═════════════════════════════════════════════════════╝
`));
    console.log(chalk.bold.cyan("  Axcora Modern and Super Light Static Site Generator"));
    console.log(chalk.bold.cyan("  Start on http://localhost:3000"));
    console.log(chalk.gray("    ════════════════════════════════════════════════\n"));

    const OUTPUT = path.join(process.cwd(), "public");
    const PORT_HTTP = 3000;
    const PORT_WS = 3001;

    // Server statis
    const server = http.createServer((req, res) => {
        let filePath = path.join(OUTPUT, req.url === "/" ? "index.html" : req.url);

        if (fs.existsSync(filePath)) {
            if (fs.statSync(filePath).isDirectory()) {
                filePath = path.join(filePath, "index.html");
            }
            if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
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
                const ext = path.extname(filePath);
                const contentTypes = { ".css": "text/css", ".js": "application/javascript" };
                res.writeHead(200, {"Content-Type": contentTypes[ext] || "text/plain"});
                return res.end(fs.readFileSync(filePath));
            }
        }
        res.writeHead(404);
        res.end("404 Not found");
    });

    // WebSocket untuk hot reload
    let wsClients = new Set();
    const wsServer = new WebSocketServer({ port: PORT_WS });
    wsServer.on("connection", (ws) => {
        wsClients.add(ws);
        ws.on("close", () => wsClients.delete(ws));
    });

    function reloadBrowsers() {
        wsClients.forEach(ws => {
            try { ws.send("reload"); } catch {}
        });
        console.log(chalk.blue("↻ Reload browser."));
    }

    // Watcher (panggil build otomatis setiap source berubah)
    const watcher = chokidar.watch(
        [
            path.join(process.cwd(), "content"),
            path.join(process.cwd(), "src", "templates"),
        ],
        { ignoreInitial: true }
    );

    watcher.on("all", (event, file) => {
        console.log("🔄 File changed:", file);
        
        const isMarkdown = file.endsWith('.md');
        
        if (isMarkdown) {
            console.log(chalk.yellow(`-> Building single file: ${file}`));
            try {
                execSync(`npm run build -- --file="${file}"`, { stdio: "inherit" });
            } catch (e) {
                console.error(chalk.red("❌ Error during partial build:", e.message));
            }
        } else {
            console.log(chalk.yellow("-> Rebuilding all files..."));
            try {
                execSync("npm run build", { stdio: "inherit" });
            } catch (e) {
                console.error(chalk.red("❌ Error during full build:", e.message));
            }
        }
        
        reloadBrowsers();
    });

    server.listen(PORT_HTTP, () => {
        console.log(`Dev server ready: http://localhost:${PORT_HTTP} (hot reload enabled)`);
        open.default(`http://localhost:${PORT_HTTP}`);
    });

    server.on("error", (err) => {
        if (err.code === "EADDRINUSE") {
            console.error(chalk.red("Server sudah berjalan/listen pada port itu."));
            process.exit(1);
        }
    });
})();