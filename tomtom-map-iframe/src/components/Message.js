import React from "react";
import styled from "styled-components";

const MessageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-family: sans-serif;
`;

const MessageBox = styled.div`
  padding: 2rem 3rem;
  background-color: ${({ variant }) =>
    variant === "error" ? "#ffecec" : "#ffffff"};
  border: 1px solid
    ${({ variant }) => (variant === "error" ? "#f5c2c2" : "#e0e0e0")};
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  font-size: 1.2rem;
  text-align: center;
  color: ${({ variant }) => (variant === "error" ? "#b00020" : "#333")};
`;

const Message = ({ children, variant = "info" }) => {
  return (
    <MessageWrapper variant={variant}>
      <MessageBox variant={variant}>{children}</MessageBox>
    </MessageWrapper>
  );
};

export default Message;
