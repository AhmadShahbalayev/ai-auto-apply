import { useState } from "react";
import { ApplicationRow } from "./ApplicationRow";
import type { Application } from "../types";

type SortColumn = "company" | "role" | "status" | "updatedAt";

interface Props {
  applications: Application[];
  timezone: string;
}

const columns: { key: SortColumn; label: string }[] = [
  { key: "company", label: "Company" },
  { key: "role", label: "Position" },
  { key: "status", label: "Status" },
];

export function ApplicationTable({ applications, timezone }: Props) {
  const [sortColumn, setSortColumn] = useState<SortColumn>("updatedAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const sortedApplications = [...applications].sort((a, b) => {
    const comparison =
      sortColumn === "updatedAt"
        ? Date.parse(a.updatedAt) - Date.parse(b.updatedAt)
        : a[sortColumn].localeCompare(b[sortColumn]);

    return comparison * (sortDirection === "asc" ? 1 : -1);
  });

  function changeSort(column: SortColumn) {
    const direction =
      column === sortColumn && sortDirection === "asc" ? "desc" : "asc";
    setSortColumn(column);
    setSortDirection(direction);
  }

  function renderHeading(column: SortColumn, label: string) {
    const isSelected = column === sortColumn;
    const arrow = isSelected ? (sortDirection === "asc" ? "↑" : "↓") : "↕";

    return (
      <th
        key={column}
        role="columnheader"
        scope="col"
        aria-sort={
          isSelected
            ? sortDirection === "asc"
              ? "ascending"
              : "descending"
            : "none"
        }
      >
        <button className="sort" onClick={() => changeSort(column)}>
          {label}
          <span aria-hidden="true">{arrow}</span>
        </button>
      </th>
    );
  }

  return (
    <div className="table-scroll">
      <table role="table">
        <caption className="sr-only">
          Job applications. Select Details to see confirmation, notes and next
          steps.
        </caption>
        <thead role="rowgroup">
          <tr role="row">
            {columns.map((column) => renderHeading(column.key, column.label))}
            <th role="columnheader" scope="col">
              Compensation & location
            </th>
            {renderHeading("updatedAt", "Updated")}
            <th role="columnheader" scope="col">
              <span className="sr-only">Details</span>
            </th>
          </tr>
        </thead>
        <tbody role="rowgroup">
          {sortedApplications.map((application) => (
            <ApplicationRow
              key={application.id}
              application={application}
              timezone={timezone}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
