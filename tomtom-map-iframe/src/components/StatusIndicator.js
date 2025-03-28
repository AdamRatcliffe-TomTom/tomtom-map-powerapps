import React from "react";
import styled from "styled-components";

const StatusBadge = styled.span`
  display: inline-block;
  font-family: "Segoe UI";
  font-size: 12px;
  font-weight: 500;
  border-radius: 4px;
  padding: 0 6px;
  background-color: ${({ status }) => {
    if (status >= 200 && status < 300) return "#dff6dd"; // green background
    if (status >= 400 && status < 500) return "#fde7e9"; // red background
    if (status >= 500) return "#f3f2f1"; // grey background
    return "#f3f2f1";
  }};
  color: ${({ status }) => {
    if (status >= 200 && status < 300) return "#107c10"; // green text
    if (status >= 400 && status < 500) return "#a4262c"; // red text
    if (status >= 500) return "#605e5c"; // dark grey text
    return "#605e5c";
  }};
`;

const StatusIndicator = ({ status, statusText, style }) => {
  if (!status) return null;

  return (
    <StatusBadge status={status} {...style}>
      {status} {statusText}
    </StatusBadge>
  );
};

export default StatusIndicator;
