import template from "../../templates/user/applications.json";
import type { ApplicationData } from "../types";

export interface Profile {
  id: string;
  data: ApplicationData;
}

// Each folder owns its history. The empty template is shown only on a fresh copy.
const files = import.meta.glob<ApplicationData>(
  "../../users/*/applications.json",
  {
    eager: true,
    import: "default",
  },
);

export const profiles: Profile[] = Object.entries(files)
  .map(([path, data]) => ({ id: path.split("/").at(-2)!, data }))
  .sort((a, b) => a.data.candidate.localeCompare(b.data.candidate));

if (profiles.length === 0) {
  profiles.push({ id: "template", data: template as ApplicationData });
}
