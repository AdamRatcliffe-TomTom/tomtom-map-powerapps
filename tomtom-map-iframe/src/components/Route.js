import React from "react";
import { GeoJSONLayer } from "react-tomtom-maps";

const lineLayout = {
  "line-join": "round",
  "line-cap": "round"
};

const Route = React.memo(({ data, ...otherProps }) => (
  <>
    <GeoJSONLayer
      data={data}
      {...otherProps}
      lineLayout={lineLayout}
      linePaint={{
        "line-width": {
          stops: [
            [8, 6],
            [10, 7],
            [12, 8],
            [14, 9],
            [16, 10],
            [18, 12],
            [20, 14]
          ]
        },
        "line-color": "rgb(5, 104, 168)"
      }}
    />
    <GeoJSONLayer
      data={data}
      {...otherProps}
      lineLayout={lineLayout}
      linePaint={{
        "line-width": {
          stops: [
            [8, 3],
            [10, 4],
            [12, 5],
            [14, 6],
            [16, 7],
            [18, 9],
            [20, 11]
          ]
        },
        "line-color": "rgb(59, 174, 227)"
      }}
    />
  </>
));

export default Route;
