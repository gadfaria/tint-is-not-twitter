/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { PostApi } from "../../apis/PostAPI";
import ThreePointsIcon from "../../assets/threepoints";
import useClickOutside from "../../hooks/useClickOutside";
import { mqttClient } from "../../pages/_app";
import { styledScrollBar } from "../../styles/general";
import { IPost } from "../../types/PostTypes";
import PostPopover from "./PostPopver";

const Container = styled.div`
  overflow-y: auto;
  overflow-x: hidden;
  padding: 5px 15px 0px 15px;
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
  position: relative;
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
  padding: 9px 10px 0px 10px;
`;

const Bottom = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 13px;
  color: #536471;
  line-height: 16px;
  margin-left: 55px;
  margin-bottom: 10px;
  margin-top: -5px;
`;

const ThreePoints = styled.div`
  position: absolute;
  right: 10px;
  cursor: pointer;
`;

type Props = {
  post: IPost;
  userId: string;
};

export default function Post({ post: postFromProps, userId }: Props) {
  const [post, setPost] = useState(postFromProps);
  const [showPopover, setShowPopover] = useState(false);
  const [likeAction, setLikeAction] = useState(post.likes.includes(userId));

  useEffect(() => {
    mqttClient.subscribe(`post/${post.id}`);

    mqttClient.on("message", (topic, message: any) => {
      if (topic === `post/${post.id}`) {
        let messageData = JSON.parse(message);

        switch (messageData.code) {
          case "LIKE":
            setPost((p) => ({ ...p, likes: [...p.likes, messageData.userId] }));
            break;
          case "EDIT":
            console.log({ messageData });
            setPost((p) => ({ ...p, content: messageData.message.content }));
            break;
          default:
            break;
        }
      }
    });

    return () => {
      mqttClient.unsubscribe(`post/${post.id}`);
    };
  }, []);

  async function handleLike() {
    const isLiked = await PostApi.like(post.id);
    if (!isLiked) return;
    setLikeAction(true);
  }

  return (
    <Container>
      <ThreePoints onClick={() => setShowPopover(!showPopover)}>
        <ThreePointsIcon width="18" height="18" />
      </ThreePoints>
      {showPopover && (
        <PostPopover closePopover={() => setShowPopover(false)} post={post} />
      )}
      <Wrapper>
        <Avatar />
        <div
          css={css`
            display: flex;
            flex-direction: column;
          `}
        >
          <div>
            <strong>{post.author.name} </strong>{" "}
            <span
              css={css`
                color: #536471;
              `}
            >
              @{post.author.username}
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

      <Bottom>
        <div
          onClick={handleLike}
          className={`hearth ${likeAction && "animate"}`}
        />
        <div
          css={css`
            margin-left: -10px;
          `}
        >
          {post.likes.length}
        </div>
      </Bottom>
    </Container>
  );
}
