import { useId } from "react";
import type { Application } from "../types";

export function ApplicationAnswers({
  application,
}: {
  application: Application;
}) {
  const headingId = useId();
  const answers = application.answers ?? [];

  return (
    <section className="answers" aria-labelledby={headingId}>
      <h4 id={headingId}>Form questions & answers</h4>
      <p>
        {application.answerHistoryNote ||
          (answers.length
            ? "Recorded form answers. Submission status is shown above."
            : "Exact answers were not recorded for this application.")}
      </p>
      {answers.length > 0 && (
        <dl>
          {answers.map(({ question, answer }, index) => (
            <div key={`${index}-${question}`}>
              <dt>{question}</dt>
              <dd>{answer}</dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
}
