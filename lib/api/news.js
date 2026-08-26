import { apiRequest } from "./client";

function buildQuery({
  page = 1,
  size = 10,
  sort_by = "published_at",
  content_type,
  impact_only,
} = {}) {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("size", String(Math.min(size, 50)));
  params.set("sort_by", sort_by);
  if (content_type) params.set("content_type", content_type);
  if (impact_only) params.set("impact_only", "true");
  return params.toString();
}

export function getPublishedNews(options = {}, token) {
  const query = buildQuery(options);
  return apiRequest(`/api/v1/news/?${query}`, { token });
}

export function getNewsById(newsId, token) {
  return apiRequest(`/api/v1/news/${newsId}`, { token });
}

export function getImpactStories(limit = 5, token) {
  const safeLimit = Math.min(Math.max(limit, 1), 20);
  return apiRequest(`/api/v1/news/impact-stories?limit=${safeLimit}`, { token });
}

export function getUpcomingEvents(limit = 10, token) {
  const safeLimit = Math.min(Math.max(limit, 1), 50);
  return apiRequest(`/api/v1/news/events/upcoming?limit=${safeLimit}`, { token });
}
