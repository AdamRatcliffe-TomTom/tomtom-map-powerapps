import React from "react";
import styled from "styled-components";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import "prismjs/components/prism-json";
import "prismjs/themes/prism.css";

const Container = styled.div`
  height: 100%;
  overflow: auto;
  background-color: rgb(245, 245, 245);
  padding-left: 8px;
`;

const StyledPre = styled.pre`
  margin: 0;
  font-family: "Fira Code", "Fira Mono", monospace;
`;

const CodeLine = styled.div`
  display: flex;
  line-height: 1.5;
  white-space: pre;
`;

const LineNumber = styled.span`
  width: 3em;
  text-align: right;
  padding-right: 1.5em;
  user-select: none;
  color: #999;
  font-size: 12px;
  flex-shrink: 0;
`;

const CodeViewer = ({ value, language = "json", style = {} }) => {
  const highlightWithLineNumbers = (code) => {
    const grammar = Prism.languages[language] || Prism.languages.json;
    const lines = code.split("\n");

    return (
      <StyledPre>
        {lines.map((line, i) => {
          const html = Prism.highlight(line, grammar, language);
          return (
            <CodeLine key={i}>
              <LineNumber>{i + 1}</LineNumber>
              <span
                dangerouslySetInnerHTML={{ __html: html }}
                style={{ flex: 1 }}
              />
            </CodeLine>
          );
        })}
      </StyledPre>
    );
  };

  return (
    <Container style={style}>
      <Editor
        value={value}
        onValueChange={() => {}}
        highlight={highlightWithLineNumbers}
        padding={10}
        readOnly
        className="code_editor__editor"
        textareaClassName="code_editor__textarea"
      />
    </Container>
  );
};

export default CodeViewer;
