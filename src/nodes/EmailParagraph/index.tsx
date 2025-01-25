import { Text } from "@react-email/components";
import {
  LexicalNode,
  LexicalUpdateJSON,
  ParagraphNode,
  SerializedParagraphNode,
  Spread,
} from "lexical";
import ReactDOMServer from "react-dom/server";
import { Property } from "csstype";

export type SerializedEmailParagraphNode = Spread<
  {
    fontSize: number;
    textAlign: Property.TextAlign;
    type: ReturnType<typeof EmailParagraphNode.getType>;
  },
  SerializedParagraphNode
>;

//TODO lexical recommends not serializing default to make smaller json, right now we serialize these values I think
const DEFAULT_FONT_SIZE = 14;
const DEFAULT_TEXT_ALIGN = "left";
export class EmailParagraphNode extends ParagraphNode {
  __fontSize?: number;
  __textAlign?: Property.TextAlign;

  constructor(fontSize?: number, textAlign?: Property.TextAlign, key?: string) {
    super(key);
    this.__fontSize = fontSize || DEFAULT_FONT_SIZE; //todo
    this.__textAlign = textAlign || DEFAULT_TEXT_ALIGN; //todo
  }

  static getType() {
    return "email-paragraph";
  }

  static clone(node: EmailParagraphNode) {
    return new EmailParagraphNode(
      node.__fontSize,
      node.__textAlign,
      node.__key
    );
  }

  createDOM() {
    //TODO: consider not using <Text /> component, it's really just a <p/> tag with some styling
    const fontSize = this.getFontSize();
    const textAlign = this.getTextAlign();

    let html = ReactDOMServer.renderToStaticMarkup(
      <Text
        style={{
          fontSize: fontSize,
          lineHeight: `${fontSize}px`,
          textAlign,
        }}
      />
    );
    const template = document.createElement("template");
    html = html.trim();
    template.innerHTML = html;
    console.log({
      html,
      firstElementChild: template.content.firstElementChild,
    });

    return template.content.firstElementChild as HTMLElement; //TODO
    // const lineHeight = fontSize;
    // const p = super.createDOM(config);
    // p.setAttribute(
    //   "style",
    //   `font-size:${fontSize}px; line-height:${lineHeight}px; margin: 0; padding:0;`
    // );
    // return p;
  }

  updateDOM(
    prevNode: EmailParagraphNode
    // dom: HTMLElement,
    // config: EditorConfig
  ): boolean {
    //TODO only true if stuff changes maybe?
    // console.log(prevNode.__fontSize, this.getFontSize());
    return true;
  }

  setFontSize(fontSize: number) {
    const self = this.getWritable();
    self.__fontSize = fontSize;
    return self;
  }

  getFontSize(): number {
    // getLatest() ensures we are getting the most
    // up-to-date value from the EditorState.
    const self = this.getLatest();
    return self.__fontSize || DEFAULT_FONT_SIZE;
  }

  setTextAlign(textAlign: Property.TextAlign) {
    const self = this.getWritable();
    self.__textAlign = textAlign;
    return self;
  }

  getTextAlign(): Property.TextAlign {
    // getLatest() ensures we are getting the most
    // up-to-date value from the EditorState.
    const self = this.getLatest();
    return self.__textAlign || DEFAULT_TEXT_ALIGN;
  }
  static importJSON(
    serializedNode: SerializedEmailParagraphNode
  ): EmailParagraphNode {
    return $createEmailParagraphNode().updateFromJSON(serializedNode);
  }

  updateFromJSON(
    serializedNode: LexicalUpdateJSON<SerializedEmailParagraphNode>
  ): this {
    const { fontSize, textAlign } = serializedNode;
    return super
      .updateFromJSON(serializedNode)
      .setFontSize(fontSize)
      .setTextAlign(textAlign);
  }
  exportJSON(): SerializedEmailParagraphNode {
    return {
      ...super.exportJSON(),
      fontSize: this.getFontSize(),
      textAlign: this.getTextAlign(),
      type: this.getType(),
    };
  }
}

export function $createEmailParagraphNode(): EmailParagraphNode {
  return new EmailParagraphNode();
}

export function $isEmailParagraphNode(
  node: LexicalNode | null | undefined
): node is EmailParagraphNode {
  return node instanceof EmailParagraphNode;
}
