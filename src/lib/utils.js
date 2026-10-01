export function assetPath(path) {
  if (!path) return path;
  return path.replace(/^\.\//, "/");
}

export function getCategoryFilter(category, type) {
  if (type === "video" || category === "GameVideos") {
    return "videos";
  }
  if (category === "PC Steam") {
    return "steam";
  }
  if (category === "Tools") {
    return "tools";
  }
  if (category === "Mobile Puzzle") {
    return "puzzle";
  }
  if (category === "Mobile Casual") {
    return "casual";
  }
  return "all";
}

export function formatDate(dateString) {
  const date = new Date(dateString);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

export function getCompanyName(experience) {
  if (experience.company) return experience.company;
  const companyMatch = experience.position?.match(/at\s+(.+)$/i);
  return companyMatch ? companyMatch[1] : experience.position;
}

export function getExperienceSummary(experience) {
  if (!experience.description) return "";
  return experience.description
    .filter((item) => item && item.trim())
    .map((item) => item.replace(/^[•\-\*]\s*/, "").trim())
    .join(" ");
}
