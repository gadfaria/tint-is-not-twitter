/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import { defaultExtensions } from "@tiptap/starter-kit";
import { useAtom } from "jotai";
import { PostApi } from "../../apis/PostAPI";
import { postsAtom } from "../../atom/PostsAtom";
import { styledScrollBar } from "../../styles/general";
import { IPost } from "../../types/PostTypes";
import StyledButton from "../StyledButton";

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
  flex-direction: column;
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

export default function CreatePostContent({ post }: Props) {
  const [, setPosts] = useAtom(postsAtom);

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
      const newPost = await PostApi.create({ content: editor!.getHTML() });
      if (!newPost) return;

      setPosts((posts) => [newPost, ...posts]);
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

  if (!editor) return <></>;
  return (
    <Container>
      <Wrapper>
        <Avatar />
        <div
          onClick={() => {
            editor.commands.focus();
          }}
          css={css`
            margin-top: 13px;
            width: 100%;
          `}
        >
          <EditorContent editor={editor} />
        </div>
      </Wrapper>
      <Bottom>
        <StyledButton css={ButtonSize} onClick={handleClick}>
          {post ? "Editar" : "Tweetar"}
        </StyledButton>
      </Bottom>
    </Container>
  );
}
