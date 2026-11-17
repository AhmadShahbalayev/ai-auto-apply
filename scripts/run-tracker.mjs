import { spawn } from "node:child_process";
import { once } from "node:events";
import { createServer } from "vite";

const server = await createServer({ server: { host: "127.0.0.1" } });
let inhibitor;
let cleanup;

function stop() {
  cleanup ??= (async () => {
    try {
      if (inhibitor?.pid && inhibitor.exitCode === null && inhibitor.signalCode === null) {
        const exited = once(inhibitor, "exit");
        inhibitor.kill();
        await exited;
      }
    } finally {
      await server.close();
    }
  })();
  return cleanup;
}

for (const signal of ["SIGINT", "SIGTERM", "SIGHUP"]) {
  process.once(signal, () => {
    stop().catch((error) => {
      console.error(error);
      process.exitCode = 1;
    });
  });
}

try {
  await server.listen();
  const url = server.resolvedUrls?.local[0];
  if (!url) throw new Error("The tracker did not expose a localhost URL.");
  const response = await fetch(url, { signal: AbortSignal.timeout(5000) });
  if (!response.ok) throw new Error(`Tracker health check returned HTTP ${response.status}.`);
  await response.body?.cancel();

  if (process.platform === "darwin") {
    inhibitor = spawn("/usr/bin/caffeinate", ["-di", "-w", String(process.pid)], {
      stdio: "ignore",
    });
    await once(inhibitor, "spawn");
  }

  console.log(`Tracker ready at ${url} (PID ${process.pid})`);
  if (inhibitor) console.log(`Sleep inhibitor started (PID ${inhibitor.pid})`);
} catch (error) {
  console.error(error);
  process.exitCode = 1;
  await stop();
}
