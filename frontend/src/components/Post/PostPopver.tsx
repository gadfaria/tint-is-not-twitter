/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";
import useClickOutside from "../../hooks/useClickOutside";
import { IPost } from "../../types/PostTypes";
import EditIcon from "../../assets/edit";
import PostModal from "./PostModal";
import { useState } from "react";
import Modal from "../Modal";
import { css } from "@emotion/react";
import TrashIcon from "../../assets/trash";
import { useAtom } from "jotai";
import { postsAtom } from "../../atom/PostsAtom";
import { PostApi } from "../../apis/PostAPI";
import { toast } from "react-toastify";

const Container = styled.div`
  position: absolute;
  right: 30px;
  top: 30px;
  width: 208px;
  border: 1px solid #dbdbdb;
  background-color: white;
  border-radius: 4px;
  box-shadow: rgb(101 119 134 / 20%) 0px 0px 15px,
    rgb(101 119 134 / 15%) 0px 0px 3px;
`;

const Row = styled.div`
  padding: 10px 15px;
  cursor: pointer;
  color: #0f1419;
  font-size: 15px;
  line-height: 20px;
  display: flex;
  align-items: center;
  :hover {
    background-color: #dbdbdb70;
  }
`;

const Text = styled.div`
  margin-left: 12px;
`;

type Props = {
  post: IPost;
  closePopover: () => void;
};

export default function PostPopover({ post, closePopover }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const popOverRef = useClickOutside(() => {
    closePopover();
  });

  const [, setPosts] = useAtom(postsAtom);

  async function handleDelete() {
    const isDeleted = await PostApi.deletePost(post.id);

    if (!isDeleted) return;
    toast("Post deletado", { type: "info" });
    setPosts((posts) => posts.filter((p) => p.id !== post.id));
  }

  return (
    <Container ref={popOverRef}>
      <Row onClick={() => setIsEditing(true)}>
        <EditIcon />
        <Text>Editar</Text>
      </Row>

      <Row
        onClick={handleDelete}
        css={css`
          color: rgb(224, 36, 94);
        `}
      >
        <TrashIcon />
        <Text>Excluir</Text>
      </Row>

      <Modal
        showModal={isEditing}
        closeModal={() => {
          setIsEditing(false);
        }}
        customCss={css`
          width: 600px;
          max-height: 420px;
        `}
      >
        <PostModal
          post={post}
          closeModal={() => {
            setIsEditing(false);
          }}
        />
      </Modal>
    </Container>
  );
}
