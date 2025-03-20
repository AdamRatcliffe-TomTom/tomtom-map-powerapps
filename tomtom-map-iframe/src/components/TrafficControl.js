import React, { useEffect, useState } from "react";
import styled from "styled-components";
import _capitalize from "lodash.capitalize";
import { tombac, Text, propStyling } from "tombac";
import { withMap } from "react-tomtom-maps";
import DefaultColorPalette from "../DefaultColorPalette";

import trafficMapImage from "../images/map-traffic.svg";
import noTrafficMapImage from "../images/map-no-traffic.svg";

const StyledTrafficControl = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: ${tombac.unit(80)};
  height: ${tombac.unit(80)};
  padding: ${tombac.space(0.5, 0.5, 0)};
  border-radius: ${tombac.unit(6)};
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  background: ${DefaultColorPalette.tt_color_surface_light};
  cursor: pointer;
  user-select: none;
  ${propStyling}

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

const TrafficControl = ({ map, defaultShowTraffic = false, ...otherProps }) => {
  const [showTraffic, setShowTraffic] = useState(defaultShowTraffic);

  useEffect(() => {
    if (defaultShowTraffic) {
      map.showTrafficFlow();
      map.showTrafficIncidents();
    }
  }, []);

  const handleClick = () => {
    const value = !showTraffic;
    if (value) {
      map.showTrafficFlow();
      map.showTrafficIncidents();
    } else {
      map.hideTrafficFlow();
      map.hideTrafficIncidents();
    }
    setShowTraffic(value);
  };

  return (
    <StyledTrafficControl
      className="TrafficControl"
      onClick={handleClick}
      {...otherProps}
    >
      <img src={showTraffic ? noTrafficMapImage : trafficMapImage} />
      <Text>{showTraffic ? "Hide traffic" : "Show traffic"}</Text>
    </StyledTrafficControl>
  );
};

export default withMap(TrafficControl);
