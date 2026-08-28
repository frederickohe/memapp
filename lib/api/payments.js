import { apiRequest } from "./client";

function unwrapData(response) {
  return response?.data ?? response;
}

export function getPaymentConfig(token) {
  return apiRequest("/api/v1/payments/config", { token }).then(unwrapData);
}

export function getDuesSchedule(year, token) {
  const query = year ? `?year=${year}` : "";
  return apiRequest(`/api/v1/payments/schedule${query}`, { token }).then(unwrapData);
}

export function initiatePayment(payload, token) {
  return apiRequest("/api/v1/payments/initiate", {
    method: "POST",
    token,
    body: payload,
  }).then(unwrapData);
}

export function verifyPayment(reference, token) {
  return apiRequest(`/api/v1/payments/verify/${encodeURIComponent(reference)}`, {
    token,
  }).then(unwrapData);
}

export function listMyPayments(token, limit = 20) {
  return apiRequest(`/api/v1/payments/me?limit=${limit}`, { token }).then(unwrapData);
}
