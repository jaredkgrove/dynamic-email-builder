import {
  createEditor,
  DecoratorNode,
  DOMExportOutput,
  LexicalEditor,
  LexicalNode,
  LexicalUpdateJSON,
  NodeKey,
  SerializedEditor,
  SerializedLexicalNode,
  Spread,
} from "lexical";
import { ReactNode } from "react";
import SelectableTableNodeComponent from "./SelectableTableNodeComponent";
import { $generateHtmlFromNodes } from "@lexical/html";
import { EmailParagraphNode } from "../EmailParagraph";
import Selectable from "@/components/SelectableNodeComponent";
import ReactDOMServer from "react-dom/server";
import { v4 as uuidv4 } from "uuid";
import TableWrapper from "@/components/TableWrapper";
export type SerializedSelectableTableNode = Spread<
  {
    textAlign: "center" | "left" | "right";
    type: ReturnType<typeof SelectableTableNode.getType>;
  },
  SerializedLexicalNode
>;
//reuse this or nodes in SectionNodeComponent so we don't have to add new nodes in both places
const DEFAULT_TEXT_ALIGN = "left";

export class SelectableTableNode extends DecoratorNode<ReactNode> {
  __textAlign?: "center" | "left" | "right";
  static getType(): string {
    return "EmailText";
  }

  static clone(node: SelectableTableNode): SelectableTableNode {
    return new SelectableTableNode(node.__textAlign, node.__key);
  }

  constructor(textAlign?: "center" | "left" | "right", key?: NodeKey) {
    super(key);
    this.__textAlign = textAlign || DEFAULT_TEXT_ALIGN; //todo text align seems to get stripped, move this to SectionNode or maybe stop caring about html warnings
  }

  static importJSON(
    serializedNode: SerializedSelectableTableNode
  ): SelectableTableNode {
    return $createSelectableTableNode().updateFromJSON(serializedNode);
  }

  exportJSON(): SerializedSelectableTableNode {
    return {
      ...super.exportJSON(),
      textAlign: this.getTextAlign(),
      type: SelectableTableNode.getType(),
    };
  }

  createDOM(): HTMLElement {
    //TODO: should this be a Section or something? (i don't think so, pretty sure it just uses decorate)
    return document.createElement("div");
  }

  getOuterHtml(): DOMExportOutput {
    const uuid = uuidv4();
    const outerHtml = ReactDOMServer.renderToStaticMarkup(
      <TableWrapper textAlign={this.getTextAlign()}>{uuid}</TableWrapper>
    );

    // const template = document.createElement("template");
    // const nodeHtml = lexicalHtml.trim(); // Never return a text node of whitespace as the result
    // template.innerHTML = nodeHtml.trim();
    // return { element: template.content };

    let nodeHtml = outerHtml.split(uuid).join(lexicalHtml);

    const template = document.createElement("template");
    nodeHtml = nodeHtml.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = nodeHtml.trim();
    return { element: template.content.firstElementChild as HTMLElement };
  }

  updateDOM(): false {
    return false;
  }

  decorate(): ReactNode {
    return (
      <Selectable node={this}>
        <TableWrapper textAlign={this.getTextAlign()}>
          <SelectableTableNodeComponent caption={this.__caption} />
        </TableWrapper>
      </Selectable>
    );
  }

  updateFromJSON(
    serializedNode: LexicalUpdateJSON<SerializedSelectableTableNode>
  ): this {
    const { textAlign } = serializedNode;
    return super.updateFromJSON(serializedNode).setTextAlign(textAlign);
    // .setTextAlign(textAlign);
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

export function $createSelectableTableNode(): SelectableTableNode {
  return new SelectableTableNode();
}

export function $isSelectableTableNode(
  node: LexicalNode | null | undefined
): node is SelectableTableNode {
  return node instanceof SelectableTableNode;
}
