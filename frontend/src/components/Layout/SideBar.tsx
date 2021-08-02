import styled from "@emotion/styled";
import dayjs from "dayjs";
import { useAtom } from "jotai";
import React from "react";
import { newsAtom } from "../../atom/NewsAtom";
import { toFollowAtom } from "../../atom/ToFollowAtom";
import FollowSuggestion from "./FollowSugestion";
import List from "./List";
import News from "./News";
import { BUCKET_URL } from "../../config.json";

export const Container = styled.div`
  min-width: 100%;
  min-height: 100%;
`;

export const Body = styled.div`
  display: flex;
  flex-direction: column;

  padding: 0px 32px 200px;
  margin-top: 20px;

  > div + div {
    margin-top: 16px;
  }
`;

export const SearchWrapper = styled.div`
  padding: 10px 24px;

  width: min(399px, 100%);
  max-height: 60px;

  position: fixed;
  top: 0;
  z-index: 2;
`;

export const SearchInput = styled.input`
  width: 100%;
  height: 40px;

  font-size: 14px;
  padding: 0 10px 0 52px;

  border-radius: 18px;
  background: red;

  &::placeholder {
    color: var(--gray);
  }

  ~ svg {
    position: relative;
    top: -36px;
    left: 16px;
    z-index: 1;

    transition: 180ms ease-in-out;
  }

  &:focus {
    border: 1px solid #1da1f2;

    ~ svg {
      fill: #1da1f2;
    }
  }
`;

export default function SideBar() {
  const [news] = useAtom(newsAtom);
  const [toFollow] = useAtom(toFollowAtom);
  return (
    <Container>
      {/* <SearchWrapper>
        <SearchInput placeholder="Buscar no Twitter" />
         <SearchIcon /> 
      </SearchWrapper> */}
      <Body>
        <List
          title="O que está acontecendo"
          elements={news.slice(0, 4).map((n) => {
            return (
              <News
                heading={`${n.source.name} - ${dayjs(n.publishedAt)
                  .locale("pt-br")
                  .fromNow()}`}
                title={n.title}
                url={n.url}
              />
            );
          })}
        />

        {toFollow.length > 0 && (
          <List
            title="Quem seguir"
            elements={toFollow.map((f) => (
              <FollowSuggestion
                name={f.name}
                nickname={f.username}
                userId={f.id}
                avatarUrl={
                  f.avatar ? `${BUCKET_URL}/file/${f.avatar}` : undefined
                }
              />
            ))}
          />
        )}
      </Body>
    </Container>
  );
}
