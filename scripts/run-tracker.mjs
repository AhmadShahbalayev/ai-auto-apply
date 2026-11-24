import { spawn } from "node:child_process";
import { once } from "node:events";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const root = fileURLToPath(new URL("../", import.meta.url));
let server;
let inhibitor;
let stopping = false;
let cleanup;

function stop() {
  stopping = true;
  cleanup ??= (async () => {
    try {
      if (inhibitor?.pid && inhibitor.exitCode === null && inhibitor.signalCode === null) {
        const exited = once(inhibitor, "exit");
        inhibitor.kill();
        await exited;
      }
    } finally {
      await server?.close();
    }
  })();
  return cleanup;
}

function fail(error) {
  console.error(error);
  process.exitCode = 1;
  return stop();
}

for (const signal of ["SIGINT", "SIGTERM", "SIGHUP"]) {
  process.once(signal, () => {
    // Startup checks this flag after every asynchronous boundary. Cleanup waits
    // until initialization finishes, so it cannot miss a newly created resource.
    stopping = true;
    if (ready) void stop().catch(console.error);
  });
}

let ready = false;
try {
  server = await createServer({ root, server: { host: "127.0.0.1" } });
  if (!stopping) await server.listen();
  if (!stopping) {
    const url = server.resolvedUrls?.local[0];
    if (!url) throw new Error("The tracker did not expose a localhost URL.");
    const response = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!response.ok) throw new Error(`Tracker health check returned HTTP ${response.status}.`);
    await response.body?.cancel();

    if (!stopping && process.platform === "darwin") {
      inhibitor = spawn("/usr/bin/caffeinate", ["-di", "-w", String(process.pid)], {
        stdio: "ignore",
      });
      await once(inhibitor, "spawn");
      inhibitor.on("error", (error) => void fail(error));
      inhibitor.once("exit", () => {
        if (!stopping) void fail(new Error("Sleep inhibitor exited during the run."));
      });
    }

    if (!stopping) {
      console.log(`Tracker ready at ${url} (PID ${process.pid})`);
      if (inhibitor) console.log(`Sleep inhibitor started (PID ${inhibitor.pid})`);
    }
  }
} catch (error) {
  console.error(error);
  process.exitCode = 1;
  stopping = true;
} finally {
  ready = true;
  if (stopping) await stop();
}
