import {
  cpSync,
  existsSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from "node:fs";
import { isProfileName } from "./profile-name.mjs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const [id, suppliedName] = process.argv.slice(2);
const name = (suppliedName ?? id ?? "").trim();
if (!isProfileName(id) || !name) {
  console.error(
    'Use: npm run user -- "Alex Morgan" "Alex Morgan" (a normal folder name; no path separators, reserved OS names or invalid filename characters).',
  );
  process.exit(1);
}
const target = join(root, "users", id);
const users = join(root, "users");
const equivalent = (value) => value.normalize("NFC").toLowerCase();
if (
  existsSync(target) ||
  (existsSync(users) &&
    readdirSync(users).some((entry) => equivalent(entry) === equivalent(id)))
) {
  console.error(`users/${id} already exists. Nothing was changed.`);
  process.exit(1);
}
cpSync(join(root, "templates/user"), target, { recursive: true });
const path = join(target, "applications.json");
const data = JSON.parse(readFileSync(path, "utf8"));
data.candidate = name;
writeFileSync(path, JSON.stringify(data, null, 2) + "\n");
console.log(
  `Created users/${id}/. Add the CV to cv/, then ask your assistant to follow the first-time setup in AGENTS.md. No applications submitted.`,
);
