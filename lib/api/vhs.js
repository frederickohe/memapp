import { apiRequest, apiUpload } from "./client";

function unwrapData(response) {
  return response?.data ?? response;
}

export function getVolunteerImpact(token) {
  return apiRequest("/api/v1/vhs/impact", { token }).then(unwrapData);
}

export function submitVolunteerHours(payload, token) {
  return apiRequest("/api/v1/vhs/submit", {
    method: "POST",
    token,
    body: payload,
  }).then(unwrapData);
}

export function uploadVolunteerProof(file, token) {
  return apiUpload("/api/v1/storage/upload", {
    uri: file.uri,
    name: file.name || "volunteer-proof.jpg",
    type: file.type || "image/jpeg",
    token,
    query: { folder: "listings" },
  });
}
