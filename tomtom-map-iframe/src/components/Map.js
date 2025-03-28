import React, { useState, useRef, useEffect, useMemo } from "react";
import _capitalize from "lodash.capitalize";
import ReactMap from "react-tomtom-maps";
import MapStyles from "constants/MapStyles";
import ControlGroup from "./ControlGroup";
import MapSwitcherControl from "./MapSwitcher";
import TrafficControl from "./TrafficControl";

const poiLayerId = "POI";

const fitBoundsOptions = {
  padding: { top: 90, right: 32, bottom: 32, left: 32 },
  animate: false
};

const Map = ({
  map: mapType = "orbis",
  apiKey,
  center,
  zoom,
  bounds,
  children
}) => {
  const mapRef = useRef();
  const styleLoaded = useRef(false);
  const [mapStyleName, setMapStyleName] = useState("street");
  const [mapReady, setMapIsReady] = useState(false);

  const computedMapStyle = useMemo(() => {
    return mapStyleName === "street"
      ? MapStyles.street[mapType]
      : MapStyles[mapStyleName];
  }, [mapStyleName, mapType]);

  useEffect(() => {
    const attributionControl = mapRef.current?.getAttributionControl();
    attributionControl?.setSeparator(" - ");
    attributionControl?.addAttribution(_capitalize(mapType));
  }, [mapType, mapReady]);

  useEffect(() => {
    const map = mapRef.current;

    if (!map) return;

    if (styleLoaded.current) {
      if (map.getLayer(poiLayerId)) {
        map.setLayoutProperty(poiLayerId, "visibility", "none");
      }
    } else {
      map.on("style.load", () => {
        if (map.getLayer(poiLayerId)) {
          map.setLayoutProperty(poiLayerId, "visibility", "none");
        }
      });
    }
  }, [mapRef.current]);

  const handleMapRender = (map) => {
    mapRef.current = map;
    setMapIsReady(true);
  };

  const handleMapStyleSelected = (name) => {
    setMapStyleName(name);
  };

  return (
    <ReactMap
      apiKey={apiKey}
      mapStyle={computedMapStyle}
      containerStyle={{ width: "100%", height: "100%" }}
      fitBoundsOptions={fitBoundsOptions}
      movingMethod="jumpTo"
      center={center}
      zoom={zoom}
      bounds={bounds}
      onRender={handleMapRender}
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
      {children}
    </ReactMap>
  );
};

export default Map;
