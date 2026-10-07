import type { Application } from "../types";

interface Props {
  applications: Application[];
}

export function ApplicationSummary({ applications }: Props) {
  const counts = [
    { label: "Tracked", count: applications.length },
    {
      label: "Applied",
      count: applications.filter((job) => job.status === "Applied").length,
    },
    {
      label: "Interviews",
      count: applications.filter((job) => job.status === "Interview").length,
    },
    {
      label: "Needs attention",
      count: applications.filter((job) =>
        ["Blocked", "Skipped", "Uncertain submission", "In progress"].includes(
          job.status,
        ),
      ).length,
    },
  ];

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
