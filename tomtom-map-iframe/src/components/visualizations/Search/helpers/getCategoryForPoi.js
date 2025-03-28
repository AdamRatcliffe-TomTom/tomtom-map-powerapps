import orbisCategoryMap from "./orbisCategoryMap.json";
import genesisCategoryMap from "./genesisCategoryMap.json";

/**
 * Infers a vector tile-compatible POI category from the 'categories' array.
 */
export default function getCategoryForPoi(poi, mapType) {
  const isGenesis = mapType === "genesis";
  const map = isGenesis ? genesisCategoryMap : orbisCategoryMap;
  const defaultCategory = isGenesis ? "circle-blue2-white-2" : "toll_gantry";

  if (!poi || !Array.isArray(poi.categories) || poi.categories.length === 0) {
    return defaultCategory;
  }

  for (const category of poi.categories) {
    const lower = category.toLowerCase();
    if (map[lower]) {
      return map[lower];
    }
  }

  return defaultCategory;
}
