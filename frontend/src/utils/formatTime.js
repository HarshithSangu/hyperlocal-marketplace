/**
 * Format last seen date into a human-readable string
 * @param {Date | string | null} date - The last seen date
 * @returns {string} Formatted string like "Last seen 10:45 PM", "Last seen yesterday", "Last seen Mar 3"
 */
export function formatLastSeen(date) {
  if (!date) return "";

  const lastSeenDate = new Date(date);
  const now = new Date();

  // Calculate difference in milliseconds
  const diff = now - lastSeenDate;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  // Less than 1 minute
  if (seconds < 60) {
    return "Last seen just now";
  }

  // Less than 1 hour
  if (minutes < 60) {
    return `Last seen ${minutes}m ago`;
  }

  // Less than 24 hours
  if (hours < 24) {
    return `Last seen ${hours}h ago`;
  }

  // Yesterday
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (lastSeenDate.toDateString() === yesterday.toDateString()) {
    return "Last seen yesterday";
  }

  // Same year
  if (lastSeenDate.getFullYear() === now.getFullYear()) {
    const monthDay = lastSeenDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    return `Last seen ${monthDay}`;
  }

  // Different year
  const monthDayYear = lastSeenDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return `Last seen ${monthDayYear}`;
}
