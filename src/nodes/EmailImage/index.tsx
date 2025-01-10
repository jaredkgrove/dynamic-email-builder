import {
  DecoratorNode,
  DOMExportOutput,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from "lexical";
import ReactDOMServer from "react-dom/server";

import { ReactNode } from "react";
import EmailImageNodeComponent from "./EmailImageNodeComponent";
export type SerializedVidoeNode = Spread<
  {
    type: ReturnType<typeof EmailImageNode.getType>;
    version: 1;
  },
  SerializedLexicalNode
>;

export class EmailImageNode extends DecoratorNode<ReactNode> {
  static getType(): string {
    return "EmailImage";
  }

  static clone(node: EmailImageNode): EmailImageNode {
    return new EmailImageNode(node.__key);
  }

  constructor(key?: NodeKey) {
    super(key);

    // this.__caption.update(() => {
    //   const root = $getRoot();
    //   const paragraphNode = $createCustomParagraphNode();
    //   // const textNode = $createTextNode("I'm some text");
    //   paragraphNode.append(textNode);
    //   root.append(paragraphNode);
    // });
  }

  static importJSON(serializedNode: SerializedVidoeNode): EmailImageNode {
    // const {  } = serializedNode;
    const node = $createEmailImageNode();
    // const nestedEditor = node.__caption;
    // const editorState = nestedEditor.parseEditorState(caption.editorState);
    // if (!editorState.isEmpty()) {
    //   nestedEditor.setEditorState(editorState);
    // }
    return node;
  }

  exportJSON(): SerializedVidoeNode {
    return {
      type: EmailImageNode.getType(),
      version: 1,
    };
  }

  createDOM(): HTMLElement {
    //TODO: should this be a Section or something? (i don't think so, pretty sure it just uses decorate)
    return document.createElement("div");
  }

  exportDOM(editor: LexicalEditor): DOMExportOutput {
    const lexicalHtml = ReactDOMServer.renderToStaticMarkup(
      <EmailImageNodeComponent />
    );
    const template = document.createElement("template");
    const nodeHtml = lexicalHtml.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = nodeHtml.trim();
    return { element: template.content };
  }

  updateDOM(): false {
    return false;
  }

  decorate(): ReactNode {
    return <EmailImageNodeComponent />;
  }
}

export function $createEmailImageNode(): EmailImageNode {
  return new EmailImageNode();
}

export function $isEmailImageNode(
  node: LexicalNode | null | undefined
): node is EmailImageNode {
  return node instanceof EmailImageNode;
}
