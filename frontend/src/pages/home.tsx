/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";
import { useAtom } from "jotai";
import { userAtom } from "../atom/UserAtom";
import Layout from "../components/Layout/Layout";
import SeoHead from "../components/SeoHead";
import CreatePostContent from "../components/CreatePost/CreatePostContent";
import { useEffect, useState } from "react";
import { PostApi } from "../apis/PostAPI";
import { IPost } from "../types/PostTypes";
import Post from "../components/Post";

const Wrapper = styled.div`
  width: 600px;
`;

const Header = styled.header`
  color: #0f1419;
  font-size: 20px;
  font-weight: 800;
  line-height: 24px;
  padding: 16px;
  border: 1px solid #dbdbdb70;
`;

const CreatePostDiv = styled.div`
  border: 1px solid #dbdbdb70;
  border-top: none;
`;

export default function Home() {
  const [user] = useAtom(userAtom);
  const [posts, setPosts] = useState<IPost[]>([]);

  useEffect(() => {
    (async () => {
      const postsResponse = await PostApi.get();

      if (!postsResponse) return;
      setPosts(postsResponse);
    })();
  }, []);

  if (!user) return <div>carregando</div>;
  return (
    <>
      <SeoHead pageName="Página Inicial" />
      <Layout>
        <Wrapper>
          <Header>Página Inicial</Header>
          <CreatePostDiv>
            <CreatePostContent />
          </CreatePostDiv>
          {posts.map((p) => (
            <Post post={p} />
          ))}
        </Wrapper>
      </Layout>
    </>
  );
}
