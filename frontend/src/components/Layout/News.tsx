import styled from "@emotion/styled";
import React from "react";

const Container = styled.a`
  display: flex;
  flex-direction: column;
  font-size: 15px;
  line-height: 20px;
  cursor: pointer;

  :hover {
    opacity: 0.5;
  }
`;

const Heading = styled.div`
  margin-bottom: 4px;
  font-size: 13px;
  line-height: 16px;
  color: #536471;
`;

interface Props {
  heading: string;
  title: string;
  url: string;
}

export default function News({ heading, title, url }: Props) {
  return (
    <Container href={url} target="_blank">
      <Heading>{heading}</Heading>
      <strong>{title}</strong>
    </Container>
  );
}
