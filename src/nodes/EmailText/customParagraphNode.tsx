import { EditorConfig, LexicalNode, ParagraphNode } from "lexical";

import { Column, Row, Section, Text } from "@react-email/components";
import ReactDOMServer from "react-dom/server";
export class CustomParagraphNode extends ParagraphNode {
  static getType() {
    return "custom-paragraph";
  }

  static clone(node: LexicalNode) {
    return new CustomParagraphNode(node.__key);
  }

  createDOM(config: EditorConfig) {
    // const dom = super.createDOM(config);
    let html = ReactDOMServer.renderToStaticMarkup(
      <Text
        style={{
          color: "rgb(129,140,248)",
          fontSize: 24,
          lineHeight: "32px",
          fontWeight: 600,
        }}
      />
    );

    const template = document.createElement("template");
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstElementChild as HTMLElement; //TODO
  }
}
