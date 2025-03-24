import React, { useMemo } from "react";
import Map from "components/Map";
import geoJsonBounds from "helpers/geoJsonBounds";
import convertToGeoJson from "./helpers/convertToGeoJson";
import { GeoJSONLayer } from "react-tomtom-maps";

const ReachableRangeVisualization = ({ config, responseData }) => {
  const reachableRangeGeoJson = useMemo(
    () => convertToGeoJson(responseData),
    [responseData]
  );

  const bounds = useMemo(() => {
    if (!reachableRangeGeoJson) return undefined;
    return geoJsonBounds(reachableRangeGeoJson);
  }, [reachableRangeGeoJson]);

  if (!reachableRangeGeoJson) return null;

  return (
    <Map {...config} bounds={bounds}>
      <GeoJSONLayer
        id="reachable-range-fill"
        data={reachableRangeGeoJson}
        type="fill"
        fillPaint={{
          "fill-color": "rgba(0, 120, 220, 0.3)",
          "fill-outline-color": "rgba(0, 120, 220, 0.8)"
        }}
      />
    </Map>
  );
};

export default ReachableRangeVisualization;
