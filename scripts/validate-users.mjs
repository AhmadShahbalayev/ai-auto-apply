import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const statuses = new Set([
  "Shortlisted",
  "In progress",
  "Applied",
  "Blocked",
  "Skipped",
  "Uncertain submission",
  "Rejected",
  "Interview",
  "Offer",
]);
const paths = [join(root, "templates/user/applications.json")];
if (existsSync(join(root, "users"))) {
  for (const entry of readdirSync(join(root, "users"), {
    withFileTypes: true,
  })) {
    if (!entry.isDirectory()) continue;
    const folder = join(root, "users", entry.name);
    for (const file of ["USER.md", "ANSWERS.md", "applications.json", "cv"]) {
      if (!existsSync(join(folder, file)))
        throw new Error(`users/${entry.name}: missing ${file}`);
    }
    paths.push(join(folder, "applications.json"));
  }
}
const validDate = (value) => {
  if (
    typeof value !== "string" ||
    !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(
      value,
    ) ||
    !Number.isFinite(Date.parse(value))
  )
    return false;
  // Date.parse normalizes impossible days, e.g. February 30; reject those too.
  const day = value.slice(0, 10);
  const midnight = Date.parse(`${day}T00:00:00Z`);
  return (
    Number.isFinite(midnight) &&
    new Date(midnight).toISOString().slice(0, 10) === day
  );
};
const validUrl = (value) => {
  if (value === "") return true; // Destination may still be unknown before opening the form.
  try {
    return ["https:", "http:"].includes(new URL(value).protocol);
  } catch {
    return false;
  }
};
for (const path of paths) {
  const data = JSON.parse(readFileSync(path, "utf8"));
  const check = (ok, message) => {
    if (!ok) throw new Error(`${path}: ${message}`);
  };
  check(
    data && typeof data === "object" && !Array.isArray(data),
    "profile must be an object",
  );
  check(data.schemaVersion === 3, "expected schemaVersion 3");
  check(
    typeof data.candidate === "string" && data.candidate.trim(),
    "candidate name required",
  );
  check(
    typeof data.timezone === "string" && data.timezone.trim(),
    "timezone required",
  );
  new Intl.DateTimeFormat("en", { timeZone: data.timezone }).format();
  const p = data.preferences;
  const pay = p?.minimumMonthlyPay;
  check(
    pay &&
      (pay.amount === null || (Number.isFinite(pay.amount) && pay.amount >= 0)),
    "minimum pay must be null or a nonnegative number",
  );
  check(
    typeof pay.currency === "string" && /^[A-Z]{3}$/.test(pay.currency),
    "currency must be a three-letter code, e.g. USD or AED",
  );
  for (const field of [
    "focus",
    "availability",
    "noticePeriod",
    "workAuthorization",
    "browser",
  ])
    check(typeof p[field] === "string", `missing preference ${field}`);
  check(
    Array.isArray(p.excludedEmployers) &&
      p.excludedEmployers.every((x) => typeof x === "string"),
    "excludedEmployers must be a list of names",
  );
  check(
    Number.isFinite(p.blockerWaitMinutes) &&
      p.blockerWaitMinutes >= 0 &&
      p.blockerWaitMinutes <= 15,
    "blockerWaitMinutes must be between 0 and 15",
  );
  check(Array.isArray(data.applications), "applications must be a list");
  const ids = new Set();
  for (const app of data.applications) {
    check(
      app && typeof app === "object" && !Array.isArray(app),
      "application must be an object",
    );
    check(
      typeof app.id === "string" && app.id && !ids.has(app.id),
      "missing or duplicate application id",
    );
    ids.add(app.id);
    for (const field of [
      "company",
      "role",
      "jobUrl",
      "applicationUrl",
      "locationEligibility",
      "contract",
      "pay",
      "fit",
      "cv",
      "confirmation",
      "notes",
      "nextAction",
    ])
      check(typeof app[field] === "string", `${app.id}: missing ${field}`);
    check(
      validUrl(app.jobUrl) && validUrl(app.applicationUrl),
      `${app.id}: URLs must be http(s) or empty`,
    );
    for (const field of ["source", "sourceNote"])
      if (app[field] !== undefined)
        check(typeof app[field] === "string", `${app.id}: invalid ${field}`);
    check(statuses.has(app.status), `${app.id}: unknown status`);
    check(
      validDate(app.updatedAt),
      `${app.id}: updatedAt needs an ISO date with timezone`,
    );
    check(
      app.submittedAt === null || validDate(app.submittedAt),
      `${app.id}: invalid submittedAt`,
    );
    if (app.status === "Applied")
      check(
        app.submittedAt && app.confirmation.trim(),
        `${app.id}: Applied needs a date and confirmation`,
      );
    if (app.answers !== undefined)
      check(
        Array.isArray(app.answers) &&
          app.answers.every(
            (a) =>
              a &&
              typeof a.question === "string" &&
              a.question.trim() &&
              typeof a.answer === "string",
          ),
        `${app.id}: invalid answers`,
      );
    if (app.answerHistoryNote !== undefined)
      check(
        typeof app.answerHistoryNote === "string",
        `${app.id}: invalid answerHistoryNote`,
      );
  }
}
console.log(
  `Validated ${paths.length - 1} personal profile(s) and the blank template.`,
);
