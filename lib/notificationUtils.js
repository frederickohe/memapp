import {
  AlertTriangle,
  Award,
  Bell,
  CheckCircle2,
  CreditCard,
  Info,
  Megaphone,
  ShieldAlert,
} from "lucide-react-native";

const TYPE_ICONS = {
  INFO: Info,
  WARNING: AlertTriangle,
  ERROR: ShieldAlert,
  SUCCESS: CheckCircle2,
  PROMOTIONAL: Megaphone,
  TRANSACTIONAL: CreditCard,
  OTP: Bell,
  ALERT: AlertTriangle,
};

const TYPE_LABELS = {
  INFO: "Information",
  WARNING: "Warning",
  ERROR: "Alert",
  SUCCESS: "Success",
  PROMOTIONAL: "Promotion",
  TRANSACTIONAL: "Transaction",
  OTP: "Verification",
  ALERT: "Alert",
};

function formatTime(isoDate) {
  if (!isoDate) return "";
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function getDateSection(isoDate) {
  if (!isoDate) return "Earlier";

  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "Earlier";

  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const startOfDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffDays = Math.round((startOfToday - startOfDate) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function extractText(data, keys) {
  for (const key of keys) {
    const value = data?.[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return "";
}

export function mapNotification(item) {
  const data = item?.data && typeof item.data === "object" ? item.data : {};
  const type = item?.type || "INFO";

  const title =
    extractText(data, ["title", "subject", "heading", "name"]) ||
    TYPE_LABELS[type] ||
    "Notification";

  const body =
    extractText(data, ["message", "body", "text", "description", "content"]) ||
    extractText(data, ["summary", "details"]) ||
    "You have a new update.";

  return {
    id: item.id,
    type,
    status: item.status,
    title,
    body,
    unread: item.status === "UNREAD",
    createdAt: item.created_at,
    section: getDateSection(item.created_at),
    date: formatTime(item.created_at),
    Icon: TYPE_ICONS[type] || Award,
    raw: item,
  };
}

export function groupNotifications(items) {
  const sections = [];
  const seen = new Set();

  for (const item of items) {
    if (seen.has(item.section)) continue;
    seen.add(item.section);
    sections.push({
      label: item.section,
      items: items.filter((entry) => entry.section === item.section),
    });
  }

  return sections;
}

export function filterToApiStatus(activeFilter) {
  if (activeFilter === "Unread" || activeFilter === "New") return "UNREAD";
  if (activeFilter === "Old") return "READ";
  return undefined;
}
