import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  createEditor,
  DecoratorNode,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  SerializedEditor,
  SerializedLexicalNode,
  Spread,
} from "lexical";
import { ReactNode } from "react";
import EmailTextNodeComponent from "./EmailNodeComponent";

export type SerializedVidoeNode = Spread<
  {
    caption: SerializedEditor;
    type: ReturnType<typeof EmailTextNode.getType>;
    version: 1;
  },
  SerializedLexicalNode
>;

export class EmailTextNode extends DecoratorNode<ReactNode> {
  __caption: LexicalEditor;
  static getType(): string {
    return "EmailText";
  }

  static clone(node: EmailTextNode): EmailTextNode {
    return new EmailTextNode(node.__caption, node.__key);
  }

  constructor(caption?: LexicalEditor, key?: NodeKey) {
    super(key);

    this.__caption =
      caption ||
      createEditor({
        nodes: [],
      });

    this.__caption.update(() => {
      const root = $getRoot();
      const paragraphNode = $createParagraphNode();
      const textNode = $createTextNode("I'm some text");
      paragraphNode.append(textNode);
      root.append(paragraphNode);
    });
  }

  static importJSON(serializedNode: SerializedVidoeNode): EmailTextNode {
    const { caption } = serializedNode;
    const node = $createEmailTextNode();
    const nestedEditor = node.__caption;
    const editorState = nestedEditor.parseEditorState(caption.editorState);
    if (!editorState.isEmpty()) {
      nestedEditor.setEditorState(editorState);
    }
    return node;
  }

  exportJSON(): SerializedVidoeNode {
    return {
      caption: this.__caption.toJSON(),
      type: EmailTextNode.getType(),
      version: 1,
    };
  }

  createDOM(): HTMLElement {
    return document.createElement("div");
  }

  updateDOM(): false {
    return false;
  }

  decorate(): ReactNode {
    return <EmailTextNodeComponent caption={this.__caption} />;
  }
}

export function $createEmailTextNode(): EmailTextNode {
  return new EmailTextNode();
}

export function $isEmailTextNode(
  node: LexicalNode | null | undefined
): node is EmailTextNode {
  return node instanceof EmailTextNode;
}
