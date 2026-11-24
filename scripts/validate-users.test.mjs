import { test } from "node:test";
import assert from "node:assert/strict";
import { cpSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = fileURLToPath(new URL("../", import.meta.url));

function fixture(run) {
  const folder = mkdtempSync(join(root, "validation-test.tmp-"));
  try {
    mkdirSync(join(folder, "scripts"));
    for (const name of ["validate-users.mjs", "profile-name.mjs"])
      cpSync(join(root, "scripts", name), join(folder, "scripts", name));
    cpSync(join(root, "templates"), join(folder, "templates"), { recursive: true });
    const profile = join(folder, "users", "Test Candidate");
    mkdirSync(join(folder, "users"));
    cpSync(join(folder, "templates", "user"), profile, { recursive: true });
    const validate = () => spawnSync(process.execPath, [join(folder, "scripts", "validate-users.mjs")], { encoding: "utf8" });
    run(profile, validate);
  } finally {
    rmSync(folder, { recursive: true, force: true });
  }
}

test("neutral profiles and optional outreach with historical follow-ups remain valid", () => {
  fixture((profile, validate) => {
    assert.equal(validate().status, 0);
    const message = {
      name: "Recruiter", profileUrl: "https://example.com/recruiter",
      headline: "Recruiter", message: "Hello", cv: "", notes: "", sentAt: null,
    };
    writeFileSync(join(profile, "outreach.json"), JSON.stringify({ messages: [message, message] }));
    assert.equal(validate().status, 0);
  });
});

test("malformed outreach is rejected", () => {
  fixture((profile, validate) => {
    writeFileSync(join(profile, "outreach.json"), '{"messages":[{}]}');
    const result = validate();
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /invalid name/);
  });
});

test("midnight must be recorded as 00 hours rather than normalized 24 hours", () => {
  fixture((profile, validate) => {
    const file = join(profile, "applications.json");
    const data = JSON.parse(readFileSync(file, "utf8"));
    data.applications.push({
      id: "test", company: "Test", role: "Engineer", jobUrl: "", applicationUrl: "",
      locationEligibility: "", contract: "", pay: "", fit: "", status: "Applied",
      updatedAt: "2026-11-24T24:00:00Z", submittedAt: null,
      cv: "", confirmation: "User confirmed", notes: "", nextAction: "",
    });
    writeFileSync(file, JSON.stringify(data));
    assert.notEqual(validate().status, 0);
    data.applications[0].updatedAt = "2026-11-24T00:00:00Z";
    writeFileSync(file, JSON.stringify(data));
    assert.equal(validate().status, 0);
  });
});
