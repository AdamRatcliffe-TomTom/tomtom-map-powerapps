export default function parseRouteUrlToGeoJson(url) {
  const result = {
    type: "FeatureCollection",
    features: []
  };

  const routePattern = /calculateRoute\/([^?]+)/;
  const match = url.match(routePattern);

  if (!match || !match[1]) return result;

  const locationsPart = match[1];
  const pairs = locationsPart.split(":");

  pairs.forEach((pair, index) => {
    const [latStr, lonStr] = pair.split(",");
    const lat = parseFloat(latStr);
    const lon = parseFloat(lonStr);

    if (isNaN(lat) || isNaN(lon)) return;

    let type = "waypoint";
    if (index === 0) type = "origin";
    else if (index === pairs.length - 1) type = "destination";

    result.features.push({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [lon, lat]
      },
      properties: {
        type
      }
    });
  });

  return result;
}
