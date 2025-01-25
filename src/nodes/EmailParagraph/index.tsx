import { Text } from "@react-email/components";
import {
  LexicalNode,
  LexicalUpdateJSON,
  ParagraphNode,
  SerializedParagraphNode,
  Spread,
} from "lexical";
import ReactDOMServer from "react-dom/server";

export type SerializedEmailParagraphNode = Spread<
  {
    fontSize: number;
    type: ReturnType<typeof EmailParagraphNode.getType>;
  },
  SerializedParagraphNode
>;

export class EmailParagraphNode extends ParagraphNode {
  __fontSize: number;
  __alignText?: number;

  constructor(fontSize?: number, key?: string) {
    super(key);
    this.__fontSize = fontSize || 14; //todo
  }

  static getType() {
    return "email-paragraph";
  }

  static clone(node: EmailParagraphNode) {
    return new EmailParagraphNode(node.__fontSize, node.__key);
  }

  createDOM() {
    //TODO: consider not using <Text /> component, it's really just a <p/> tag with some styling
    const fontSize = this.getFontSize() || 14;

    let html = ReactDOMServer.renderToStaticMarkup(
      <Text
        style={{
          fontSize: fontSize,
          lineHeight: `${fontSize}px`,
        }}
      />
    );
    const template = document.createElement("template");
    html = html.trim();
    template.innerHTML = html;
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
    return self.__fontSize;
  }
  static importJSON(
    serializedNode: SerializedEmailParagraphNode
  ): EmailParagraphNode {
    return $createEmailParagraphNode().updateFromJSON(serializedNode);
  }

  updateFromJSON(
    serializedNode: LexicalUpdateJSON<SerializedEmailParagraphNode>
  ): this {
    const { fontSize } = serializedNode;
    return super.updateFromJSON(serializedNode).setFontSize(fontSize);
  }
  exportJSON(): SerializedEmailParagraphNode {
    return {
      ...super.exportJSON(),
      fontSize: this.getFontSize(),
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
