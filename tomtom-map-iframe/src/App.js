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
    const handleMessage = (e) => {
      const message = e.data;

      if (!message || message.type !== "pcfMapConfig") return;

      const payload = message.payload;
      if (!payload.apiKey) {
        setError("Missing API key in configuration message");
        return;
      }

      setConfig(payload);
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
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

  if (error) return <Message variant="error">{error}</Message>;
  if (!config) return <Spinner />;

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
