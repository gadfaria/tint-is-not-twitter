/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { useRouter } from "next/dist/client/router";
import { useState } from "react";
import { TintLogo } from "../assets/logo";
import Modal from "../components/Modal";
import SeoHead from "../components/SeoHead";
import StyledButton from "../components/StyledButton";
import CreateUserModal from "../components/FirstPage/CreateUserModal";

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: grid;
  grid-template-columns: 1fr 870px;
`;

const LeftColumn = styled.div`
  background-image: url("https://abs.twimg.com/sticky/illustrations/lohp_1302x955.png");
  max-width: 1041px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const RighColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0px 36px;
`;

const Title = styled.div`
  color: #0f1419;
  font-size: 64px;
  font-weight: 700;
  letter-spacing: -1.2px;
  line-height: 84px;
  margin: 52px 0px;
`;

const SubTitle = styled.div`
  color: #0f1419;
  font-size: 31px;
  font-weight: 700;
  line-height: 36px;
`;

const ButtonSize = css`
  width: 380px;
  height: 48px;
`;

export default function FirstPage() {
  const router = useRouter();
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);

  return (
    <>
      <SeoHead pageName="Tint is not twitter" />
      <Container>
        <LeftColumn>
          <TintLogo color="#ffffff" width="500px" height="500px" />
        </LeftColumn>
        <RighColumn>
          <TintLogo width="60px" height="60px" />
          <Title>Acontecendo agora</Title>
          <SubTitle>Inscreva-se no Tint hoje mesmo</SubTitle>
          <StyledButton
            customCss={css`
              ${ButtonSize};
              margin: 33px 0px 22px 0px;
            `}
            onClick={() => setShowCreateUserModal(true)}
          >
            Inscreva-se
          </StyledButton>
          <StyledButton
            customCss={ButtonSize}
            inverted
            onClick={() => router.push("/login")}
          >
            Entrar
          </StyledButton>
        </RighColumn>
      </Container>
      <Modal
        showModal={showCreateUserModal}
        closeModal={() => setShowCreateUserModal(false)}
        customCss={css`
          width: 600px;
          height: 550px;
        `}
      >
        <CreateUserModal />
      </Modal>
    </>
  );
}
