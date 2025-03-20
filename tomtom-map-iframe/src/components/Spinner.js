import React from "react";
import styled, { keyframes } from "styled-components";

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const SpinnerWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const SpinnerCircle = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid #ccc;
  border-top-color: #0078d4;
  border-radius: 50%;
  transform-origin: center;
  animation: ${spin} 1s linear infinite;
`;

const Spinner = () => (
  <SpinnerWrapper className="Spinner">
    <SpinnerCircle />
  </SpinnerWrapper>
);

export default Spinner;
