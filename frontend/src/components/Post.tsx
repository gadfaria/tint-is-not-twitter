import { IPost } from "../types/PostTypes";

type Props = {
  post: IPost;
};

export default function Post({ post }: Props) {
  return (
    <div>
      <div
        dangerouslySetInnerHTML={{
          __html: post.content,
        }}
      />
    </div>
  );
}
