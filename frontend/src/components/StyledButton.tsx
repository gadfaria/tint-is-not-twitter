import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { motion } from "framer-motion";
import React, {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  PropsWithChildren,
} from "react";
import { notSelect } from "../styles/general";

export interface Props
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  inverted?: boolean;
  isLoading?: boolean;
}

const InvertedColors = css`
  background-color: white;
  border-color: rgb(29, 161, 242);
  color: rgb(29, 161, 242);

  :hover {
    background-color: #1a91da20;
  }
`;

const NormalColors = css`
  background-color: rgb(29, 161, 242);
  border-color: rgb(29, 161, 242);
  color: white;

  &:hover {
    background-color: #1a91da;
    border-color: #1a91da;
  }
`;

const Button = styled.button`
  border: 1px solid rgb(29, 161, 242);
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0px;
  padding: 10px 20px;
  ${notSelect}

  transition:  border-color 0.2s, background-color 0.2s;

  cursor: pointer;
  ${(props: Props) => (props.inverted ? InvertedColors : NormalColors)}

  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`;

const CircleLoading = styled.div`
  position: relative;
  width: 1em;
  height: 19px;
`;

const CircleStyle = styled(motion.span)`
  width: 1.5rem;
  height: 1.5rem;
  border: 0.3rem solid #cccccc;
  border-top: 0.3rem solid #ffffff;
  border-radius: 50%;
  position: absolute;
  left: -4px;
  top: -2px;
`;

const spinTransition = {
  loop: Infinity,
  ease: "linear",
  duration: 1,
};

export default function StyledButton(
  props: PropsWithChildren<Props>
): JSX.Element {
  const { children, isLoading, disabled } = props;
  return (
    <Button {...props} type="button" disabled={disabled || isLoading}>
      {!isLoading ? (
        children
      ) : (
        <CircleLoading>
          <CircleStyle animate={{ rotate: 360 }} transition={spinTransition} />
        </CircleLoading>
      )}
    </Button>
  );
}
