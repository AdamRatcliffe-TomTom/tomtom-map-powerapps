export default function inferRequestType(url) {
  if (!url) return null;

  if (url.includes("calculateRoute")) return "calculateRoute";
  if (url.includes("calculateReachableRange")) return "calculateReachableRange";
  if (url.includes("poiSearch")) return "search";

  return null;
}
