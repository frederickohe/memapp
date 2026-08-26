import { apiRequest } from "./client";

function buildQuery({ page = 1, size = 20, category } = {}) {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("size", String(Math.min(size, 100)));
  if (category) params.set("category", category);
  return params.toString();
}

export function browsePublicPrograms(options = {}, token) {
  const query = buildQuery(options);
  return apiRequest(`/api/v1/program/public/browse?${query}`, { token });
}

export function getProgramById(programId, token) {
  return apiRequest(`/api/v1/program/${programId}`, { token });
}

export function getMyPrograms(options = {}, token) {
  const query = buildQuery(options);
  return apiRequest(`/api/v1/program/my-programs?${query}`, { token });
}

export function selfEnrollInProgram(programId, { userId, formId, formData, notes } = {}, token) {
  return apiRequest(`/api/v1/program/${programId}/self-enroll`, {
    method: "POST",
    token,
    body: {
      user_id: userId,
      form_id: formId,
      form_data: formData || {},
      notes,
    },
  });
}

export function getFormById(formId, token) {
  return apiRequest(`/api/v1/form/${formId}`, { token });
}

export function submitFormResponse(formId, { data, notes } = {}, token) {
  return apiRequest(`/api/v1/form/${formId}/submit`, {
    method: "POST",
    token,
    body: { data, notes },
  });
}
