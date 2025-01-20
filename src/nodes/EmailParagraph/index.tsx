import { Text } from "@react-email/components";
import {
  LexicalNode,
  ParagraphNode,
  SerializedLexicalNode,
  Spread,
} from "lexical";
import ReactDOMServer from "react-dom/server";

export type SerializedParagraphNode = Spread<
  {
    fontSize: number;
    type: ReturnType<typeof CustomParagraphNode.getType>;
    version: 1;
  },
  SerializedLexicalNode
>;

export class CustomParagraphNode extends ParagraphNode {
  __fontSize?: number;
  __alignText?: number;

  constructor(fontSize?: number, key?: string) {
    super(key);
    this.__fontSize = fontSize;
  }

  static getType() {
    return "custom-paragraph";
  }

  static clone(node: CustomParagraphNode) {
    return new CustomParagraphNode(node.__fontSize, node.__key);
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
    prevNode: CustomParagraphNode
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
  }

  getFontSize(): number | undefined {
    // getLatest() ensures we are getting the most
    // up-to-date value from the EditorState.
    const self = this.getLatest();
    return self.__fontSize;
  }
}

export function $createCustomParagraphNode(): CustomParagraphNode {
  return new CustomParagraphNode();
}

export function $isCustomParagraphNode(
  node: LexicalNode | null | undefined
): node is CustomParagraphNode {
  return node instanceof CustomParagraphNode;
}
