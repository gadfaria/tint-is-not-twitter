/** @jsxImportSource @emotion/react */
import { css, jsx } from "@emotion/react";
import styled from "@emotion/styled";
import React, { DetailedHTMLProps, HTMLAttributes } from "react";
// import { useRecoilValue } from "recoil";
// import postWidthAtom from "../atoms/PostWidthAtom";

/** We have multiple image grids, depending on the image */
interface Props
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  count: number;
  children: any;
  fullWidth?: boolean;
}

interface ContainerProps {
  count: number;
  width: number;
  fullWidth?: boolean;
}

export const ImageGridCounter = styled.div`
  width: 100%;
  height: 75%;

  position: absolute;

  top: 0px;
  left: 0px;

  display: flex;
  justify-content: center;
  align-items: center;

  background-color: #000000dd;

  color: #ffffff;

  grid-column: 4;
  grid-row: 3;
  border-radius: 5px;
  font-size: 32px;
`;

const Container = styled.div<ContainerProps>`
  width: ${(props) => (props.fullWidth ? "100%" : `${props.width}px`)};
  height: 100%;
  margin-top: 10px;

  display: grid;
  grid-column-gap: 5px;
  grid-row-gap: 5px;

  position: relative;

  cursor: pointer;

  ${(props) => {
    if (props.count === 1) {
      return css`
        .first {
          height: auto;
        }
      `;
    }

    if (props.count === 2) {
      return css`
        grid-template-columns: 1fr 1fr;
        /* Both images fill one line so we divide the height by 2 to make them square */
        grid-template-rows: calc(${props.width}px / 2);
      `;
    }

    if (props.count === 3) {
      return css`
        grid-template-columns: 1fr 1fr 1fr 1fr;
        /* The images on the right are half of the original */
        grid-template-rows: calc(${props.width}px / 2 / 2) calc(
            ${props.width}px / 2 / 2
          );

        .first {
          grid-column: 1/4;
          grid-row: 1/3;
        }
      `;
    }

    if (props.count >= 4) {
      return css`
        grid-template-columns: 1fr 1fr 1fr 1fr;
        /* The images on the right are are a third of the original */
        grid-template-rows:
          calc(${props.width}px / 2 / 3) calc(${props.width}px / 2 / 3)
          calc(${props.width}px / 2 / 3);

        .first {
          grid-column: 1/4;
          grid-row: 1/4;
        }
      `;
    }

    return ``;
  }}
`;

export const Img = styled.img`
  max-width: 100%;
  min-width: 100%;

  height: 100%;
  max-height: 634px;
  object-fit: cover;
  background-color: #00000077;
  border-radius: 5px;
`;

export function getPostWidth() {
  if (window.innerWidth < 750) return window.innerWidth - 80;
  if (window.innerWidth < 1000) return window.innerWidth - 380;
  if (window.innerWidth < 1330) return window.innerWidth - 490;
  if (window.innerWidth >= 1330) return window.innerWidth - 820;
  else return window.innerWidth - 820;
}

function ImgGrid(props: Props) {
  const { count, children } = props;

  return (
    <Container count={count} width={600} fullWidth>
      {children}
    </Container>
  );
}

export default ImgGrid;
