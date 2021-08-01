/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { useAtom } from "jotai";
import { useRouter } from "next/dist/client/router";
import React, { useState } from "react";
import { UserApi } from "../../apis/UserAPI";
import { userAtom } from "../../atom/UserAtom";
import { localStorageSetItem } from "../../utils/localStorage";
import StyledButton from "../StyledButton";
import StyledInput from "../StyledInput";

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 30px 30px;
`;

const Title = styled.div`
  color: #0f1419;
  font-size: 23px;
  font-weight: 700;
  line-height: 28px;
  text-align: left;
  margin-bottom: 30px;
`;

const InputSize = css`
  width: 100%;
`;

const ButtonSize = css`
  height: 48px;
`;

export default function CreateUserModal(props: any) {
  const [, setUser] = useAtom(userAtom);
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const router = useRouter();

  async function handleClick() {
    const newUser = await UserApi.create({ name, password, username });
    if (!newUser) return;
    setUser(newUser);
    localStorageSetItem("ACCESS_TOKEN", newUser.accessToken);
    router.push("/home");
  }

  return (
    <Container>
      <Title>Criar sua conta</Title>
      <StyledInput
        customCss={InputSize}
        placeholder="Nome"
        value={name}
        onChange={(vle) => setName(vle.target.value)}
      />
      <StyledInput
        customCss={css`
          margin: 28px 0px;
          ${InputSize}
        `}
        placeholder="Username"
        value={username}
        onChange={(vle) => setUsername(vle.target.value)}
      />
      <StyledInput
        customCss={css`
          margin-bottom: 28px;
          ${InputSize};
        `}
        placeholder="Senha"
        value={password}
        onChange={(vle) => setPassword(vle.target.value)}
        type="password"
      />

      <StyledButton
        customCss={ButtonSize}
        onClick={handleClick}
        isLoading={isLoading}
      >
        Inscrever-se
      </StyledButton>
    </Container>
  );
}
