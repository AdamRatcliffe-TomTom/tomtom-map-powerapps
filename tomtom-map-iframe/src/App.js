import React, { useEffect, useState } from "react";
import Spinner from "components/Spinner";
import Message from "components/Message";
import visualizationMap from "components/visualizations/visualizationMap";
import fetchRequestData from "helpers/fetchRequestData";
import inferRequestType from "helpers/inferRequestType";

function App() {
  const [config, setConfig] = useState(null);
  const [responseData, setResponseData] = useState(null);
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

    setError(null);
    setResponseData(null);

    const runRequest = async () => {
      try {
        const data = await fetchRequestData(config);
        setResponseData(data);
      } catch (err) {
        console.error("Request error:", err);
        setError(err.message || "Request failed");
      }
    };

    runRequest();
  }, [config]);

  if (error) return <Message variant="error">{error}</Message>;
  if (!config) return <Spinner />;

  const requestType = inferRequestType(config.url);

  const VisualizationComponent = visualizationMap[requestType];

  if (!VisualizationComponent) {
    return (
      <Message variant="error">
        No visualization available for request type: {requestType}
      </Message>
    );
  }

  return <VisualizationComponent config={config} responseData={responseData} />;
}

export default App;
