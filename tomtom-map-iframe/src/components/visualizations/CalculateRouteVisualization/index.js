import React, { useMemo, useState } from "react";
import Map from "components/Map";
import geoJsonBounds from "helpers/geoJsonBounds";
import Route from "./components/Route";
import MarkerLayer from "./components/MarkerLayer";
import RouteSummaryControl from "./components/RouteSummaryControl";
import calculateRouteResponseToGeoJson from "./helpers/calculateRouteResponseToGeoJson";
import parseRouteUrlToGeoJson from "./helpers/parseRouteUrlToGeoJson";

const CalculateRouteVisualization = ({ config, responseData }) => {
  const [selectedRouteId, setSelectedRouteId] = useState(null);

  const routeGeoJson = useMemo(() => {
    return responseData ? calculateRouteResponseToGeoJson(responseData) : null;
  }, [responseData]);

  const locationsGeoJson = useMemo(() => {
    return config.url ? parseRouteUrlToGeoJson(config.url) : null;
  }, [config.url]);

  const bounds = useMemo(() => {
    return routeGeoJson ? geoJsonBounds(routeGeoJson) : null;
  }, [routeGeoJson]);

  const routeSummary = useMemo(() => {
    if (!routeGeoJson?.features?.length) return null;
    const feature =
      routeGeoJson.features.find((f) => f.id === selectedRouteId) ||
      routeGeoJson.features[0];
    return feature?.properties?.summary || null;
  }, [routeGeoJson, selectedRouteId]);

  const handleRouteSelected = (routeId) => {
    setSelectedRouteId(routeId);
  };

  return (
    <Map
      apiKey={config.apiKey}
      center={config.center}
      zoom={config.zoom}
      map={config.map}
      bounds={bounds}
    >
      {routeSummary && (
        <RouteSummaryControl summary={routeSummary} position="top-left" />
      )}
      {routeGeoJson && (
        <Route
          before="Borders - Treaty label"
          data={routeGeoJson}
          selected={selectedRouteId}
          onSelect={handleRouteSelected}
        />
      )}
      {locationsGeoJson && <MarkerLayer data={locationsGeoJson} />}
    </Map>
  );
};

export default CalculateRouteVisualization;
