const SEARCH_PATTERNS = [
  "/maps/orbis/places/search",
  "/maps/orbis/places/poiSearch",
  "/maps/orbis/places/categorySearch",
  "/maps/orbis/places/geometrySearch",
  "/maps/orbis/places/nearbySearch",
  "/maps/orbis/places/searchAlongRoute",
  "/search/2/search",
  "/search/2/poiSearch",
  "/search/2/categorySearch",
  "/search/2/geometrySearch",
  "/search/2/nearbySearch",
  "/search/2/searchAlongRoute"
];

export default function inferRequestType(url) {
  if (!url) return null;

  if (url.includes("calculateRoute")) return "calculateRoute";
  if (url.includes("calculateReachableRange")) return "calculateReachableRange";

  if (SEARCH_PATTERNS.some((pattern) => url.includes(pattern))) {
    return "search";
  }

  return null;
}
