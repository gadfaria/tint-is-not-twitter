import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { useRouter } from "next/dist/client/router";
import React from "react";
import HomeIcon from "../../assets/home";
import { TintLogo } from "../../assets/logo";
import PerfilIcon from "../../assets/perfil";
import StyledButton from "../StyledButton";

export const Container = styled.div`
  display: flex;
  align-items: flex-end;
  flex-direction: column;
  width: 100%;
  min-height: 100%;
  justify-content: space-between;
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
  transition: background-color 0.3s, color 0.3s;

  ${(props) =>
    props.isActive &&
    css`
      ${IsActive}
    `}

  svg {
    g {
      path {
        transition: fill 0.3s;
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

const ButtonCss = css`
  width: 226px;
  height: 48px;
`;

const ProfileDiv = styled.div`
  display: flex;
  align-items: center;
  transition: background-color 0.3s, color 0.3s;
  cursor: pointer;
  width: fit-content;
  margin: 10px;
  padding: 12px;
  border-radius: 50px;

  :hover {
    background-color: #1a91da10;
    ${IsActive}
  }
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  border-radius: 50%;
  background: url("https://avatars.githubusercontent.com/u/69378560?s=460&u=831bbebb1c4c52f9b9b28469b54acca7ed89c69b&v=4");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
`;

const Profile = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 12px;
`;

export default function MenuBar() {
  const router = useRouter();

  return (
    <Container>
      <Menu>
        <MenuButton>
          <TintLogo height="40px" width="40px" />
        </MenuButton>

        <MenuButton isActive={router.asPath === "/home"}>
          <HomeIcon height="30" width="30" />
          <MenuText>Página Inicial</MenuText>
        </MenuButton>

        <MenuButton>
          <PerfilIcon height="30" width="30" />
          <MenuText>Perfil</MenuText>
        </MenuButton>

        <StyledButton customCss={ButtonCss}>Tweetar</StyledButton>
      </Menu>

      <ProfileDiv>
        <Avatar />
        <Profile>
          <strong>Mateus de Souza</strong>
          <span>@mateussp97</span>
        </Profile>
      </ProfileDiv>
    </Container>
  );
}
