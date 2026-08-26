import { apiRequest } from "./client";

export function listAvailableSurveys({ page = 1, size = 50 } = {}, token) {
  return apiRequest(`/api/v1/form/available?page=${page}&size=${size}`, { token });
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

export function estimateSurveyMinutes(fields = []) {
  return Math.max(1, Math.ceil((fields.length || 1) / 3));
}
