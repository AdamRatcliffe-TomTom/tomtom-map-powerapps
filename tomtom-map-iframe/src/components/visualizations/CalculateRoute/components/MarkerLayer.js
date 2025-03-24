import React from "react";
import styled from "styled-components";
import { Marker } from "react-tomtom-maps";
import icons from "components/markerIcons";

const Icon = styled.div`
  width: 32px;
  height: 40px;
  background-image: url(${({ type }) => icons[type]});
  background-repeat: no-repeat;
  background-size: contain;
`;

const MarkerLayer = ({ data }) =>
  data?.features.map(
    ({ geometry: { coordinates }, properties: { type } }, index) => (
      <Marker key={index} coordinates={coordinates}>
        <Icon type={type} />
      </Marker>
    )
  );

export default MarkerLayer;
