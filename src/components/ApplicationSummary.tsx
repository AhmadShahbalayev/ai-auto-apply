import type { Application, Status } from "../types";

interface Props {
  applications: Application[];
}

export function ApplicationSummary({ applications }: Props) {
  const statuses: Status[] = ["Applied", "Skipped", "Rejected", "Ignored"];
  const counts = statuses.map((status) => ({
    label: status,
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
