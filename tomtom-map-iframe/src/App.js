import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { TabList, Tab } from "@fluentui/react-components";
import Spinner from "components/Spinner";
import Message from "components/Message";
import StatusIndicator from "components/StatusIndicator";
import CodeViewer from "components/CodeViewer";
import HeadersViewer from "components/HeadersViewer";
import visualizationMap from "components/visualizations/visualizationMap";
import fetchRequestData from "helpers/fetchRequestData";
import inferRequestType from "helpers/inferRequestType";

// Layout
const RootContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const ContentArea = styled.div`
  flex: 1;
  overflow: hidden;
`;

// Tab row layout
const TabRow = styled(TabList)`
  margin-bottom: 5px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

// Tab group (holds the Tab buttons)
const TabGroup = styled.div`
  display: flex;
  flex: 0 1 auto;
`;

function App() {
  const [config, setConfig] = useState(null);
  const [response, setResponse] = useState(null);
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
    setResponse(null);

    const runRequest = async () => {
      try {
        const res = await fetchRequestData(config);
        setResponse(res);
      } catch (err) {
        setResponse(err.response);
        setSelectedTab("body");
      }
    };

    runRequest();
  }, [config]);

  const isSuccess = response?.status >= 200 && response?.status < 300;
  const requestType =
    isSuccess && config?.url ? inferRequestType(config.url) : null;
  const VisualizationComponent = requestType
    ? visualizationMap[requestType]
    : null;
  const hasVisualization = Boolean(VisualizationComponent);

  useEffect(() => {
    if (!response) return;

    const isError = response.status >= 400;

    if (!hasVisualization || isError) {
      setSelectedTab("body");
    } else {
      setSelectedTab("map");
    }
  }, [response, hasVisualization]);

  const onTabSelect = (_e, data) => {
    setSelectedTab(data.value.toString());
  };

  if (error) return <Message variant="error">{error}</Message>;
  if (!config) return <Spinner />;

  return (
    <RootContainer>
      <TabRow selectedValue={selectedTab} onTabSelect={onTabSelect}>
        <TabGroup>
          {hasVisualization && (
            <Tab className="no-focus-ring" value="map">
              Map
            </Tab>
          )}
          <Tab className="no-focus-ring" value="body">
            Body
          </Tab>
          <Tab className="no-focus-ring" value="headers">
            Headers
          </Tab>
        </TabGroup>
        <StatusIndicator
          status={response?.status}
          statusText={response?.statusText}
        />
      </TabRow>

      <ContentArea>
        {selectedTab === "map" && hasVisualization && config && (
          <VisualizationComponent
            config={config}
            responseData={response?.data}
          />
        )}
        {selectedTab === "body" && response?.data && (
          <CodeViewer value={JSON.stringify(response.data, null, 2)} />
        )}
        {selectedTab === "headers" && response?.headers && (
          <HeadersViewer headers={response.headers} />
        )}
      </ContentArea>
    </RootContainer>
  );
}

export default App;
