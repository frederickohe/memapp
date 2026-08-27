import { apiRequest } from "./client";

export function getProminentProfiles(limit = 20, token, category) {
  const safeLimit = Math.min(Math.max(limit, 1), 50);
  const params = new URLSearchParams();
  params.set("limit", String(safeLimit));
  if (category) params.set("category", category);
  return apiRequest(`/api/v1/dashboard/prominent-profiles?${params.toString()}`, { token });
}

export function getProminentProfileById(profileId, token) {
  return apiRequest(`/api/v1/dashboard/prominent-profiles/${profileId}`, { token });
}
