import { apiRequest } from "./client";

export function branchOptionLabel(branch) {
  if (!branch) return "";
  if (branch.region_name) return `${branch.name} (${branch.region_name})`;
  return branch.name;
}

export function findBranchByLabel(branches, label) {
  return (branches || []).find((branch) => branchOptionLabel(branch) === label);
}

export function findBranchById(branches, id) {
  return (branches || []).find((branch) => branch.id === id);
}

export async function listActiveBranches() {
  const payload = await apiRequest("/api/v1/branches");
  const branches = payload?.branches ?? payload?.data?.branches ?? [];
  return Array.isArray(branches) ? branches : [];
}
