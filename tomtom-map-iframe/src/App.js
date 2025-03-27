import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { TabList, Tab } from "@fluentui/react-components";
import Spinner from "components/Spinner";
import Message from "components/Message";
import CodeViewer from "components/CodeViewer";
import visualizationMap from "components/visualizations/visualizationMap";
import fetchRequestData from "helpers/fetchRequestData";
import inferRequestType from "helpers/inferRequestType";

const RootContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const ContentArea = styled.div`
  flex: 1;
  overflow: hidden;
`;

function App() {
  const [config, setConfig] = useState(null);
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState("map");

  useEffect(() => {
    const handleMessage = (e) => {
      const message = e.data;
      if (message?.type === "pcfMapConfig") {
        if (!message.payload?.apiKey) {
          setError("Missing API key in configuration message");
        } else {
          setConfig(message.payload);
        }
      }
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

  const requestType = config?.url ? inferRequestType(config.url) : null;
  const VisualizationComponent = requestType
    ? visualizationMap[requestType]
    : null;
  const hasVisualization = Boolean(VisualizationComponent);

  useEffect(() => {
    if (config && !hasVisualization) {
      setSelectedTab("response");
    }
  }, [hasVisualization, config]);

  const onTabSelect = (_e, data) => {
    setSelectedTab(data.value.toString());
  };

  if (error) return <Message variant="error">{error}</Message>;
  if (!config) return <Spinner />;

  return (
    <RootContainer>
      <TabList
        selectedValue={selectedTab}
        onTabSelect={onTabSelect}
        style={{ marginBottom: 5 }}
      >
        {hasVisualization && (
          <Tab className="no-focus-ring" value="map">
            Map
          </Tab>
        )}
        <Tab className="no-focus-ring" value="response">
          Response
        </Tab>
      </TabList>

      <ContentArea>
        {selectedTab === "map" && hasVisualization && config && (
          <VisualizationComponent config={config} responseData={responseData} />
        )}
        {selectedTab === "response" && responseData && (
          <CodeViewer value={JSON.stringify(responseData, null, 2)} />
        )}
      </ContentArea>
    </RootContainer>
  );
}

export default App;
