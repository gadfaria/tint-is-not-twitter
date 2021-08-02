import styled from "@emotion/styled";
import { useAtom } from "jotai";
import React from "react";
import { toast } from "react-toastify";
import { UserApi } from "../../apis/UserAPI";
import { toFollowAtom } from "../../atom/ToFollowAtom";
import { DEFAULT_AVATAR } from "../../utils/constant";
import StyledButton from "../StyledButton";

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  > div {
    display: flex;
    align-items: center;
  }
`;

export const Avatar = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  margin-right: 10px;
`;

export const Info = styled.div`
  display: flex;
  flex-direction: column;

  font-size: 14px;

  > span {
    color: var(--gray);
  }
`;

interface Props {
  name: string;
  nickname: string;
  userId: string;
  avatarUrl?: string;
}

export default function FollowSuggestion({
  name,
  nickname,
  avatarUrl,
  userId,
}: Props) {
  const [, setToFollow] = useAtom(toFollowAtom);
  async function handleClick() {
    const isSuccess = await UserApi.follow(userId);
    if (!isSuccess) return;
    setToFollow((user) => user.filter((u) => u.id !== userId));
    toast(`Seguindo ${nickname}`, { type: "info" });
  }

  return (
    <Container>
      <div>
        <Avatar src={avatarUrl ? avatarUrl : DEFAULT_AVATAR} alt={name} />
        <Info>
          <strong>{name}</strong>
          <span>{nickname}</span>
        </Info>
      </div>
      <StyledButton inverted onClick={handleClick}>
        Seguir
      </StyledButton>
    </Container>
  );
}
