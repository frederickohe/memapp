import { Platform } from "react-native";

import { API_BASE_URL } from "./config";

export class ApiError extends Error {
  constructor(message, status, payload) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

function extractErrorMessage(payload, fallback) {
  if (!payload) return fallback;
  if (typeof payload === "string") return payload;
  if (typeof payload.message === "string" && payload.message.trim()) {
    return payload.message;
  }

  const detail = payload.detail;
  if (typeof detail === "string" && detail.trim()) return detail;

  if (Array.isArray(detail)) {
    const messages = detail
      .map((item) => item?.msg || item?.message)
      .filter(Boolean);
    if (messages.length) return messages.join(", ");
  }

  if (detail && typeof detail === "object") {
    if (Array.isArray(detail.errors) && detail.errors.length) {
      const messages = detail.errors
        .map((item) => item?.message || item?.msg)
        .filter(Boolean);
      if (messages.length) return messages.join(", ");
    }
    if (typeof detail.message === "string" && detail.message.trim()) {
      return detail.message;
    }
  }

  return fallback;
}

export async function apiRequest(path, { method = "GET", body, token, headers = {} } = {}) {
  const requestHeaders = {
    Accept: "application/json",
    ...headers,
  };

  if (body !== undefined) {
    requestHeaders["Content-Type"] = "application/json";
  }

  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: requestHeaders,
    cache: "no-store",
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const text = await response.text();
  let payload = null;

  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = text;
    }
  }

  if (!response.ok) {
    throw new ApiError(
      extractErrorMessage(payload, `Request failed (${response.status})`),
      response.status,
      payload
    );
  }

  return payload;
}

export async function apiUpload(
  path,
  { uri, name = "photo.jpg", type = "image/jpeg", token, query = {} } = {}
) {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value));
    }
  });
  const suffix = params.toString() ? `?${params.toString()}` : "";

  const form = new FormData();
  if (Platform.OS === "web") {
    const blob = await (await fetch(uri)).blob();
    form.append("file", blob, name);
  } else {
    form.append("file", { uri, name, type });
  }

  const headers = { Accept: "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  // Expo's global fetch rejects React Native `{ uri, name, type }` FormData
  // parts, so native uploads go through XMLHttpRequest instead.
  const { status, text } = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${API_BASE_URL}${path}${suffix}`);
    Object.entries(headers).forEach(([key, value]) => {
      xhr.setRequestHeader(key, value);
    });
    xhr.onload = () => resolve({ status: xhr.status, text: xhr.responseText });
    xhr.onerror = () => reject(new ApiError("Network error during upload", 0, null));
    xhr.ontimeout = () => reject(new ApiError("Upload timed out", 0, null));
    xhr.send(form);
  });

  let payload = null;
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = text;
    }
  }

  if (status < 200 || status >= 300) {
    throw new ApiError(
      extractErrorMessage(payload, `Upload failed (${status})`),
      status,
      payload
    );
  }

  return payload;
}
