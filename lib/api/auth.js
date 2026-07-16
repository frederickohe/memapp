import { apiRequest } from "./client";

export function signIn({ email, password }) {
  return apiRequest("/api/v1/auth/signin", {
    method: "POST",
    body: { email, password },
  });
}

export function signUp(payload) {
  return apiRequest("/api/v1/auth/signup", {
    method: "POST",
    body: payload,
  });
}

export function sendOtp({ phone, email }) {
  const body = {};
  if (phone) body.phone = phone;
  if (email) body.email = email;
  return apiRequest("/api/v1/otp/send", {
    method: "POST",
    body,
  });
}

/** Pre-signup OTP check (phone or email + 5-digit code). */
export function verifyOtp({ phone, email, otp }) {
  const body = { otp };
  if (phone) body.phone = phone;
  if (email) body.email = email;
  return apiRequest("/api/v1/otp/verify", {
    method: "POST",
    body,
  });
}

/** Enables the account after signup. */
export function verifyAccountOtp({ phone, otp }) {
  return apiRequest("/api/v1/auth/verify-otp", {
    method: "POST",
    body: { phone, otp },
  });
}

export function signOut(token) {
  return apiRequest("/api/v1/auth/signout", {
    method: "POST",
    token,
  });
}
