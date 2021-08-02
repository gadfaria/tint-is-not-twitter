/** @jsxImportSource @emotion/react */
import { css, SerializedStyles } from "@emotion/react";
import styled from "@emotion/styled";
import { AnimatePresence, motion } from "framer-motion";
import React, {
  DetailedHTMLProps,
  HTMLAttributes,
  PropsWithChildren,
} from "react";
import CloseIcon from "../assets/close";
import useClickOutside from "../hooks/useClickOutside";

const BackdropDiv = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1;
`;

const ModalDiv = styled(motion.div)`
  margin: 0 auto;
  background: white;
  border-radius: 10px;
`;

const BackdropAnimation = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};

const ModalAnimation = {
  hidden: { y: "30vh", opacity: 0 },
  visible: {
    y: "30vh",
    opacity: 1,
    transition: { delay: 0.3 },
  },
};

interface Props
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  showModal: boolean;
  closeModal: Function;
  customCss?: SerializedStyles;
}

export default function Modal(props: PropsWithChildren<Props>) {
  const { showModal, children, customCss, closeModal } = props;

  const modalRef = useClickOutside(() => {
    closeModal();
  });

  return (
    <AnimatePresence>
      {showModal && (
        <BackdropDiv
          variants={BackdropAnimation}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <ModalDiv
            ref={modalRef}
            variants={ModalAnimation}
            css={css`
              ${customCss}
            `}
          >
            <CloseIcon
              onClick={() => closeModal()}
              customCss={css`
                position: fixed;
                right: 0;
                cursor: pointer;
              `}
              color="#31a1f2"
            />
            {children}
          </ModalDiv>
        </BackdropDiv>
      )}
    </AnimatePresence>
  );
}
