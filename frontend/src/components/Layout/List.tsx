import styled from "@emotion/styled";
import React, { ReactNode } from "react";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background: rgb(247, 249, 249);
  border-radius: 14px;
  width: 350px;
`;

const Item = styled.div`
  padding: 10px 16px;

  & + div {
    border-top: 1px solid rgb(239, 243, 244);
  }

  &:first-child {
    padding-top: 12px;
  }

  &:last-child {
    padding-bottom: 16px;
  }
`;

const Title = styled.span`
  font-weight: 600;
  font-size: 20px;
  line-height: 24px;
`;

interface Props {
  title: string;
  elements: ReactNode[];
}
export default function List({ title, elements }: Props) {
  return (
    <Container>
      <Item>
        <Title>{title}</Title>
      </Item>
      {elements.map((element, index) => (
        <Item key={index}>{element}</Item>
      ))}
    </Container>
  );
}
