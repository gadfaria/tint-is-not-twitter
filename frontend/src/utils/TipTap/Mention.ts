import { mergeAttributes, Node } from "@tiptap/core";
import Suggestion, { SuggestionOptions } from "@tiptap/suggestion";

export type MentionOptions = {
  HTMLAttributes: Record<string, any>;
  suggestion: Omit<SuggestionOptions, "editor">;
};

let lastTextSize = 0;

export const Mention = Node.create<MentionOptions>({
  name: "mention",
  defaultOptions: {
    HTMLAttributes: {},
    suggestion: {
      char: "@",
      command: ({ editor, range, props }) => {
        console.log({ props });
        editor
          .chain()
          .focus()
          .replaceRange(range, "mention", {
            ...props,
          })
          .insertContent("<span>&#8291;</span>")
          .insertContent("&nbsp;")
          .run();
      },
      allow: ({ editor, range }) => {
        return true;
      },
    },
  },

  group: "inline",
  inline: true,
  selectable: false,
  atom: true,

  addAttributes() {
    return {
      uid: {
        default: null,
        parseHTML: (element) => {
          return {
            uid: element.getAttribute("data-mention-uid"),
          };
        },
        renderHTML: (attributes) => {
          console.log({ attributes });
          if (!attributes.uid) {
            return {};
          }

          return {
            "data-mention-uid": attributes.uid,
          };
        },
      },
      name: {
        default: null,
        parseHTML: (element) => {
          return {
            name: element.getAttribute("data-mention-name"),
          };
        },
        renderHTML: (attributes) => {
          console.log({ attributes });
          if (!attributes.name) {
            return {};
          }

          return {
            "data-mention-name": attributes.name,
          };
        },
      },
      username: {
        default: null,
        parseHTML: (element) => {
          return {
            username: element.getAttribute("data-mention-username"),
          };
        },
        renderHTML: (attributes) => {
          console.log({ attributes });
          if (!attributes.username) {
            return {};
          }

          return {
            "data-mention-username": attributes.username,
          };
        },
      },
    };
  },

  parseHTML() {
    console.log("Parse HTML");
    return [
      {
        tag: "a[data-mention-uid]",
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      "a",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        href: `https://app.sociallair.io/sl/${node.attrs.username}`,
        target: "_blank",
      }),

      `${node.attrs.name.split(" ")[0]}`,
    ];
  },

  renderText({ node }) {
    console.log("Render Text", { node });
    return `${node.attrs.name.split(" ")[0]}`;
  },

  onUpdate(this) {
    this.editor.commands.command(({ tr, state }) => {
      let isMention = false;
      const { selection } = state;
      const { empty, anchor } = selection;

      if (!empty) {
        lastTextSize = state.doc.content.size;
        return false;
      }

      if (lastTextSize > state.doc.content.size) {
        state.doc.nodesBetween(anchor - 1, anchor, (node, pos) => {
          console.log({ pos, a: node.nodeSize });
          if (node.type.name === "mention") {
            isMention = true;
            tr.insertText("", pos, pos + node.nodeSize);

            return false;
          }
        });
      }

      lastTextSize = state.doc.content.size;
      return isMention;
    });
  },

  onTransaction(this) {},

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },
});
