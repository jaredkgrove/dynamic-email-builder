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
import EmailTextNodeComponent from "./EmailTextNodeComponent";
import { $generateHtmlFromNodes } from "@lexical/html";
import { EmailParagraphNode } from "../EmailParagraph";
export type SerializedEmailTextNode = Spread<
  {
    caption: SerializedEditor;
    type: ReturnType<typeof EmailTextNode.getType>;
  },
  SerializedLexicalNode
>;
//reuse this or nodes in SectionNodeComponent so we don't have to add new nodes in both places
const createEmailTextNodeEditor = () =>
  createEditor({
    nodes: [EmailParagraphNode],
  });
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

    this.__caption = caption || createEmailTextNodeEditor();

    // this.__caption.update(() => {
    //   const root = $getRoot();
    //   const paragraphNode = $createCustomParagraphNode();
    //   // const textNode = $createTextNode("I'm some text");
    //   paragraphNode.append(textNode);
    //   root.append(paragraphNode);
    // });
  }

  static importJSON(serializedNode: SerializedEmailTextNode): EmailTextNode {
    const { caption } = serializedNode;
    const node = $createEmailTextNode();
    const nestedEditor = node.__caption;
    const editorState = nestedEditor.parseEditorState(caption.editorState);
    console.log({ editorState });
    if (!editorState.isEmpty()) {
      nestedEditor.setEditorState(editorState);
    }
    return node;
  }

  exportJSON(): SerializedEmailTextNode {
    return {
      ...super.exportJSON(),
      caption: this.__caption.toJSON(),
      type: EmailTextNode.getType(),
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

export function $createEmailTextNode(): EmailTextNode {
  return new EmailTextNode();
}

export function $isEmailTextNode(
  node: LexicalNode | null | undefined
): node is EmailTextNode {
  return node instanceof EmailTextNode;
}
