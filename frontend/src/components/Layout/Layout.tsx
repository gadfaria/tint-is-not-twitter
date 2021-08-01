/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import React, { PropsWithChildren, useState } from "react";
import SideBar from "./SideBar";
import MenuBar from "./MenuBar";

const Container = styled.div`
  display: grid;
  grid-template-columns: 0.7fr 600px 1fr;
  height: 100vh;
`;

interface Props {}

export default function Layout(props: PropsWithChildren<Props>) {
  const { children } = props;
  return (
    <Container>
      <MenuBar />
      {children}
      <SideBar />
    </Container>
  );
}
