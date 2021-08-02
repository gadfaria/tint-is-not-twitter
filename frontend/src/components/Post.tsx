/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import dayjs from "dayjs";
import { styledScrollBar } from "../styles/general";
import { IPost } from "../types/PostTypes";

const Container = styled.div`
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0px 15px;
  word-wrap: break-word;
  white-space: pre-line;
  overflow-wrap: anywhere;
  cursor: text;
  color: #0f1419;
  font-size: 15px;
  line-height: 20px;

  border: 1px solid #dbdbdb70;
  border-top: none;
  ${styledScrollBar}
`;

const Avatar = styled.div`
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  border-radius: 50%;
  background: url("https://avatars.githubusercontent.com/u/69378560?s=460&u=831bbebb1c4c52f9b9b28469b54acca7ed89c69b&v=4");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  margin-right: 15px;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  padding: 9px 10px;
`;

type Props = {
  post: IPost;
};

export default function Post({ post }: Props) {
  return (
    <Container>
      <Wrapper>
        <Avatar />
        <div
          css={css`
            display: flex;
            flex-direction: column;
          `}
        >
          <div>
            <strong>{post.user.name} </strong>{" "}
            <span
              css={css`
                color: #536471;
              `}
            >
              @{post.user.username}
              {" · "}
              {dayjs(post.createdAt).locale("pt-br").fromNow(true)}
            </span>
          </div>
          <div
            dangerouslySetInnerHTML={{
              __html: post.content,
            }}
          />
        </div>
      </Wrapper>
    </Container>
  );
}
