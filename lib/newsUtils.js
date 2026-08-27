const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1669418989936-fae7f3cebd56?auto=format&fit=crop&w=800&q=80";

function formatDate(isoDate) {
  if (!isoDate) return "";
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatTimeAgo(isoDate) {
  if (!isoDate) return "";

  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "";

  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hr ago`;
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;

  return formatDate(isoDate);
}

function getCategoryLabel(item) {
  if (item?.is_impact_story) return "Projects";
  if (item?.content_type === "EVENT") return "Activities";
  if (item?.content_type === "NEWS") return "News";
  return "News";
}

function getPrimaryImage(media = []) {
  if (!Array.isArray(media) || media.length === 0) {
    return PLACEHOLDER_IMAGE;
  }

  const sorted = [...media].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  return sorted[0]?.url || PLACEHOLDER_IMAGE;
}

export function mapNewsItem(item) {
  const publishedAt = item?.published_at || item?.created_at;

  return {
    id: item.id,
    title: item.title || "Untitled",
    summary: item.summary || "",
    content: item.content || item.summary || "",
    image: getPrimaryImage(item.media),
    category: getCategoryLabel(item),
    contentType: item.content_type,
    isImpactStory: Boolean(item.is_impact_story),
    eventDate: item.event_date,
    eventLocation: item.event_location || "",
    date: formatDate(publishedAt),
    timeAgo: formatTimeAgo(publishedAt),
    publishedAt,
    media: item.media || [],
    likes: 0,
    comments: 0,
    bookmarks: 0,
    raw: item,
  };
}

export function filterToApiParams(activeFilter) {
  if (activeFilter === "Activities") {
    return { content_type: "EVENT" };
  }
  if (activeFilter === "Projects") {
    return { impact_only: true };
  }
  return {};
}

export function applyClientFilter(items, activeFilter) {
  if (activeFilter === "Projects") {
    return items.filter((item) => item.isImpactStory);
  }
  return items;
}

export function filterLabelToApiContentType(label) {
  if (label === "Activities") return "EVENT";
  if (label === "News") return "NEWS";
  return undefined;
}

export function formatNewsUpdatesLabel(count) {
  if (count === 0) return "No New Updates";
  if (count === 1) return "1 New Update";
  return `${count} New Updates`;
}
