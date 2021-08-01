/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";
import Layout from "../components/Layout/Layout";
import SeoHead from "../components/SeoHead";

const Wrapper = styled.div`
  width: 600px;
`;

export default function Home() {
  return (
    <>
      <SeoHead pageName="Página Inicial" />
      <Layout>
        <Wrapper>aaaaaa</Wrapper>
      </Layout>
    </>
  );
}
