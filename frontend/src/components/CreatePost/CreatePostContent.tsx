/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import { defaultExtensions } from "@tiptap/starter-kit";
import { useAtom } from "jotai";
import { nanoid } from "nanoid";
import { useRef, useState } from "react";
import { PostApi } from "../../apis/PostAPI";
import { postsAtom } from "../../atom/PostsAtom";
import { styledScrollBar } from "../../styles/general";
import { IPost } from "../../types/PostTypes";
import b64toBlob from "../../utils/B64toBlob";
import readFile from "../../utils/ReadFile";
import StyledButton from "../StyledButton";
import ImgGrid, { ImageGridCounter, Img } from "../ImgGrid";
import ImageIcon from "../../assets/image";

const Container = styled.div`
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0px 15px;
  word-wrap: break-word;
  white-space: pre-line;
  overflow-wrap: anywhere;
  cursor: text;
  color: #0f1419;
  font-size: 20px;
  line-height: 24px;

  ${styledScrollBar}
`;

const Avatar = styled.div`
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  border-radius: 50%;
  background: url("https://avatars.githubusercontent.com/u/69378560?s=460&u=831bbebb1c4c52f9b9b28469b54acca7ed89c69b&v=4");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  margin-right: 15px;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  padding: 9px 10px;
`;

const Bottom = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 0px 10px 0px 73px;
  padding: 10px 0px;

  border-top: 1px solid #dbdbdb70;
`;

const ButtonSize = css`
  width: 101px;
  height: 40px;
`;

type Props = {
  post?: IPost;
};

export interface ImagesObj {
  blob: Blob;
  uuid: string;
  url: string;
}

export default function CreatePostContent({ post }: Props) {
  const [, setPosts] = useAtom(postsAtom);
  const [images, setImages] = useState<ImagesObj[]>([]);

  const imageRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      ...defaultExtensions(),
      Placeholder.configure({
        placeholder: `O que está acontecendo?`,
      }),
      //   Mention.configure({
      //     HTMLAttributes: {
      //       class: "mention",
      //     },
      //     suggestion: {
      //       items: (query) => {
      //         return [];
      //       },
      //       render: () => {
      //         let reactRenderer: any;
      //         let popup: any;
      //         let mentionListRef: any;

      //         return {
      //           onStart: (props) => {
      //             reactRenderer = new ReactRenderer(
      //               (props) =>
      //                 (
      //                   <MentionList
      //                     {...props}
      //                     ref={(r) => (mentionListRef = r)}
      //                   />
      //                 ) as any,
      //               {
      //                 props,
      //                 editor: props.editor as any,
      //               }
      //             );

      //             popup = tippy("body", {
      //               getReferenceClientRect: props.clientRect,
      //               appendTo: () => document.body,
      //               content: reactRenderer.element,
      //               showOnCreate: true,
      //               interactive: true,
      //               trigger: "manual",
      //               placement: "bottom-start",
      //             });
      //           },
      //           onUpdate(props) {
      //             reactRenderer.updateProps(props);

      //             popup[0].setProps({
      //               getReferenceClientRect: props.clientRect,
      //             });
      //           },
      //           onKeyDown(props) {
      //             return mentionListRef?.onKeyDown(props);
      //           },
      //           onExit() {
      //             popup[0].destroy();
      //             reactRenderer.destroy();
      //           },
      //         };
      //       },
      //     },
      //   }),
    ],
    content: post ? post.content : "",
  });

  async function handleClick() {
    if (!post) {
      const newPost = await PostApi.create({
        content: editor!.getHTML(),
        images: images.filter((image) => image.blob).map((image) => image.blob),
      });
      if (!newPost) return;

      setPosts((posts) => [newPost, ...posts]);
      setImages([]);
      editor?.commands.clearContent();
    } else {
      await PostApi.update(
        {
          content: editor!.getHTML(),
          authorId: post.author.id,
        },
        post.id
      );
    }
  }

  async function onFileChange(e: any) {
    const files = [...e.target.files];
    const arrayImages = await Promise.all(
      files.map(async (file) => {
        const imageDataUrl: string = await readFile(file);
        const imageBlob = b64toBlob(imageDataUrl);
        return {
          blob: imageBlob,
          url: URL.createObjectURL(imageBlob),
          uuid: nanoid(),
        };
      })
    );

    setImages([...images, ...arrayImages]);
  }

  if (!editor) return <></>;
  return (
    <Container>
      <Wrapper>
        <Avatar />
        <div
          css={css`
            margin-top: 13px;
            width: 100%;
          `}
        >
          <div
            onClick={() => {
              editor.commands.focus();
            }}
            css={css`
              width: 100%;
            `}
          >
            <EditorContent editor={editor} />
          </div>
          {images && images.length > 0 && (
            <ImgGrid
              count={images.length}
              style={{ marginBottom: "10px" }}
              fullWidth
            >
              {images.map((image: ImagesObj, index) => {
                if (index >= 4) return null;
                return (
                  <Img
                    className={index === 0 ? "first" : ""}
                    key={image.uuid}
                    src={image.url}
                  />
                );
              })}

              {images.length > 4 && (
                <ImageGridCounter className="noselect">
                  + {images.length - 3}
                </ImageGridCounter>
              )}
            </ImgGrid>
          )}
        </div>
      </Wrapper>
      <Bottom>
        <div
          css={css`
            cursor: pointer;
          `}
          onClick={() => imageRef.current?.click()}
        >
          <input
            ref={imageRef}
            type="file"
            multiple
            accept="image/*"
            onChange={onFileChange}
            style={{ display: "none" }}
          />
          <ImageIcon width="25" height="25" />
        </div>

        <StyledButton css={ButtonSize} onClick={handleClick}>
          {post ? "Editar" : "Tweetar"}
        </StyledButton>
      </Bottom>
    </Container>
  );
}
