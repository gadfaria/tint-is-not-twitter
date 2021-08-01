import { css } from "@emotion/react";
import styled from "@emotion/styled";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { User } from "../../types/UserType";

export const MentionEntry = styled.div<{ isFocused: boolean }>`
  width: 100%;
  display: flex;
  padding: 10px;
  align-items: center;
  border-left: 3px solid
    ${(props) => (props.isFocused ? "#6bb700" : "transparent")};
  background-color: ${(props) =>
    props.isFocused ? (props) => "#e8ebe3" : "#ffffff"};
  cursor: pointer;
  padding-right: 20px;
`;

export const MentionImage = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 30px;
`;

export const MentionImageContainer = styled.div`
  margin-right: 10px;
`;

export const MentionName = styled.span`
  font-size: 20px;
  font-weight: 500;
`;

interface MentionProps {
  isClickable?: boolean;
  isDeleted?: boolean;
}

const DeletedMentionCss = css`
  color: #8f9193;
  cursor: pointer;
`;

const ClickableMentionCss = css`
  cursor: pointer;

  :hover {
    color: #406e00;
  }
`;

export const MentionLink = styled.span<MentionProps>`
  color: #5fa200;
  cursor: text;
  font-weight: 700;
  ${(props) => (props.isDeleted ? DeletedMentionCss : ClickableMentionCss)}
`;

export interface FloatingMenuHandles {
  onKeyDown: ({ event }: { event: KeyboardEvent }) => boolean;
}

// This is any because tiptap suggestion module is not exporting
// its types on the time of implementation
const MentionList: React.ForwardRefRenderFunction<FloatingMenuHandles, any> = (
  props: any,
  ref
) => {
  let [selectedIndex, setSelectedIndex] = useState(0);

  function onKeyDown({ event }: any) {
    if (event.key === "ArrowUp") {
      setSelectedIndex(
        (selectedIndex) =>
          (selectedIndex + props.items.length - 1) % props.items.length
      );
      return true;
    }

    if (event.key === "ArrowDown") {
      setSelectedIndex(
        (selectedIndex) => (selectedIndex + 1) % props.items.length
      );
      return true;
    }

    if (event.key === "Tab") {
      let mention: User = props.items[selectedIndex];
      props.command({
        // uid: mention.uid,
        name: mention.name,
        username: mention.username,
      });
      return true;
    }

    if (event.key === "Enter") {
      let mention: User = props.items[selectedIndex];
      props.command({
        // uid: mention.uid,
        name: mention.name,
        username: mention.username,
      });
      return true;
    }

    return false;
  }

  useEffect(() => {
    // Handle of the case where I'm selecting and filtering
    // becomes smaller than my index
    if (props.items.length - 1 < selectedIndex) {
      setSelectedIndex(props.items.length - 1);
    }

    // Handler of the case where my list went empty
    // and came back by filtering
    if (selectedIndex === -1) setSelectedIndex(0);
  }, [props.items.length]);

  useImperativeHandle(
    ref,
    () => ({
      onKeyDown,
    }),
    [selectedIndex]
  );

  return (
    <div
    // initial={{ y: -30, opacity: 0 }}
    // animate={{ y: 0, opacity: 1 }}
    // transition={{ type: "spring", duration: 0.3, bounce: 0.5 }}
    >
      {props.items.map(
        (mention: User & { fullName?: string }, index: number) => (
          <MentionEntry
            onClick={() =>
              props.command({
                // uid: mention.uid,
                name: mention.name,
                username: mention.username,
              })
            }
            isFocused={selectedIndex === index}
            onMouseEnter={() => setSelectedIndex(index)}
          >
            <MentionImageContainer>
              {/* <AvatarIcon
                size={30}
                image={mention.image}
                userName={mention.name}
              /> */}
            </MentionImageContainer>
            <MentionName>
              {mention.fullName ? mention.fullName : mention.name}
            </MentionName>
          </MentionEntry>
        )
      )}
    </div>
  );
};

export default forwardRef(MentionList);
