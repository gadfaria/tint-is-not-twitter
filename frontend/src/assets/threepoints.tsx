/** @jsxImportSource @emotion/react */
import { css, SerializedStyles } from "@emotion/react";
import React, { DetailedHTMLProps, HTMLAttributes } from "react";

export interface IconProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  width?: string;
  height?: string;
  color?: string;
  customCss?: SerializedStyles;
}

export default function ThreePointsIcon(props: IconProps): JSX.Element {
  const { width, height, color, customCss } = props;
  return (
    <div
      {...props}
      css={css`
        margin: 5px;
        padding: 5px 6px 2px 6px;
        border-radius: 100%;
        transition: background-color 0.3s;
        :hover {
          background-color: #1a91da20;
        }

        ${customCss}
      `}
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        width={width || "24"}
        height={height || "24"}
      >
        <g>
          <circle cx="5" cy="12" r="2"></circle>
          <circle cx="12" cy="12" r="2"></circle>
          <circle cx="19" cy="12" r="2"></circle>
        </g>
      </svg>
    </div>
  );
}
