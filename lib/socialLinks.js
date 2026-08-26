function cleanHandle(value) {
  return String(value || "")
    .trim()
    .replace(/^@/, "")
    .replace(/\/+$/, "");
}

function usernameFromUrl(value, hosts) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  const withProtocol = raw.includes("://") ? raw : `https://${raw}`;
  try {
    const url = new URL(withProtocol);
    if (hosts.some((host) => url.hostname.includes(host))) {
      const parts = url.pathname.split("/").filter(Boolean);
      if (url.hostname.includes("linkedin.com")) {
        const idx = parts.findIndex((part) => part === "in" || part === "company");
        return idx >= 0 ? parts[idx + 1] || "" : parts[0] || "";
      }
      return parts[0] || "";
    }
  } catch {
    return "";
  }
  return "";
}

export function displaySocialHandle(kind, value) {
  if (!value) return "";
  if (kind === "whatsapp") return String(value).trim();
  const fromUrl = usernameFromUrl(value, {
    instagram: ["instagram.com"],
    twitter: ["twitter.com", "x.com"],
    facebook: ["facebook.com", "fb.com"],
    linkedin: ["linkedin.com"],
  }[kind] || []);
  const handle = cleanHandle(fromUrl || value);
  return handle ? `@${handle}` : String(value).trim();
}

export function socialDeepLink(kind, value) {
  if (!value) return null;
  const raw = String(value).trim();

  if (kind === "whatsapp") {
    const digits = raw.replace(/[^\d]/g, "");
    if (!digits) return null;
    return `https://wa.me/${digits}`;
  }

  if (/^https?:\/\//i.test(raw)) return raw;

  const handle = cleanHandle(raw);
  if (!handle) return null;

  if (kind === "instagram") return `https://instagram.com/${handle}`;
  if (kind === "twitter") return `https://twitter.com/${handle}`;
  if (kind === "facebook") return `https://facebook.com/${handle}`;
  if (kind === "linkedin") {
    if (raw.toLowerCase().includes("linkedin.com")) {
      return raw.startsWith("http") ? raw : `https://${raw}`;
    }
    return `https://www.linkedin.com/in/${handle}`;
  }
  return raw;
}

export function listedSocialChannels(profile) {
  if (!profile) return [];
  const channels = [
    { id: "whatsapp", label: "WhatsApp", value: profile.whatsapp_number },
    { id: "instagram", label: "Instagram", value: profile.instagram_url },
    { id: "twitter", label: "Twitter / X", value: profile.twitter_url },
    { id: "facebook", label: "Facebook", value: profile.facebook_url },
    { id: "linkedin", label: "LinkedIn", value: profile.linkedin_url },
  ];
  return channels
    .filter((item) => Boolean(item.value && String(item.value).trim()))
    .map((item) => ({
      ...item,
      handle: displaySocialHandle(item.id, item.value),
      url: socialDeepLink(item.id, item.value),
    }))
    .filter((item) => Boolean(item.url));
}
