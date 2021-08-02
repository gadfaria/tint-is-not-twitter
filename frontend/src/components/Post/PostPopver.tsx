/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";
import useClickOutside from "../../hooks/useClickOutside";
import { IPost } from "../../types/PostTypes";
import EditIcon from "../../assets/edit";
import PostModal from "./PostModal";
import { useState } from "react";
import Modal from "../Modal";
import { css } from "@emotion/react";

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
  padding: 17px 15px;
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

  return (
    <Container ref={popOverRef}>
      <Row onClick={() => setIsEditing(true)}>
        <EditIcon />
        <Text>Editar</Text>
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
        <PostModal post={post} />
      </Modal>
    </Container>
  );
}