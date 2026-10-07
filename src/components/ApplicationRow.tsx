import { useId, useState } from "react";
import { ApplicationAnswers } from "./ApplicationAnswers";
import { formatDate } from "../utils/formatDate";
import type { Application } from "../types";

interface Props {
  application: Application;
  timezone: string;
}

export function ApplicationRow({ application, timezone }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const detailsId = useId();
  const statusClass = application.status.toLowerCase().replaceAll(" ", "-");
  const details = [
    ["Posting source", application.source || "Not recorded"],
    ["Source context", application.sourceNote],
    ["Experience match", application.fit],
    ["Schedule & contract", application.contract],
    ["Submission confirmation", application.confirmation],
    ["Notes", application.notes],
    ["Next step", application.nextAction],
    ["CV used", application.cv],
  ];

  return (
    <>
      <tr role="row" className={isExpanded ? "selected" : undefined}>
        <th role="rowheader" scope="row" className="company-name">
          {application.company}
        </th>
        <td role="cell">
          {application.jobUrl ? (
            <a href={application.jobUrl} target="_blank" rel="noreferrer">
              {application.role} <span aria-hidden="true">↗</span>
            </a>
          ) : (
            application.role
          )}
        </td>
        <td role="cell">
          <span className={`badge status-${statusClass}`}>
            {application.status}
          </span>
        </td>
        <td role="cell">
          <span className="pay">{application.pay || "Not stated"}</span>
          <span className="location">{application.locationEligibility}</span>
        </td>
        <td role="cell">
          <time dateTime={application.updatedAt}>
            {formatDate(application.updatedAt, timezone)}
          </time>
        </td>
        <td role="cell">
          <button
            className="detail-toggle"
            aria-label={`${isExpanded ? "Hide" : "Show"} details for ${application.company}`}
            aria-expanded={isExpanded}
            aria-controls={detailsId}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            Details <span aria-hidden="true">{isExpanded ? "−" : "+"}</span>
          </button>
        </td>
      </tr>
      <tr role="row" id={detailsId} hidden={!isExpanded}>
        <td role="cell" colSpan={6} className="detail-cell">
          <section className="details" aria-labelledby={`${detailsId}-heading`}>
            <header className="detail-heading">
              <h3 id={`${detailsId}-heading`}>Application details</h3>
              <div className="links">
                {application.jobUrl && (
                  <a href={application.jobUrl} target="_blank" rel="noreferrer">
                    Job listing ↗
                  </a>
                )}
                {application.applicationUrl && (
                  <a
                    href={application.applicationUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Application page ↗
                  </a>
                )}
              </div>
            </header>
            <dl>
              {details.map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value || "—"}</dd>
                </div>
              ))}
            </dl>
            <ApplicationAnswers application={application} />
            <p className="detail-footer">
              Submitted:{" "}
              {application.submittedAt ? (
                <time dateTime={application.submittedAt}>
                  {formatDate(application.submittedAt, timezone)}
                </time>
              ) : (
                "—"
              )}{" "}
              · {timezone} · Reference: {application.id}
            </p>
          </section>
        </td>
      </tr>
    </>
  );
}
