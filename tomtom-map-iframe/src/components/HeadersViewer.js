import React from "react";
import styled from "styled-components";
import {
  Table,
  TableHeader,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell
} from "@fluentui/react-components";

const ScrollContainer = styled.div`
  overflow: auto;
  height: 100%;
  padding: 12px;
  background-color: #fafafa;
  border-radius: 4px;
`;

const BoldHeaderCell = styled(TableHeaderCell)`
  font-weight: 600;
`;

const HeadersViewer = ({ headers }) => {
  return (
    <ScrollContainer>
      <Table>
        <TableHeader>
          <TableRow>
            <BoldHeaderCell>Name</BoldHeaderCell>
            <BoldHeaderCell>Value</BoldHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.entries(headers).map(([key, value]) => (
            <TableRow key={key}>
              <TableCell>{key}</TableCell>
              <TableCell>{value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollContainer>
  );
};

export default HeadersViewer;
