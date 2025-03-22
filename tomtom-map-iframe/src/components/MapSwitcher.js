import React, { useState, useEffect } from "react";
import styled from "styled-components";
import _capitalize from "lodash.capitalize";
import { tombac, Text, propStyling } from "tombac";
import Map, { withMap } from "react-tomtom-maps";
import DefaultColorPalette from "../DefaultColorPalette";
import MapStyles from "../constants/MapStyles";

const MapSwitcher = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: ${tombac.unit(80)};
  height: ${tombac.unit(76)};
  padding: ${tombac.space(0.5, 0.5, 0)};
  border-radius: ${tombac.unit(6)};
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  background: ${DefaultColorPalette.tt_color_surface_light};
  cursor: pointer;
  user-select: none;
  ${propStyling}

  .mapboxgl-map {
    border-radius: ${tombac.space(0.5)};
  }

  .mapboxgl-ctrl-attrib {
    display: none;
  }

  ${Text} {
    ${tombac.text({
      fontFamily: "inherit",
      fontSize: 12,
      fontWeight: 500,
      color: DefaultColorPalette.tt_color_title_light,
      lineHeight: 1
    })}
    margin: auto 0;
    user-select: none;
  }
`;

const MapSwitcherControl = ({
  map,
  apiKey,
  selected = "street",
  onSelected = () => {},
  ...otherProps
}) => {
  const [styleName, setStyleName] = useState(
    selected === "street" ? "satellite" : "street"
  );
  const [mapStyle, setMapStyle] = useState(MapStyles[styleName]);
  const [bounds, setBounds] = useState(map?.getBounds().toArray());

  useEffect(() => {
    const handleMapViewChange = () => {
      setBounds(map?.getBounds().toArray());
    };

    map && map.on("moveend", handleMapViewChange);
    return () => map && map.off("moveend", handleMapViewChange);
  }, [map]);

  useEffect(() => {
    const styleName = selected === "street" ? "satellite" : "street";
    const mapStyle = MapStyles[styleName];
    setStyleName(styleName);
    setMapStyle(mapStyle);
  }, [selected]);

  const handleStyleData = (map) => {
    map.__om.style.stylesheet.layers.forEach((layer) => {
      if (
        layer.type === "symbol" ||
        (styleName === "satellite" && layer.type === "line")
      ) {
        map.getLayer(layer.id) && map.removeLayer(layer.id);
      }
    });
  };

  const handleClick = () => {
    const newSelected = selected === "street" ? "satellite" : "street";
    onSelected(newSelected);
  };

  return (
    <MapSwitcher className="MapSwitcher" onClick={handleClick} {...otherProps}>
      <Map
        apiKey={apiKey}
        mapStyle={mapStyle}
        containerStyle={{ width: "72px", height: "46px" }}
        mapOptions={{
          interactive: false
        }}
        movingMethod="jumpTo"
        fitBoundsOptions={{
          animate: false
        }}
        bounds={bounds}
        onStyleData={handleStyleData}
      ></Map>
      <Text>{_capitalize(styleName)}</Text>
    </MapSwitcher>
  );
};

export default withMap(MapSwitcherControl);
