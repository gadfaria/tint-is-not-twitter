/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { PostApi } from "../../apis/PostAPI";
import ThreePointsIcon from "../../assets/threepoints";
import { BUCKET_URL } from "../../config.json";
import { mqttClient } from "../../pages/_app";
import { styledScrollBar } from "../../styles/general";
import { IPost } from "../../types/PostTypes";
import { DEFAULT_AVATAR } from "../../utils/constant";
import ImgGrid, { ImageGridCounter, Img } from "../ImgGrid";
import PostPopover from "./PostPopver";

//@ts-ignore
// import __Spotlight from "spotlight.js/src/js/spotlight.js";
// import "spotlight.js/dist/css/spotlight.min.css";

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

const Avatar = styled.img`
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  border-radius: 50%;
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
  // const Spotlight = __Spotlight;

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
      {post.authorId === userId && (
        <ThreePoints onClick={() => setShowPopover(!showPopover)}>
          <ThreePointsIcon width="18" height="18" />
        </ThreePoints>
      )}
      {showPopover && (
        <PostPopover closePopover={() => setShowPopover(false)} post={post} />
      )}
      <Wrapper>
        <Avatar
          src={
            post.author.avatar
              ? `${BUCKET_URL}/file/${post.author.avatar}`
              : DEFAULT_AVATAR
          }
        />
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
              {" ?? "}
              {dayjs(post.createdAt).locale("pt-br").fromNow(true)}
            </span>
          </div>
          <div
            dangerouslySetInnerHTML={{
              __html: post.content,
            }}
          />
          {post.images && post.images.length > 0 && (
            <ImgGrid
              count={post.images.length}
              css={css`
                margin-bottom: 10px;
              `}
            >
              {post.images.map((image: string, index) => {
                if (index >= 4) return null;
                return (
                  <Img
                    className={index === 0 ? "first" : ""}
                    key={image}
                    src={`${BUCKET_URL}/file/${image}`}
                    onClick={() => {
                      // Spotlight.show(
                      //   post.images.map((image) => ({
                      //     src: `${BUCKET_URL}/file/${image}`,
                      //   }))
                      // );
                    }}
                  />
                );
              })}
              {post.images.length > 4 && (
                <ImageGridCounter
                  onClick={() => {
                    {
                      // Spotlight.show(
                      //   post.images.map((image) => ({
                      //     src: `${BUCKET_URL}/file/${image}`,
                      //   }))
                      // );
                    }
                  }}
                  className="noselect"
                >
                  + {post.images.length - 3}
                </ImageGridCounter>
              )}
            </ImgGrid>
          )}
        </div>
      </Wrapper>

      <Bottom
        css={css`
          ${post.images.length > 0 &&
          css`
            margin-top: 3px;
          `}
        `}
      >
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
