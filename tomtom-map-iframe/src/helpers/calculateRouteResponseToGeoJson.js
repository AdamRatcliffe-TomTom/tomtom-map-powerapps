/**
 * Converts a TomTom Routing API response to a GeoJSON FeatureCollection.
 * @param {Object} routingResponse - The JSON response from the Routing API.
 * @returns {Object} GeoJSON FeatureCollection.
 */
export default function calculateRouteResponseToGeoJson(routingResponse) {
  if (!routingResponse || !Array.isArray(routingResponse.routes)) {
    return {
      type: "FeatureCollection",
      features: []
    };
  }

  const features = routingResponse.routes.map((route, routeIndex) => {
    const legCount = route.legs.length;

    const coordinatesList = route.legs.map((leg) =>
      leg.points.map((pt) => [pt.longitude, pt.latitude])
    );

    const geometry =
      legCount === 1
        ? {
            type: "LineString",
            coordinates: coordinatesList[0]
          }
        : {
            type: "MultiLineString",
            coordinates: coordinatesList
          };

    return {
      type: "Feature",
      geometry,
      properties: {
        routeIndex,
        summary: route.summary,
        sections: route.sections
      }
    };
  });

  return {
    type: "FeatureCollection",
    features
  };
}
