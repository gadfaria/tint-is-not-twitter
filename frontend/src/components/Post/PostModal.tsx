/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";
import { IPost } from "../../types/PostTypes";
import CreatePostContent from "../CreatePost/CreatePostContent";

const Container = styled.div`
  padding: 10px 0px;
`;

const Wrapper = styled.div`
  border-top: 1px solid #dbdbdb;
  margin-top: 25px;
`;

type Props = {
  post?: IPost;
  closeModal: () => void;
};

export default function PostModal({ post, closeModal }: Props) {
  return (
    <Container>
      <Wrapper>
        <CreatePostContent post={post} closeModal={closeModal} />
      </Wrapper>
    </Container>
  );
}
