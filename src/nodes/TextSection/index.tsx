import {
  createEditor,
  DecoratorNode,
  DOMExportOutput,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  SerializedEditor,
  SerializedLexicalNode,
  Spread,
} from "lexical";
import { ReactNode } from "react";
import EmailTextNodeComponent from "./EmailNodeComponent";
import { $generateHtmlFromNodes } from "@lexical/html";
export type SerializedVidoeNode = Spread<
  {
    caption: SerializedEditor;
    type: ReturnType<typeof TextSectionNode.getType>;
    version: 1;
  },
  SerializedLexicalNode
>;

export class TextSectionNode extends DecoratorNode<ReactNode> {
  __caption: LexicalEditor;
  static getType(): string {
    return "EmailText";
  }

  static clone(node: TextSectionNode): TextSectionNode {
    return new TextSectionNode(node.__caption, node.__key);
  }

  constructor(caption?: LexicalEditor, key?: NodeKey) {
    super(key);

    this.__caption =
      caption ||
      createEditor({
        nodes: [],
      });

    // this.__caption.update(() => {
    //   const root = $getRoot();
    //   const paragraphNode = $createCustomParagraphNode();
    //   // const textNode = $createTextNode("I'm some text");
    //   paragraphNode.append(textNode);
    //   root.append(paragraphNode);
    // });
  }

  static importJSON(serializedNode: SerializedVidoeNode): TextSectionNode {
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
      type: TextSectionNode.getType(),
      version: 1,
    };
  }

  createDOM(): HTMLElement {
    //TODO: should this be a Section or something? (i don't think so, pretty sure it just uses decorate)
    return document.createElement("div");
  }

  exportDOM(editor: LexicalEditor): DOMExportOutput {
    const lexicalHtml = this.__caption
      .getEditorState()
      .read(() => $generateHtmlFromNodes(this.__caption, null));
    const template = document.createElement("template");
    const nodeHtml = lexicalHtml.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = nodeHtml.trim();
    return { element: template.content };
  }

  updateDOM(): false {
    return false;
  }

  decorate(): ReactNode {
    return <EmailTextNodeComponent caption={this.__caption} />;
  }
}

export function $createEmailTextNode(): TextSectionNode {
  return new TextSectionNode();
}

export function $isEmailTextNode(
  node: LexicalNode | null | undefined
): node is TextSectionNode {
  return node instanceof TextSectionNode;
}
