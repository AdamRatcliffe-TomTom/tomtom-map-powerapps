import React, { useMemo } from "react";
import styled from "styled-components";
import { GeoJSONLayer, Marker } from "react-tomtom-maps";
import markerIcons from "components/markerIcons";
import Map from "components/Map";
import geoJsonBounds from "helpers/geoJsonBounds";
import convertToGeoJson from "./helpers/convertToGeoJson";
import parseOriginFromUrl from "./helpers/parseOriginFromUrl";

const OriginIcon = styled.div`
  width: 32px;
  height: 40px;
  background-image: url(${markerIcons.origin});
  background-repeat: no-repeat;
  background-size: contain;
`;

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

  const originCoordinates = parseOriginFromUrl(config.url);

  return (
    <Map {...config} bounds={bounds}>
      <GeoJSONLayer
        id="reachable-range-fill"
        data={reachableRangeGeoJson}
        type="fill"
        fillPaint={{
          "fill-color": "rgba(0, 120, 220, 0.2)"
        }}
        linePaint={{
          "line-color": "rgba(0, 120, 220, 0.8)",
          "line-width": 1,
          "line-dasharray": [2, 2]
        }}
      />
      <Marker coordinates={originCoordinates}>
        <OriginIcon />
      </Marker>
    </Map>
  );
};

export default ReachableRangeVisualization;
