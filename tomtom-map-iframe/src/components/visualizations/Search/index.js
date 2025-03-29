import React, { useMemo } from "react";
import Map from "components/Map";
import { GeoJSONLayer } from "react-tomtom-maps";
import convertToGeoJson from "./helpers/convertToGeoJson";
import geoJsonBounds from "helpers/geoJsonBounds";
import { getPoiLayerStyle } from "./helpers/getPoiLayerStyle";

const SearchVisualization = ({ config, responseData }) => {
  const geoJson = useMemo(
    () => convertToGeoJson(responseData, config?.map),
    [responseData, config]
  );

  const bounds = useMemo(() => geoJsonBounds(geoJson), [geoJson]);
  const poiStyle = useMemo(() => getPoiLayerStyle(config?.map), [config]);

  console.log("geoJson: ", geoJson);

  return (
    <Map {...config} bounds={bounds}>
      {poiStyle && (
        <GeoJSONLayer
          id="search-pois"
          data={geoJson}
          type="symbol"
          symbolLayout={poiStyle.layout}
          symbolPaint={poiStyle.paint}
        />
      )}
    </Map>
  );
};

export default SearchVisualization;
