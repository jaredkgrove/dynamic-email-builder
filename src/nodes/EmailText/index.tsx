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
import EmailTextNodeComponent from "./EmailTextNodeComponent";
import { $generateHtmlFromNodes } from "@lexical/html";
import { EmailParagraphNode } from "../EmailParagraph";
import Selectable from "@/components/SelectableNodeComponent";
import ReactDOMServer from "react-dom/server";
import { v4 as uuidv4 } from "uuid";
import TableWrapper from "@/components/TableWrapper";
export type SerializedEmailTextNode = Spread<
  {
    caption: SerializedEditor;
    textAlign: "center" | "left" | "right";
    type: ReturnType<typeof EmailTextNode.getType>;
  },
  SerializedLexicalNode
>;
//reuse this or nodes in SectionNodeComponent so we don't have to add new nodes in both places
const DEFAULT_TEXT_ALIGN = "left";
const createEmailTextNodeEditor = () =>
  createEditor({
    nodes: [EmailParagraphNode],
  });
export class EmailTextNode extends DecoratorNode<ReactNode> {
  __caption: LexicalEditor;
  __textAlign?: "center" | "left" | "right";
  static getType(): string {
    return "EmailText";
  }

  static clone(node: EmailTextNode): EmailTextNode {
    return new EmailTextNode(node.__caption, node.__textAlign, node.__key);
  }

  constructor(
    caption?: LexicalEditor,
    textAlign?: "center" | "left" | "right",
    key?: NodeKey
  ) {
    super(key);

    this.__caption = caption || createEmailTextNodeEditor();
    this.__textAlign = textAlign || DEFAULT_TEXT_ALIGN; //todo text align seems to get stripped, move this to SectionNode or maybe stop caring about html warnings

    // this.__caption.update(() => {
    //   const root = $getRoot();
    //   const paragraphNode = $createCustomParagraphNode();
    //   // const textNode = $createTextNode("I'm some text");
    //   paragraphNode.append(textNode);
    //   root.append(paragraphNode);
    // });
  }

  static importJSON(serializedNode: SerializedEmailTextNode): EmailTextNode {
    //TODO use updateFromJSON
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
      textAlign: this.getTextAlign(),
      type: EmailTextNode.getType(),
    };
  }

  createDOM(): HTMLElement {
    //TODO: should this be a Section or something? (i don't think so, pretty sure it just uses decorate)
    return document.createElement("div");
  }

  exportDOM(): DOMExportOutput {
    const lexicalHtml = this.__caption
      .getEditorState()
      .read(() => $generateHtmlFromNodes(this.__caption, null));
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
          <EmailTextNodeComponent caption={this.__caption} />
        </TableWrapper>
      </Selectable>
    );
  }

  updateFromJSON(
    serializedNode: LexicalUpdateJSON<SerializedEmailTextNode>
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

export function $createEmailTextNode(): EmailTextNode {
  return new EmailTextNode();
}

export function $isEmailTextNode(
  node: LexicalNode | null | undefined
): node is EmailTextNode {
  return node instanceof EmailTextNode;
}
