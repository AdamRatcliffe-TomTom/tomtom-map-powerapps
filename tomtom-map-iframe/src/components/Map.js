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
  padding: { top: 60, right: 32, bottom: 32, left: 32 },
  animate: false
};

const Map = ({ apiKey, center, zoom, routeGeoJson, locationsGeoJson }) => {
  const mapRef = useRef();
  const [mapStyle, setMapStyle] = useState({
    name: "street",
    style: MapStyles.street
  });
  const [bounds, setBounds] = useState();
  const [selectedRouteId, setselectedRouteId] = useState();

  useEffect(() => {
    if (routeGeoJson) {
      const bounds = geoJsonBounds(routeGeoJson);
      setBounds(bounds);
    }
  }, [routeGeoJson]);

  const handleMapStyleSelected = (name) => {
    setMapStyle({
      name,
      style: MapStyles[name]
    });
  };

  const handleRouteSelected = (routeId) => {
    setselectedRouteId(routeId);
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
      key={apiKey}
      apiKey={apiKey}
      mapStyle={mapStyle.style}
      containerStyle={{
        width: "100vw",
        height: "100vh"
      }}
      fitBoundsOptions={fitBoundsOptions}
      movingMethod="jumpTo"
      center={center}
      zoom={zoom}
      bounds={bounds}
    >
      <ControlGroup position="bottom-left" $display="flex" $gap="10u">
        <MapSwitcherControl
          apiKey={apiKey}
          selected={mapStyle.name}
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
