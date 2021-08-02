/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { useAtom } from "jotai";
import { useRouter } from "next/dist/client/router";
import React, { useRef, useState } from "react";
import { UserApi } from "../../apis/UserAPI";
import { toFollowAtom } from "../../atom/ToFollowAtom";
import { userAtom } from "../../atom/UserAtom";
import { DEFAULT_AVATAR } from "../../utils/constant";
import { localStorageSetItem } from "../../utils/localStorage";
import readFile from "../../utils/ReadFile";
import Modal from "../Modal";
import StyledButton from "../StyledButton";
import StyledInput from "../StyledInput";
import AddImage from "./AddImage";

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

const ProfileImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 100%;
  margin-bottom: 20px;
`;

const InputSize = css`
  width: 100%;
`;

const ButtonSize = css`
  height: 48px;
`;

export default function CreateUserModal() {
  const [, setUser] = useAtom(userAtom);
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const router = useRouter();
  const [, setToFollow] = useAtom(toFollowAtom);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const imageRef = useRef<HTMLInputElement>(null);

  const [image, setImage] = useState<Blob | null>(null);

  const onFileChange = async (e: any) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const imageDataUrl: string = await readFile(file);

      setImageUrl(imageDataUrl);
    }
  };

  async function handleClick() {
    setIsLoading(true);
    const newUser = await UserApi.create(
      {
        name,
        password,
        username,
      },
      image
    );
    if (!newUser) return;
    setUser(newUser);
    localStorageSetItem("ACCESS_TOKEN", newUser.accessToken);
    const toFollow = await UserApi.toFollow();
    setToFollow(toFollow);
    router.push("/home");
  }

  return (
    <Container>
      <Title>Criar sua conta</Title>
      <div
        css={css`
          width: 100%;
          display: flex;
          justify-content: center;
        `}
      >
        <ProfileImage
          src={image ? URL.createObjectURL(image) : DEFAULT_AVATAR}
          onClick={() => imageRef.current?.click()}
        />

        <input
          ref={imageRef}
          type="file"
          accept="image/*"
          onChange={onFileChange}
          style={{ display: "none" }}
        />
      </div>
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

      <Modal showModal={!!imageUrl} closeModal={() => setImageUrl(null)}>
        <AddImage
          imageSrc={imageUrl as string}
          closeModal={() => setImageUrl(null)}
          saveImage={(croppedImage: Blob) => {
            setImage(croppedImage);
          }}
        />
        ,
      </Modal>
    </Container>
  );
}
