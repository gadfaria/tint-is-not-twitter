import { css } from "@emotion/react";

export const notSelect = css`
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
`;

export const styledScrollBar = css`
  ::-webkit-scrollbar {
    width: 10px;
  }

  ::-webkit-scrollbar-track {
    box-shadow: inset 0 0 1px transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(168, 168, 168, 0.1);
    border-radius: 10px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: rgba(168, 168, 168, 0.7);
  }
`;
