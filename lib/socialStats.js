export function formatSocialCount(value) {
  const n = Math.max(0, Number(value) || 0);
  if (n < 1000) return String(n);
  if (n < 1_000_000) {
    const compact = n / 1000;
    const text = compact >= 10 ? String(Math.round(compact)) : compact.toFixed(1).replace(/\.0$/, "");
    return `${text}k`;
  }
  const compact = n / 1_000_000;
  const text = compact >= 10 ? String(Math.round(compact)) : compact.toFixed(1).replace(/\.0$/, "");
  return `${text}m`;
}

export function formatLikesLabel(count) {
  const n = Math.max(0, Number(count) || 0);
  return n === 1 ? "1 like" : `${formatSocialCount(n)} likes`;
}

export function formatViewsLabel(count) {
  const n = Math.max(0, Number(count) || 0);
  return n === 1 ? "1 view" : `${formatSocialCount(n)} views`;
}
