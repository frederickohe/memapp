import { BookOpen, HeartHandshake, Laptop, Package, Trash2 } from "lucide-react-native";

export const MILESTONE_IMAGES = {
  bronze: require("@/assets/images/milestones/bronze.png"),
  platinum: require("@/assets/images/milestones/platinum.png"),
  gold: require("@/assets/images/milestones/gold.png"),
};

export const VOLUNTEER_MILESTONES = [
  {
    id: "first-step",
    name: "First Step",
    title: "Bronze Volunteer",
    hours_required: 10,
    image_key: "bronze",
    level: 1,
  },
  {
    id: "helper",
    name: "Helper",
    title: "Helper Volunteer",
    hours_required: 25,
    image_key: "platinum",
    level: 2,
  },
  {
    id: "champion",
    name: "Champion",
    title: "Gold Volunteer",
    hours_required: 50,
    image_key: "gold",
    level: 3,
  },
  {
    id: "leader",
    name: "Leader",
    title: "Leader Volunteer",
    hours_required: 100,
    image_key: null,
    level: 4,
  },
  {
    id: "legend",
    name: "Legend",
    title: "Legend Volunteer",
    hours_required: 250,
    image_key: null,
    level: 5,
  },
];

const POINTS_PER_HOUR = 10;

export function buildVolunteerImpact({
  hours = 0,
  points = 0,
  eventsAttended = 0,
  communityRank = 0,
  totalMembers = 0,
  contributions = [],
} = {}) {
  const hoursVolunteered = Number(hours) || 0;
  const volunteerPoints = Number(points) || 0;
  let previousRequired = 0;
  let currentMilestoneId = null;
  let rankTitle = "Member";
  let nextRankTitle = VOLUNTEER_MILESTONES[0]?.name || null;
  let nextRankHours = VOLUNTEER_MILESTONES[0]?.hours_required || null;

  const milestones = VOLUNTEER_MILESTONES.map((spec, index) => {
    const required = spec.hours_required;
    const nextSpec = VOLUNTEER_MILESTONES[index + 1] || null;
    let status = "locked";

    if (hoursVolunteered >= required) {
      status = "completed";
      currentMilestoneId = spec.id;
      rankTitle = spec.title;
      nextRankTitle = nextSpec?.name || null;
      nextRankHours = nextSpec?.hours_required || required;
    } else if (hoursVolunteered >= previousRequired) {
      status = "in_progress";
      if (!currentMilestoneId) {
        nextRankTitle = spec.name;
        nextRankHours = required;
      }
    }

    previousRequired = required;
    return {
      ...spec,
      status,
      hours_completed: Math.min(hoursVolunteered, required),
      progress: required <= 0 ? 1 : Math.min(1, hoursVolunteered / required),
      next_id: nextSpec?.id || null,
      next_name: nextSpec?.name || null,
      next_hours_required: nextSpec?.hours_required || null,
    };
  });

  const nextRankProgress =
    nextRankHours && nextRankHours > 0
      ? Math.min(1, hoursVolunteered / nextRankHours)
      : 1;

  return {
    hours_volunteered: hoursVolunteered,
    volunteer_points: volunteerPoints,
    events_attended: eventsAttended,
    community_rank: communityRank,
    total_members: totalMembers,
    rank_title: rankTitle,
    next_rank_title: nextRankTitle,
    next_rank_progress: nextRankProgress,
    points_to_next: Math.max(
      0,
      Math.round((nextRankHours || 0) * POINTS_PER_HOUR) - volunteerPoints
    ),
    current_milestone_id: currentMilestoneId,
    milestones,
    recent_contributions: contributions,
  };
}

let volunteerApplyDraft = {
  video: null,
};

export function setVolunteerApplyDraft(patch) {
  volunteerApplyDraft = { ...volunteerApplyDraft, ...patch };
}

export function getVolunteerApplyDraft() {
  return volunteerApplyDraft;
}

export function clearVolunteerApplyDraft() {
  volunteerApplyDraft = { video: null };
}

export function formatCount(value) {
  const number = Number(value) || 0;
  return number.toLocaleString("en-US");
}

export function formatHoursLabel(hours) {
  const value = Number(hours) || 0;
  const rounded = Number.isInteger(value) ? String(value) : value.toFixed(1);
  return `${rounded} ${value === 1 ? "Hour" : "Hours"}`;
}

export function formatVolunteerDate(value) {
  if (!value) return "";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function todayDisplayDate() {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, "0");
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  return `${dd} / ${mm} / ${now.getFullYear()}`;
}

export function parseVolunteerDate(value) {
  const raw = String(value || "").trim();
  if (!raw) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;

  const match = raw.match(/^(\d{1,2})\s*[/\-.]\s*(\d{1,2})\s*[/\-.]\s*(\d{4})$/);
  if (!match) return null;

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;

  const parsed = new Date(year, month - 1, day);
  if (
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day
  ) {
    return null;
  }

  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function contributionIcon(title = "") {
  const text = title.toLowerCase();
  if (/(clean|park|trash|litter|environment)/.test(text)) return Trash2;
  if (/(library|book|read|tutor|teach|school)/.test(text)) return BookOpen;
  if (/(food|bank|pack|sort|kitchen|meal)/.test(text)) return Package;
  if (/(tech|computer|laptop|digital|it )/.test(text)) return Laptop;
  return HeartHandshake;
}

export function milestoneImageSource(imageKey) {
  return imageKey ? MILESTONE_IMAGES[imageKey] || null : null;
}
