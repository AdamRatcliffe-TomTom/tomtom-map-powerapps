import React, { useEffect } from "react";
import { GeoJSONLayer, withMap } from "react-tomtom-maps";
import DefaultColorPalette from "../DefaultColorPalette";

const lineLayout = {
  "line-join": "round",
  "line-cap": "round"
};

const casingPaint = {
  "line-width": {
    stops: [
      [12, 8],
      [14, 9],
      [16, 10],
      [18, 11],
      [20, 13]
    ]
  },
  "line-opacity": 1
};

const linePaint = {
  "line-width": {
    stops: [
      [12, 5],
      [14, 6],
      [16, 7],
      [18, 8],
      [20, 10]
    ]
  },
  "line-opacity": 1
};

const Route = React.memo(
  ({ map, data, selected = null, onSelect = () => {}, ...otherProps }) => {
    const features = data?.features ?? [];

    const selectedFeatureId = selected ?? features[0]?.id ?? null;

    useEffect(() => {
      if (selected == null && selectedFeatureId) {
        onSelect(selectedFeatureId);
      }
    }, [selected, selectedFeatureId, onSelect]);

    if (!features.length) return null;

    const handleClick = (featureId) => (e) => {
      e.preventDefault();
      onSelect(featureId);
    };

    const handleMouseEnter = () => {
      map.getCanvas().style.cursor = "pointer";
    };

    const handleMouseLeave = () => {
      map.getCanvas().style.cursor = "";
    };

    const nonSelectedFeatures = data.features.filter(
      (feature) => feature.id !== selectedFeatureId
    );

    const selectedFeature = data.features.find(
      (feature) => feature.id === selectedFeatureId
    );

    const renderFeatureLayers = (feature, isSelected = false) => (
      <React.Fragment key={`route-feature-${feature.id}`}>
        <GeoJSONLayer
          id={`route-casing-${feature.id}`}
          data={feature}
          type="line"
          lineLayout={lineLayout}
          linePaint={{
            ...casingPaint,
            "line-color": isSelected
              ? DefaultColorPalette.tt_primary_color_600
              : DefaultColorPalette.tt_primary_color_500
          }}
          lineOnClick={handleClick(feature.id)}
          lineOnMouseEnter={handleMouseEnter}
          lineOnMouseLeave={handleMouseLeave}
          {...otherProps}
        />
        <GeoJSONLayer
          id={`route-line-${feature.id}`}
          data={feature}
          type="line"
          lineLayout={lineLayout}
          linePaint={{
            ...linePaint,
            "line-color": isSelected
              ? DefaultColorPalette.tt_primary_color_500
              : DefaultColorPalette.tt_primary_color_400
          }}
          lineOnClick={handleClick(feature.id)}
          lineOnMouseEnter={handleMouseEnter}
          lineOnMouseLeave={handleMouseLeave}
          {...otherProps}
        />
      </React.Fragment>
    );

    return (
      <>
        {nonSelectedFeatures.map((feature, index) =>
          renderFeatureLayers(feature, false)
        )}
        {selectedFeature && renderFeatureLayers(selectedFeature, true)}
      </>
    );
  }
);

export default withMap(Route);
