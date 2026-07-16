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

/**
 * Maps onboarding form state to POST /api/v1/auth/signup body.
 */
export function buildSignupPayload(form, { phone, email } = {}) {
  const resolvedEmail = form.email || email || "";
  const resolvedPhone = form.phone || phone || "";

  return {
    fullname: form.fullName?.trim(),
    email: resolvedEmail.trim(),
    phone_number: resolvedPhone.trim(),
    profile_picture_url: form.profilePictureUrl || "",
    password: form.password,
    nationality: form.nationality || "",
    date_of_birth: toIsoDate(form.dateOfBirth),
    gender: form.gender || "",
    address: form.address || "",
    membership_type: form.membershipType || "",
    current_branch: form.currentBranch || "",
    member_id: form.membershipId || form.educationId || "",
    facebook_url: form.facebook || "",
    whatsapp_number: resolvedPhone.trim(),
    linkedin_url: form.linkedin || "",
    twitter_url: form.twitter || "",
    instagram_url: form.instagram || "",
    occupation: form.goJointer || "",
    organization_workplace: form.articularWellbeing || "",
    skills: toList(form.skills),
    experiences: toList(form.numberOfBonds),
    profile_sharing: Boolean(form.photoAccepted),
    in_app_notification: Boolean(form.notifAccepted),
    sms_notification: Boolean(form.notifAccepted),
    created_at: new Date().toISOString(),
  };
}
