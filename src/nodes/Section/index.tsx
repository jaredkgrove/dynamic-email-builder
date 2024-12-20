import {
  createEditor,
  DecoratorNode,
  DOMExportOutput,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  SerializedEditor,
  SerializedLexicalNode,
  Spread,
} from "lexical";
import { ReactNode } from "react";
import { EmailSectionWrapper } from "./SectionNodeComponent";
import { $generateHtmlFromNodes } from "@lexical/html";
import * as ReactDomServer from "react-dom/server";
import { v4 as uuidv4 } from "uuid";
import EmailSectionNodeComponent from "./SectionNodeComponent";
export type SerializedVidoeNode = Spread<
  {
    caption: SerializedEditor;
    type: ReturnType<typeof SectionNode.getType>;
    version: 1;
  },
  SerializedLexicalNode
>;

export class SectionNode extends DecoratorNode<ReactNode> {
  __caption: LexicalEditor;
  static getType(): string {
    return "Section";
  }

  static clone(node: SectionNode): SectionNode {
    return new SectionNode(node.__caption, node.__key);
  }

  constructor(caption?: LexicalEditor, key?: NodeKey) {
    super(key);

    this.__caption =
      caption ||
      createEditor({
        nodes: [],
      });
  }

  static importJSON(serializedNode: SerializedVidoeNode): SectionNode {
    const { caption } = serializedNode;
    const node = $createSectionNode();
    const nestedEditor = node.__caption;
    const editorState = nestedEditor.parseEditorState(caption.editorState);
    if (!editorState.isEmpty()) {
      nestedEditor.setEditorState(editorState);
    }
    return node;
  }

  exportJSON(): SerializedVidoeNode {
    return {
      caption: this.__caption.toJSON(),
      type: SectionNode.getType(),
      version: 1,
    };
  }

  createDOM(): HTMLElement {
    //TODO: should this be a Section or something? (i don't think so, pretty sure it just uses decorate)
    return document.createElement("div");
  }

  exportDOM(editor: LexicalEditor): DOMExportOutput {
    const lexicalHtml = this.__caption
      .getEditorState()
      .read(() => $generateHtmlFromNodes(this.__caption, null));
    const uuid = uuidv4();

    const outerHtml = ReactDomServer.renderToStaticMarkup(
      <EmailSectionWrapper>{uuid}</EmailSectionWrapper>
    );
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
    return <EmailSectionNodeComponent caption={this.__caption} />;
  }
}

export function $createSectionNode(): SectionNode {
  return new SectionNode();
}

export function $isSectionNode(
  node: LexicalNode | null | undefined
): node is SectionNode {
  return node instanceof SectionNode;
}
