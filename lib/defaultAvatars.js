const MALE_AVATARS = [
  require("@/assets/images/avatars/avatar-3d-male-a.jpg"),
  require("@/assets/images/avatars/avatar-3d-male-b.jpg"),
];

const FEMALE_AVATARS = [
  require("@/assets/images/avatars/avatar-3d-female-a.jpg"),
  require("@/assets/images/avatars/avatar-3d-female-b.jpg"),
];

const GENERIC_AVATAR = require("@/assets/images/avatars/avatar-3d-generic.jpg");

function hashSeed(value) {
  const text = String(value || "member");
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash * 31 + text.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function pickFrom(list, seed) {
  if (!list.length) return GENERIC_AVATAR;
  return list[hashSeed(seed) % list.length];
}

function normalizeGender(gender) {
  const value = String(gender || "").trim().toLowerCase();
  if (value === "male" || value === "m") return "male";
  if (value === "female" || value === "f") return "female";
  return null;
}

export function pickDefaultAvatar(person = {}) {
  const seed = person.id || person.memberId || person.name || person.handle || "member";
  const gender = normalizeGender(person.gender);

  if (gender === "male") return pickFrom(MALE_AVATARS, seed);
  if (gender === "female") return pickFrom(FEMALE_AVATARS, seed);
  return GENERIC_AVATAR;
}
