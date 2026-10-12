import type { Application } from "../types";

interface Props {
  applications: Application[];
}

export function ApplicationSummary({ applications }: Props) {
  const counts = ["Applied", "Skipped", "Rejected", "Ignored"].map((status) => ({
    label: status === "Skipped" ? "Needs attention" : status,
    count: applications.filter((job) => job.status === status).length,
  }));

  return (
    <section aria-labelledby="overview-heading">
      <h2 id="overview-heading" className="sr-only">
        Application overview
      </h2>
      <dl className="stats">
        {counts.map(({ label, count }) => (
          <div className="stat" key={label}>
            <dt>{label}</dt>
            <dd>{count}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
