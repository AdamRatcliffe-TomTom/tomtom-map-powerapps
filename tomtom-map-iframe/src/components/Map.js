import React, { useState, useRef, useEffect, useMemo } from "react";
import ReactMap from "react-tomtom-maps";
import Route from "./Route";
import MarkerLayer from "./MarkerLayer";
import ControlGroup from "./ControlGroup";
import MapSwitcherControl from "./MapSwitcher";
import TrafficControl from "./TrafficControl";
import RouteSummaryControl from "./RouteSummaryControl";
import MapStyles from "../constants/MapStyles";
import geoJsonBounds from "../helpers/geoJsonBounds";

const fitBoundsOptions = {
  padding: { top: 90, right: 32, bottom: 32, left: 32 },
  animate: false
};

const Map = ({
  map: mapType = "orbis",
  apiKey,
  center,
  zoom,
  routeGeoJson,
  locationsGeoJson
}) => {
  const mapRef = useRef();
  const [selectedRouteId, setSelectedRouteId] = useState();
  const [bounds, setBounds] = useState();
  const [mapStyleName, setMapStyleName] = useState("street");

  const computedMapStyle = useMemo(() => {
    return mapStyleName === "street"
      ? MapStyles.street[mapType]
      : MapStyles[mapStyleName];
  }, [mapStyleName, mapType]);

  useEffect(() => {
    if (routeGeoJson) {
      const bounds = geoJsonBounds(routeGeoJson);
      setBounds(bounds);
    }
  }, [routeGeoJson]);

  const handleMapStyleSelected = (name) => {
    setMapStyleName(name);
  };

  const handleRouteSelected = (routeId) => {
    setSelectedRouteId(routeId);
  };

  const routeSummary = useMemo(() => {
    if (!routeGeoJson?.features?.length) return null;
    const feature =
      routeGeoJson.features.find((f) => f.id === selectedRouteId) ||
      routeGeoJson.features[0];
    return feature?.properties?.summary || null;
  }, [routeGeoJson, selectedRouteId]);

  return (
    <ReactMap
      ref={mapRef}
      apiKey={apiKey}
      mapStyle={computedMapStyle}
      containerStyle={{ width: "100vw", height: "100vh" }}
      fitBoundsOptions={fitBoundsOptions}
      movingMethod="jumpTo"
      center={center}
      zoom={zoom}
      bounds={bounds}
    >
      <ControlGroup position="bottom-left" $display="flex" $gap="10u">
        <MapSwitcherControl
          apiKey={apiKey}
          mapType={mapType}
          selected={mapStyleName}
          onSelected={handleMapStyleSelected}
        />
        <TrafficControl />
      </ControlGroup>
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
    </ReactMap>
  );
};

export default Map;
