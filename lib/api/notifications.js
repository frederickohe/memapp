import { apiRequest } from "./client";

function buildQuery({ page = 1, size = 10, status, type } = {}) {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("size", String(Math.min(size, 50)));
  if (status) params.set("status", status);
  if (type) params.set("type", type);
  return params.toString();
}

export function getNotifications(token, options = {}) {
  const query = buildQuery(options);
  return apiRequest(`/api/v1/notification/?${query}`, { token });
}

export function markNotificationRead(token, notificationId) {
  return apiRequest(`/api/v1/notification/${notificationId}/read`, {
    method: "POST",
    token,
  });
}

export function markAllNotificationsRead(token) {
  return apiRequest("/api/v1/notification/mark-all-read", {
    method: "POST",
    token,
  });
}
