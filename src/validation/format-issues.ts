import type { StandardSchemaV1 } from "@standard-schema/spec";

export interface FormattedIssue {
  message: string;
  path?: string;
}

function pathToString(
  path: StandardSchemaV1.Issue["path"]
): string | undefined {
  if (!path || path.length === 0) {
    return undefined;
  }
  return path
    .map((segment) => {
      if (typeof segment === "object" && segment !== null && "key" in segment) {
        return String(segment.key);
      }
      return String(segment);
    })
    .join(".");
}

export function formatIssues(
  issues: readonly StandardSchemaV1.Issue[]
): FormattedIssue[] {
  return issues.map((issue) => ({
    message: issue.message,
    path: pathToString(issue.path),
  }));
}

export function formatIssuesAsObject(
  issues: readonly StandardSchemaV1.Issue[]
): Record<string, string[]> {
  const result: Record<string, string[]> = {};

  for (const issue of issues) {
    const path = pathToString(issue.path) ?? "_root";
    const existing = result[path];
    if (existing) {
      existing.push(issue.message);
    } else {
      result[path] = [issue.message];
    }
  }

  return result;
}
