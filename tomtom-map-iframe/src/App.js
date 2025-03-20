import React, { useEffect, useState } from "react";
import Map from "./components/Map";
import Spinner from "./components/Spinner";
import Message from "./components/Message";
import { fetchRequestData } from "./helpers/fetchRequestData";
import calculateRouteResponseToGeoJson from "./helpers/calculateRouteResponseToGeoJson";
import parseRouteUrlToGeoJson from "./helpers/parseRouteUrlToGeoJson";

function App() {
  const [config, setConfig] = useState(null);
  const [routeGeoJson, setRouteGeoJson] = useState(null);
  const [locationsGeoJson, setLocationsGeoJson] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.addEventListener("message", (e) => {
      if (e.data && e.data.apiKey) {
        const parsedLat = Number(e.data.center?.[0]);
        const parsedLng = Number(e.data.center?.[1]);

        const cleanedConfig = {
          ...e.data,
          center: [
            isNaN(parsedLat) ? 0 : parsedLat,
            isNaN(parsedLng) ? 0 : parsedLng
          ],
          method: e.data.method ? e.data.method.toUpperCase() : "GET"
        };

        setConfig(cleanedConfig);
      }
    });
  }, []);

  useEffect(() => {
    if (!config?.url) return;

    const runRequest = async () => {
      try {
        const data = await fetchRequestData(config);
        const routeGeoJson = calculateRouteResponseToGeoJson(data);
        setRouteGeoJson(routeGeoJson);

        const locationsGeoJson = parseRouteUrlToGeoJson(config.url);
        setLocationsGeoJson(locationsGeoJson);
      } catch (err) {
        console.error("Request error:", err);
        setError(err.message || "Request failed");
      }
    };

    runRequest();
  }, [config]);

  if (!config) return <Spinner />;

  if (error) return <Message variant="error">Error: {error}</Message>;

  return (
    <Map
      {...config}
      width={window.innerWidth}
      height={window.innerHeight}
      routeGeoJson={routeGeoJson}
      locationsGeoJson={locationsGeoJson}
    />
  );
}

export default App;
