import getGroupForPoi from "./getGroupForPoi";
import getCategoryForPoi from "./getCategoryForPoi";

export default function convertToGeoJson(responseData, mapType) {
  if (!responseData?.results?.length) return null;

  const features = responseData.results.map((result) => {
    const { position, poi, address } = result;

    const props = {
      ...result,
      name: poi?.name || address?.freeformAddress?.split(",")[0],
      category: getCategoryForPoi(poi, mapType),
      group: getGroupForPoi(poi)
    };

    return {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [position.lon, position.lat]
      },
      properties: props,
      id: result.id || `${position.lat}-${position.lon}`
    };
  });

  return {
    type: "FeatureCollection",
    features
  };
}
