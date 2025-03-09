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
import TableWrapper from "@/components/TableWrapper";
export type SerializedEmailImageNode = Spread<
  {
    textAlign: "center" | "left" | "right";

    type: ReturnType<typeof EmailImageNode.getType>;
  },
  SerializedLexicalNode
>;
const DEFAULT_TEXT_ALIGN = "center";

export class EmailImageNode extends DecoratorNode<ReactNode> {
  __textAlign?: "center" | "left" | "right";

  static getType(): string {
    return "EmailImage";
  }

  static clone(node: EmailImageNode): EmailImageNode {
    return new EmailImageNode(node.__textAlign, node.__key);
  }

  constructor(textAlign?: "center" | "left" | "right", key?: NodeKey) {
    super(key);
    this.__textAlign = textAlign || DEFAULT_TEXT_ALIGN; //todo text align seems to get stripped, move this to SectionNode or maybe stop caring about html warnings

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
    const { textAlign } = serializedNode;
    return super.updateFromJSON(serializedNode).setTextAlign(textAlign);
  }

  exportJSON(): SerializedEmailImageNode {
    return {
      ...super.exportJSON(),
      textAlign: this.getTextAlign(),
      type: EmailImageNode.getType(),
    };
  }

  createDOM(): HTMLElement {
    //TODO: should this be a Section or something? (i don't think so, pretty sure it just uses decorate)
    return document.createElement("div");
  }

  exportDOM(editor: LexicalEditor): DOMExportOutput {
    const lexicalHtml = ReactDOMServer.renderToStaticMarkup(
      <TableWrapper textAlign={this.getTextAlign()}>
        <EmailImageNodeComponent />
      </TableWrapper>
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
    console.log("woop ", this.getTextAlign());
    return (
      <Selectable node={this}>
        <TableWrapper textAlign={this.getTextAlign()}>
          <EmailImageNodeComponent />
        </TableWrapper>
      </Selectable>
    );
  }

  setTextAlign(textAlign: "center" | "left" | "right") {
    const self = this.getWritable();
    self.__textAlign = textAlign;
    return self;
  }

  getTextAlign(): "center" | "left" | "right" {
    // getLatest() ensures we are getting the most
    // up-to-date value from the EditorState.
    const self = this.getLatest();
    return self.__textAlign || DEFAULT_TEXT_ALIGN;
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
