import { apiRequest } from "./client";

export async function fetchPublicAppConfig() {
  return apiRequest("/api/v1/app/config");
}
