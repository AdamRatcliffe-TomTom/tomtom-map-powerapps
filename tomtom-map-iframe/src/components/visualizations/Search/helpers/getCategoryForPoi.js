import orbisCategoryMap from "./orbisCategoryMap.json";
import genesisCategoryMap from "./genesisCategoryMap.json";

/**
 * Infers a vector tile-compatible POI category from the 'categories' array.
 */
export default function getCategoryForPoi(poi, mapType) {
  if (!poi || !Array.isArray(poi.categories)) return null;

  const isGenesis = mapType === "genesis";
  const map = isGenesis ? genesisCategoryMap : orbisCategoryMap;

  for (const category of poi.categories) {
    const lower = category.toLowerCase();
    if (map[lower]) {
      return map[lower];
    }
  }

  return null;
}
