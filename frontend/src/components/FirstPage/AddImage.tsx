import styled from "@emotion/styled";
import React, { useRef, useState } from "react";
import Cropper from "react-avatar-editor";
import StyledButton from "../StyledButton";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border-top: 1px solid #eceeee;
  margin-top: -400px;
`;

const StyledCropper = styled(Cropper)`
  margin: 20px;
  border-radius: 8px;
`;

const Buttons = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: flex-end;
  border-top: 1px solid gray;
  padding: 20px 20px 0px;
`;

interface Props {
  imageSrc: string;
  closeModal: () => void;
  saveImage: (croppedImage: Blob) => void;
}

export default function AddImage(props: Props): JSX.Element {
  const { imageSrc, closeModal, saveImage } = props;
  const editorRef = useRef<any>(null);

  function getCroppedImage() {
    const croppedImage = editorRef.current.getImage().toDataURL();

    fetch(croppedImage)
      .then((res) => res.blob())
      .then((blob) => saveImage(blob));

    closeModal();
  }

  return (
    <Container>
      <StyledCropper
        ref={editorRef}
        image={imageSrc}
        width={300}
        height={300}
        borderRadius={300}
        border={0}
      />

      <Buttons>
        <StyledButton
          style={{ marginRight: "12px", width: "100px", height: "36px" }}
          onClick={closeModal}
        >
          Cancel
        </StyledButton>
        <StyledButton
          style={{ width: "100px", height: "36px" }}
          inverted
          onClick={getCroppedImage}
        >
          Save
        </StyledButton>
      </Buttons>
    </Container>
  );
}
