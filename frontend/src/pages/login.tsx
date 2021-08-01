/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { useAtom } from "jotai";
import { useRouter } from "next/dist/client/router";
import { useState } from "react";
import { LoginApi } from "../apis/LoginAPI";
import { TintLogo } from "../assets/logo";
import { userAtom } from "../atom/UserAtom";
import SeoHead from "../components/SeoHead";
import StyledButton from "../components/StyledButton";
import StyledInput from "../components/StyledInput";
import { localStorageSetItem } from "../utils/localStorage";

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  padding: 25px 0px;
`;

const Title = styled.div`
  width: 297px;
  height: 37px;
  font-size: 31px;
  font-weight: 700;
  line-height: 36px;
  color: #0f1419;
  margin: 25px 0px 20px 0px;
`;

const ButtonSize = css`
  width: 334px;
  height: 46px;
`;

const InputSize = css`
  width: 334px;
  height: 56px;
`;

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [, setUser] = useAtom(userAtom);
  const router = useRouter();

  async function handleClick() {
    const user = await LoginApi({ username, password });
    if (!user) return;
    setUser(user);
    localStorageSetItem("ACCESS_TOKEN", user.accessToken);
    router.push("/home");
  }
  return (
    <>
      <SeoHead pageName="Login" />
      <Container>
        <div>
          <TintLogo width="50px" height="50px" />
          <Title>Entrar no Tint</Title>
          <StyledInput
            customCss={InputSize}
            placeholder="Celular, e-mail ou nome de usuário"
            value={username}
            onChange={(vle) => setUsername(vle.target.value)}
          />
          <StyledInput
            customCss={css`
              ${InputSize};
              margin: 20px 0px;
            `}
            placeholder="Senha"
            value={password}
            onChange={(vle) => setPassword(vle.target.value)}
            type="password"
          />

          <StyledButton
            customCss={ButtonSize}
            disabled={username === "" || password === ""}
            onClick={handleClick}
          >
            Entrar
          </StyledButton>
        </div>
      </Container>
    </>
  );
}
