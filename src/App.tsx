import { useState } from "react";
import { profiles } from "./data/profiles";
import { ApplicationSummary } from "./components/ApplicationSummary";
import { ApplicationTable } from "./components/ApplicationTable";
import { formatDate } from "./utils/formatDate";
import type { ApplicationData } from "./types";

export default function App() {
  const [profileId, setProfileId] = useState(profiles[0].id);
  const profile = profiles.find((item) => item.id === profileId) ?? profiles[0];

  return (
    <>
      {profiles.length > 1 && (
        <nav className="profile-picker" aria-label="Candidate selection">
          <label htmlFor="profile">Viewing applications for</label>
          <select
            id="profile"
            value={profile.id}
            onChange={(event) => setProfileId(event.target.value)}
          >
            {profiles.map((item) => (
              <option key={item.id} value={item.id}>
                {item.data.candidate} ({item.id})
              </option>
            ))}
          </select>
        </nav>
      )}
      <ApplicationDashboard key={profile.id} data={profile.data} />
    </>
  );
}

function ApplicationDashboard({ data }: { data: ApplicationData }) {
  const [search, setSearch] = useState("");

  const applications = data.applications;
  const searchTerm = search.trim().toLowerCase();

  const visibleApplications = applications.filter((application) => {
    const searchableText = [
      application.source,
      application.sourceNote,
      application.company,
      application.role,
      application.pay,
      application.locationEligibility,
      application.fit,
      application.notes,
      application.status,
      application.contract,
      application.cv,
      application.confirmation,
      application.nextAction,
      application.answerHistoryNote,
      ...(application.answers ?? []).flatMap(({ question, answer }) => [
        question,
        answer,
      ]),
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(searchTerm);
  });

  const lastUpdated = applications.reduce<string | null>(
    (latest, application) => {
      if (!latest || Date.parse(application.updatedAt) > Date.parse(latest)) {
        return application.updatedAt;
      }
      return latest;
    },
    null,
  );

  return (
    <main>
      <header>
        <div>
          <p className="eyebrow">
            {data.candidate} <span>/</span> Job search
          </p>
          <h1>Applications</h1>
          <p className="intro">
            Every opportunity, from first look to next step.
          </p>
        </div>
        <p className="live">
          <span className="live-dot" aria-hidden="true" />
          {import.meta.env.DEV ? "Live updates" : "Saved snapshot"}
          <small>
            {lastUpdated
              ? `Last activity ${formatDate(lastUpdated, data.timezone)} · ${data.timezone}`
              : "No activity yet"}
          </small>
        </p>
      </header>

      <ApplicationSummary applications={applications} />

      <section className="board" aria-labelledby="applications-heading">
        <h2 id="applications-heading" className="sr-only">
          Job applications
        </h2>
        <div className="toolbar">
          <label className="search">
            <span aria-hidden="true">⌕</span>
            <span className="sr-only">Search applications</span>
            <input
              type="search"
              placeholder="Search company, role or answers…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
          <p className="result-count" aria-live="polite">
            {visibleApplications.length} of {applications.length} opportunities
          </p>
        </div>

        {visibleApplications.length > 0 && (
          <ApplicationTable
            applications={visibleApplications}
            timezone={data.timezone}
          />
        )}

        {visibleApplications.length === 0 && (
          <div className="empty">
            <h3>
              {applications.length
                ? "No matching applications"
                : "No applications yet"}
            </h3>
            <p>
              {applications.length
                ? "Try another search."
                : "Applications will appear here as they are recorded."}
            </p>
            {applications.length === 0 && (
              <div className="getting-started">
                <p>This local tracker keeps each person’s job applications, form answers and next steps together. Your AI assistant records them here when you authorize applications.</p>
                <ol>
                  <li>Open README.md and copy the setup prompt into an assistant with access to this folder.</li>
                  <li>Follow its guidance to create your private user folder, add your CV and review your background and preferences.</li>
                  <li>Sign into your chosen job site yourself and tell the assistant which browser tabs it may use. Email access is optional and read only.</li>
                  <li>Ask for one suitable application as a test. Review its saved result and answers here before requesting more.</li>
                </ol>
                <p>No jobs are submitted by opening this dashboard. Never share a build containing personal profiles.</p>
              </div>
            )}
            {applications.length > 0 && (
              <button onClick={() => setSearch("")}>Clear search</button>
            )}
          </div>
        )}
      </section>

      <footer>
        <span>
          {data.preferences.focus || "Job preferences not set"}
          {data.preferences.minimumMonthlyPay.amount !== null && (
            <>
              {" "}
              · {data.preferences.minimumMonthlyPay.amount.toLocaleString()}{" "}
              {data.preferences.minimumMonthlyPay.currency}/month minimum
            </>
          )}
          {data.preferences.noticePeriod && (
            <> · {data.preferences.noticePeriod}</>
          )}
        </span>
        <span>All dates shown in {data.timezone}</span>
      </footer>
    </main>
  );
}
