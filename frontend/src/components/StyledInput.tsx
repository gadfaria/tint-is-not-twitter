/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";
import React, { useState, DetailedHTMLProps, InputHTMLAttributes } from "react";
import { motion, MotionStyle, TargetAndTransition } from "framer-motion";
import { css, SerializedStyles } from "@emotion/react";

const Container = styled.div<{ isFocused: boolean }>`
  position: relative;
  border-radius: 4px;
  border: 2px solid transparent;
  width: 334px;
  height: 56px;

  font-size: 17px;

  ${(props) =>
    props.isFocused &&
    css`
      box-shadow: 0px 0px 6px #31a1f24d;
      border: 2px solid #31a1f2;

      > div {
        border: 1px solid transparent;
      }

      span {
        color: #31a1f2;
      }
    `};
`;

const Border = styled.div`
  border-radius: 4px;
  border: 1px solid #53647150;
  width: 100%;
  height: 100%;
`;

const Input = styled.input`
  margin-top: 10px;
  width: 100%;
  height: 100%;
  text-indent: 10px;
  border: none;
  outline: none;
  background-color: transparent;
  font-size: 17px;
`;

const Label = styled.span`
  width: 100%;
  white-space: pre-wrap;
  font-size: 17px;
  color: #0f1419;
`;

const placeholderStyle: MotionStyle = {
  position: "absolute",
  bottom: 15,
  left: 10,
  scale: 1,
  pointerEvents: "none",
  originX: 0.1,
};

const initialPlaceholderState: TargetAndTransition = {
  y: -3,
  scale: 1,
  opacity: 0.6,
};

const upperPlaceholderState: TargetAndTransition = {
  y: -15,
  scale: 0.8,
  opacity: 1,
};

interface Props
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  placeholder: string;
  value: string;
  customCss?: SerializedStyles;
}

export default function StyledInput(props: Props) {
  const { value, placeholder, customCss } = props;

  let [inputFocus, setInputFocus] = useState(false);
  return (
    <Container
      isFocused={inputFocus}
      css={css`
        ${customCss}
      `}
    >
      <Border>
        <motion.div
          style={placeholderStyle}
          animate={
            inputFocus || value.length > 0
              ? upperPlaceholderState
              : initialPlaceholderState
          }
        >
          <Label>{placeholder}</Label>
        </motion.div>
        <Input
          {...props}
          placeholder=""
          onFocus={() => setInputFocus(true)}
          onBlur={() => setInputFocus(false)}
        />
      </Border>
    </Container>
  );
}
