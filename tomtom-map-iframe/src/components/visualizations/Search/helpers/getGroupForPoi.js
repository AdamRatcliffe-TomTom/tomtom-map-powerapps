import categoryIdToGroupMap from "./categoryIdToGroupMap.json";

/**
 * Determines the vector tile group for a POI feature based on its categorySet ID.
 *
 * @param {Object} poi - The POI object from the search API response.
 * @returns {string|null} The group string (e.g., "eat_and_drink") or null if not matched.
 */
export default function getGroupForPoi(poi) {
  if (!poi || !Array.isArray(poi.categorySet)) return null;

  for (const { id } of poi.categorySet) {
    const topLevelId = Math.floor(id / 1000);

    if (categoryIdToGroupMap[topLevelId]) {
      return categoryIdToGroupMap[topLevelId];
    }
  }

  return null;
}
