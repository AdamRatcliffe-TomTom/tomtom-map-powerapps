export default function convertToGeoJson(responseData) {
  if (!responseData?.reachableRange?.boundary) return null;

  const coordinates = responseData?.reachableRange?.boundary.map((point) => [
    point.longitude,
    point.latitude
  ]);

  const first = coordinates[0];
  const last = coordinates[coordinates.length - 1];
  if (first[0] !== last[0] || first[1] !== last[1]) {
    coordinates.push(first);
  }

  return {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [coordinates]
        },
        properties: {}
      }
    ]
  };
}
