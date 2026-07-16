function calculateAge(dateOfBirth) {
  if (!dateOfBirth) return null;
  const dob = new Date(dateOfBirth);
  if (Number.isNaN(dob.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age -= 1;
  }
  return age;
}

function formatDateJoined(createdAt) {
  if (!createdAt) return "—";
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-GB");
}

export function getFirstName(fullname) {
  if (!fullname?.trim()) return "Member";
  return fullname.trim().split(/\s+/)[0];
}

function formatStatus(value) {
  if (!value) return "Unpaid";
  const normalized = String(value).trim();
  if (!normalized) return "Unpaid";
  return normalized.charAt(0).toUpperCase() + normalized.slice(1).toLowerCase();
}

/**
 * Maps Zustand auth state to UI-friendly profile fields.
 */
export function mapAuthToProfile({ user, phone, email } = {}) {
  const age = calculateAge(user?.date_of_birth);

  return {
    name: user?.fullname || "Member",
    firstName: getFirstName(user?.fullname),
    branch: user?.current_branch || "—",
    id: user?.member_id || user?.id || "—",
    age: age != null ? String(age) : "—",
    gender: user?.gender || "—",
    interests: Array.isArray(user?.skills) ? user.skills.filter(Boolean) : [],
    dateJoined: formatDateJoined(user?.created_at),
    email: user?.email || email || "—",
    phone: user?.phone_number || phone || "—",
    avatar: user?.profile_picture_url || null,
    membershipType: user?.membership_type || "—",
    affiliationStatus: formatStatus(user?.year_affiliation_paid_status),
    duesStatus: formatStatus(user?.month_dues_paid_status),
    nationality: user?.nationality || "—",
    address: user?.address || "—",
  };
}
