import { apiRequest } from "./client";

export function getCurrentUser(token) {
  return apiRequest("/api/v1/user/me", { token });
}
