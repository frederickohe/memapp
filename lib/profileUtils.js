export function mapProminentProfile(item) {
  if (!item) return null;
  return {
    id: item.id,
    fullName: item.full_name || "",
    photoUrl: item.profile_picture_url || item.photo_url || null,
    headline: item.prominent_headline || item.headline || "",
    occupation: item.occupation || "",
    bio: item.bio || "",
    country: item.country || item.current_branch || "",
    era: item.era || "",
    category: item.category || "WORLD",
  };
}

export function shortProfileName(fullName) {
  const parts = String(fullName || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!parts.length) return "Member";
  if (parts.length === 1) return parts[0];
  const last = parts[parts.length - 1];
  if (last.length <= 12) return last;
  return parts[0];
}

export function profileInitials(fullName) {
  const parts = String(fullName || "")
    .trim()
    .split(/\s+/)
    .filter((part) => part && !["Sir", "Hon.", "Dr.", "Prof.", "Mr.", "Ms.", "Esq."].includes(part));
  if (!parts.length) return "Y";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function normalizeProfilesResponse(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.items)) return response.items;
  if (Array.isArray(response?.data)) return response.data;
  return [];
}
