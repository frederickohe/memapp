import { apiRequest } from "./client";

export function getCurrentUser(token) {
  return apiRequest("/api/v1/user/me", { token });
}

export function updateCurrentUser(payload, token, { email } = {}) {
  if (email) {
    return apiRequest(`/api/v1/user/${encodeURIComponent(email)}`, {
      method: "PATCH",
      token,
      body: payload,
    });
  }
  return apiRequest("/api/v1/user/me", {
    method: "PATCH",
    token,
    body: payload,
  });
}
