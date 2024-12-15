import {
  EditorConfig,
  LexicalNode,
  ParagraphNode,
  SerializedLexicalNode,
  Spread,
} from "lexical";

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

  createDOM(config: EditorConfig) {
    //TODO: consider not using <Text /> component, it's really just a <p/> tag with some styling
    // then we wouldn't need renderToStaticMarkup either
    // const dom = super.createDOM(config);
    // let html = ReactDOMServer.renderToStaticMarkup(
    //   <Text
    //     style={{
    //       fontSize: this.__fontSize,
    //       // lineHeight: this.__fontSize ? `${this.__fontSize}px` : undefined,
    //       color: "blue",
    //     }}
    //   />
    // );

    // const template = document.createElement("template");
    // html = html.trim(); // Never return a text node of whitespace as the result
    // template.innerHTML = html;
    // return template.content.firstElementChild as HTMLElement; //TODO
    const fontSize = this.getFontSize() || 14;
    const lineHeight = fontSize;
    const p = super.createDOM(config);
    p.setAttribute(
      "style",
      `font-size:${fontSize}px; line-height:${lineHeight}px; margin: 0; padding:0;`
    );
    return p;
  }

  updateDOM(
    prevNode: CustomParagraphNode,
    dom: HTMLElement,
    config: EditorConfig
  ): boolean {
    //TODO only true if stuff changes maybe?
    console.log(prevNode.__fontSize, this.getFontSize());
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
