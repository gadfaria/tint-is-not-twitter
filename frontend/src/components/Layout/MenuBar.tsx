/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { useAtom } from "jotai";
import { useRouter } from "next/dist/client/router";
import React, { useState } from "react";
import HomeIcon from "../../assets/home";
import { TintLogo } from "../../assets/logo";
import PerfilIcon from "../../assets/perfil";
import { userAtom } from "../../atom/UserAtom";
import Modal from "../Modal";
import PostModal from "../Post/PostModal";
import StyledButton from "../StyledButton";

export const Container = styled.div`
  display: flex;
  align-items: flex-end;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  justify-content: space-between;
  padding: 0px 32px;
`;

const Menu = styled.nav`
  width: 226px;
`;

const IsActive = css`
  color: #1da1f2;

  svg {
    g {
      path {
        fill: #1da1f2;
      }
    }
  }
`;

const MenuButton = styled.div<{ isActive?: boolean }>`
  cursor: pointer;
  display: flex;
  margin: 10px 0px;
  align-items: center;
  padding: 12px 16px;
  border-radius: 50px;
  width: fit-content;
  transition: background-color 0.2s, color 0.2s;

  ${(props) =>
    props.isActive &&
    css`
      ${IsActive}
    `}

  svg {
    g {
      path {
        transition: fill 0.2s;
      }
    }
  }
  :hover {
    background-color: #1a91da10;
    ${IsActive}
  }
`;

const MenuText = styled.div`
  font-size: 20px;
  font-weight: 600;
  line-height: 24px;
  margin: 0px 13px;
`;

const ButtonSize = css`
  width: 226px;
  height: 48px;
`;

export default function MenuBar() {
  const router = useRouter();
  const [user] = useAtom(userAtom);
  const [showModal, setShowModal] = useState(false);

  if (!user) return <></>;
  return (
    <Container>
      <Modal
        showModal={showModal}
        closeModal={() => setShowModal(false)}
        customCss={css`
          width: 600px;
          max-height: 420px;
        `}
      >
        <PostModal closeModal={() => setShowModal(false)}/>
      </Modal>
      <Menu>
        <MenuButton>
          <TintLogo height="40px" width="40px" />
        </MenuButton>

        <MenuButton
          isActive={router.asPath === "/home"}
          onClick={() => router.push("/home")}
        >
          <HomeIcon
            height="30"
            width="30"
            isActive={router.asPath === "/home"}
          />
          <MenuText>Página Inicial</MenuText>
        </MenuButton>

        <MenuButton
          isActive={router.asPath === "/tt"}
          onClick={() => router.push("/tt")}
        >
          <PerfilIcon
            height="30"
            width="30"
            isActive={router.asPath === "/tt"}
          />
          <MenuText>Perfil</MenuText>
        </MenuButton>

        <StyledButton customCss={ButtonSize} onClick={() => setShowModal(true)}>
          Tweetar
        </StyledButton>
      </Menu>
    </Container>
  );
}
