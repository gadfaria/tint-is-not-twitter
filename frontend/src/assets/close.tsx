/** @jsxImportSource @emotion/react */
import { css, SerializedStyles } from "@emotion/react";
import React, { DetailedHTMLProps, HTMLAttributes } from "react";

export interface IconProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  width?: number;
  height?: number;
  color?: string;
  customCss?: SerializedStyles;
}

export default function CloseIcon(props: IconProps): JSX.Element {
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
        id="Close_button"
        data-name="Close button"
        xmlns="http://www.w3.org/2000/svg"
        width={width || "14"}
        height={height || "14"}
        viewBox="0 0 14 14"
      >
        <path
          id="Path_10024"
          data-name="Path 10024"
          d="M19,6.41,17.59,5,12,10.59,6.41,5,5,6.41,10.59,12,5,17.59,6.41,19,12,13.41,17.59,19,19,17.59,13.41,12Z"
          transform="translate(-5 -5)"
          fill={color || "#868482"}
        />
      </svg>
    </div>
  );
}
