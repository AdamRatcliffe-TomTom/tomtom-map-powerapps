export default function convertToGeoJson(routingResponse) {
  if (!routingResponse || !Array.isArray(routingResponse.routes)) {
    return {
      type: "FeatureCollection",
      features: []
    };
  }

  const features = routingResponse.routes.map((route, index) => {
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
      id: `route-${index}`,
      geometry,
      properties: {
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
