import { apiRequest, apiUpload } from "./client";

export function getSocialFeed({ page = 1, size = 20 } = {}, token) {
  return apiRequest(`/api/v1/social/feed?page=${page}&size=${size}`, { token });
}

export function getSocialStories(token) {
  return apiRequest("/api/v1/social/stories", { token });
}

export function createSocialPost({ caption, media_url, kind = "IMPACT" }, token) {
  return apiRequest("/api/v1/social/posts", {
    method: "POST",
    token,
    body: { caption, media_url, kind },
  });
}

export function likeSocialItem(itemId, token) {
  return apiRequest("/api/v1/social/like", {
    method: "POST",
    token,
    body: { item_id: itemId },
  });
}

export function searchSocialUsers({ q = "", page = 1, size = 20 } = {}, token) {
  const params = new URLSearchParams({
    q,
    page: String(page),
    size: String(size),
  });
  return apiRequest(`/api/v1/social/users/search?${params.toString()}`, { token });
}

export function getSocialProfile(userId, token) {
  return apiRequest(`/api/v1/social/users/${userId}`, { token });
}

export function getUserSocialPosts(userId, { page = 1, size = 30 } = {}, token) {
  return apiRequest(
    `/api/v1/social/users/${userId}/posts?page=${page}&size=${size}`,
    { token }
  );
}

export function uploadSocialMedia(file, token) {
  return apiUpload("/api/v1/storage/upload", {
    uri: file.uri,
    name: file.name || "impact.jpg",
    type: file.type || "image/jpeg",
    token,
    query: { folder: "listings" },
  });
}
