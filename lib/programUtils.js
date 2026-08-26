import { formatTimeAgo } from "./newsUtils";

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80";

function formatDate(isoDate) {
  if (!isoDate) return "";
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateRange(startIso, endIso) {
  const start = formatDate(startIso);
  const end = formatDate(endIso);
  if (start && end) return `${start} – ${end}`;
  return start || end || "";
}

function excerpt(text, max = 140) {
  if (!text) return "";
  const cleaned = String(text).replace(/\s+/g, " ").trim();
  if (cleaned.length <= max) return cleaned;
  return `${cleaned.slice(0, max).trim()}…`;
}

function resolveApplyAction(item) {
  const actions = item?.metadata?.actions;
  if (Array.isArray(actions)) {
    const formAction = actions.find((action) => action.type === "form" && action.form_id);
    if (formAction) {
      return {
        type: "form",
        formId: formAction.form_id,
        label: formAction.label || "Apply",
      };
    }
    const linkAction = actions.find((action) => action.type === "external_link" && action.url);
    if (linkAction) {
      return {
        type: "external_link",
        url: linkAction.url,
        label: linkAction.label || "Register",
      };
    }
  }

  const linkedForm = item?.forms?.[0];
  if (linkedForm?.id) {
    return {
      type: "form",
      formId: linkedForm.id,
      label: "Apply",
      form: linkedForm,
    };
  }

  if (item?.register_url) {
    return {
      type: "external_link",
      url: item.register_url,
      label: "Register",
    };
  }

  if (item?.allow_registration) {
    return { type: "enroll", label: "Apply" };
  }

  return null;
}

export function mapProgramItem(item) {
  const forms = Array.isArray(item?.forms) ? item.forms : [];
  const applyAction = resolveApplyAction(item);

  return {
    id: item.id,
    title: item.title || "Untitled program",
    description: item.description || "",
    summary: excerpt(item.description),
    image: item.thumbnail_url || PLACEHOLDER_IMAGE,
    category: item.category || "Programs",
    location: item.location || "",
    status: item.status || "",
    capacity: item.capacity ?? null,
    participantCount: item.participant_count ?? 0,
    startingDate: item.starting_date,
    endDate: item.end_date,
    dateRange: formatDateRange(item.starting_date, item.end_date),
    timeAgo: formatTimeAgo(item.created_at || item.starting_date),
    isPublished: Boolean(item.is_published),
    allowRegistration: item.allow_registration !== false,
    registerUrl: item.register_url || "",
    youtubeUrl: item.youtube_url || "",
    forms,
    applyAction,
    metadata: item.metadata || {},
    raw: item,
  };
}

export function uniqueProgramCategories(programs) {
  const seen = new Set();
  const categories = [];
  programs.forEach((program) => {
    const label = program.category?.trim();
    if (label && !seen.has(label)) {
      seen.add(label);
      categories.push(label);
    }
  });
  return categories;
}
