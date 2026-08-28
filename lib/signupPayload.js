import { isValidEmail, normalizeEmail } from "./authValidation";

function toIsoDate(value) {
  if (!value) return undefined;

  // DD/MM/YYYY → YYYY-MM-DD
  const slashMatch = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (slashMatch) {
    const [, dd, mm, yyyy] = slashMatch;
    return `${yyyy}-${mm}-${dd}`;
  }

  // Already ISO date
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return undefined;
  return parsed.toISOString().slice(0, 10);
}

function toList(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  return String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function compact(payload) {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => {
      if (value === undefined || value === null) return false;
      if (typeof value === "string") return value.trim().length > 0;
      if (Array.isArray(value)) return value.length > 0;
      return true;
    })
  );
}

/**
 * Maps onboarding form state to POST /api/v1/auth/signup body.
 */
export function generateMemberId() {
  let digits = "";
  for (let i = 0; i < 10; i += 1) {
    digits += String(Math.floor(Math.random() * 10));
  }
  return `YID${digits}`;
}

export function buildSignupPayload(form, { phone, email } = {}) {
  const resolvedEmail = normalizeEmail(form.email || form.username || email);
  const resolvedPhone = String(form.phone || phone || "").trim();

  if (!form.fullName?.trim()) {
    throw new Error("Full name is required");
  }
  if (!isValidEmail(resolvedEmail)) {
    throw new Error("Enter a valid email address");
  }
  if (!form.password || String(form.password).length < 8) {
    throw new Error("Password must be at least 8 characters");
  }

  return compact({
    fullname: form.fullName.trim(),
    email: resolvedEmail,
    phone_number: resolvedPhone,
    profile_picture_url: form.profilePictureUrl,
    password: form.password,
    nationality: form.nationality,
    date_of_birth: toIsoDate(form.dateOfBirth),
    gender: form.gender,
    address: form.address,
    membership_type: form.membershipType,
    current_branch: form.currentBranch,
    branch_id: form.branchId,
    member_id: form.membershipId,
    facebook_url: form.facebook,
    whatsapp_number: resolvedPhone,
    linkedin_url: form.linkedin,
    twitter_url: form.twitter,
    instagram_url: form.instagram,
    occupation: form.goJointer,
    organization_workplace: form.articularWellbeing,
    skills: toList(form.skills),
    experiences: toList(form.numberOfBonds),
    profile_sharing: Boolean(form.photoAccepted),
    in_app_notification: Boolean(form.notifAccepted),
    sms_notification: Boolean(form.notifAccepted),
    created_at: new Date().toISOString(),
  });
}
