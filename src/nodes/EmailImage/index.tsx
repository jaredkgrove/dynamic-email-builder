import {
  DecoratorNode,
  DOMExportOutput,
  LexicalEditor,
  LexicalNode,
  LexicalUpdateJSON,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from "lexical";
import ReactDOMServer from "react-dom/server";

import { ReactNode } from "react";
import EmailImageNodeComponent from "./EmailImageNodeComponent";
import Selectable from "@/components/SelectableNodeComponent";
export type SerializedEmailImageNode = Spread<
  {
    type: ReturnType<typeof EmailImageNode.getType>;
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

  static importJSON(serializedNode: SerializedEmailImageNode): EmailImageNode {
    return $createEmailImageNode().updateFromJSON(serializedNode);
  }

  updateFromJSON(
    serializedNode: LexicalUpdateJSON<SerializedEmailImageNode>
  ): this {
    console.log("email image node ", serializedNode);

    return super.updateFromJSON(serializedNode);
  }

  exportJSON(): SerializedEmailImageNode {
    return {
      ...super.exportJSON(),
      type: EmailImageNode.getType(),
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
    return (
      <Selectable node={this}>
        <EmailImageNodeComponent />
      </Selectable>
    );
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
