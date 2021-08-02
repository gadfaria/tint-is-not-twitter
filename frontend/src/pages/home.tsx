/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { PostApi } from "../apis/PostAPI";
import { postsAtom } from "../atom/PostsAtom";
import { userAtom } from "../atom/UserAtom";
import CreatePostContent from "../components/CreatePost/CreatePostContent";
import Layout from "../components/Layout/Layout";
import Post from "../components/Post/Post";
import SeoHead from "../components/SeoHead";

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

const Posts = styled.div`
  border-top: 1px solid #dbdbdb70;
`;

const Gray = styled.div`
  border-right: 1px solid #dbdbdb70;
  border-left: 1px solid #dbdbdb70;
  height: 12px;
  background: rgb(247, 249, 249);
`;

export default function Home() {
  const [user] = useAtom(userAtom);
  const [posts, setPosts] = useAtom(postsAtom);

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
          <Gray />
          <Posts>
            {posts.map((p) => (
              <Post key={p.id} post={p} userId={user.id} />
            ))}
          </Posts>
        </Wrapper>
      </Layout>
    </>
  );
}
