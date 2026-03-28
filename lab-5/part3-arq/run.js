// run.js — Launch all Part 3 components (server, proxy, client)
const { spawn } = require("child_process");
const path = require("path");

const dir = __dirname;
const procs = [
    { name: "server", file: "server.js", delay: 0 },
    { name: "proxy",  file: "proxy.js",  delay: 500 },
    { name: "client", file: "client.js", delay: 1000 },
];

procs.forEach(({ name, file, delay }) => {
    setTimeout(() => {
        const child = spawn("node", [path.join(dir, file)], { stdio: "pipe" });

        child.stdout.on("data", (data) => {
            data.toString().trimEnd().split("\n").forEach((line) => {
                console.log(`[${name}] ${line}`);
            });
        });

        child.stderr.on("data", (data) => {
            data.toString().trimEnd().split("\n").forEach((line) => {
                console.error(`[${name}] ${line}`);
            });
        });

        child.on("close", (code) => {
            console.log(`[${name}] exited (code ${code})`);
        });
    }, delay);
});
