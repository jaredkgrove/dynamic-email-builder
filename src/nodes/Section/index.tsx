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
import { EmailColumn, EmailSectionAndRow } from "./SectionNodeComponent";
import { $generateHtmlFromNodes } from "@lexical/html";
import ReactDOMServer from "react-dom/server";
import { v4 as uuidv4 } from "uuid";
import EmailSectionNodeComponent from "./SectionNodeComponent";
export type SerializedVidoeNode = Spread<
  {
    caption_1: SerializedEditor;
    caption_2?: SerializedEditor;
    type: ReturnType<typeof SectionNode.getType>;
    version: 1;
  },
  SerializedLexicalNode
>;

export class SectionNode extends DecoratorNode<ReactNode> {
  __caption_1: LexicalEditor;
  __caption_2?: LexicalEditor;
  static getType(): string {
    return "Section";
  }

  static clone(node: SectionNode): SectionNode {
    return new SectionNode(node.__caption_1, node.__caption_2, node.__key);
  }

  constructor(
    caption_1?: LexicalEditor,
    caption_2?: LexicalEditor,
    key?: NodeKey
  ) {
    super(key);

    this.__caption_1 =
      caption_1 ||
      createEditor({
        nodes: [],
      });
    this.__caption_2 = caption_2;
  }

  static importJSON(serializedNode: SerializedVidoeNode): SectionNode {
    //This is broke, fix it when doing serialization stuff
    const { caption_1 } = serializedNode;
    const node = $createSectionNode();
    const nestedEditor1 = node.__caption_1;
    const editorState1 = nestedEditor1.parseEditorState(caption_1.editorState);
    if (!editorState1.isEmpty()) {
      nestedEditor1.setEditorState(editorState1);
    }
    // const nestedEditor2 = node.__caption_2;
    // const editorState2 = nestedEditor1.parseEditorState(caption_2.editorState);
    // if (!editorState2.isEmpty()) {
    //   nestedEditor2?.setEditorState(editorState2);
    // }
    return node;
  }

  exportJSON(): SerializedVidoeNode {
    return {
      caption_1: this.__caption_1.toJSON(),
      caption_2: this.__caption_2?.toJSON(),
      type: SectionNode.getType(),
      version: 1,
    };
  }

  createDOM(): HTMLElement {
    //TODO: should this be a Section or something? (i don't think so, pretty sure it just uses decorate)
    return document.createElement("div");
  }

  exportDOM(editor: LexicalEditor): DOMExportOutput {
    const lexicalHtml1 = this.__caption_1
      .getEditorState()
      .read(() => $generateHtmlFromNodes(this.__caption_1, null));
    const lexicalHtml2 = this.__caption_2
      ?.getEditorState()
      .read(() =>
        this.__caption_2
          ? $generateHtmlFromNodes(this.__caption_2, null)
          : undefined
      );
    const uuid1 = uuidv4();
    const uuid2 = uuidv4();

    let outerHtml: string;
    if (this.__caption_2) {
      outerHtml = ReactDOMServer.renderToStaticMarkup(
        <EmailSectionAndRow>
          <EmailColumn>{uuid1}</EmailColumn>
          <EmailColumn>{uuid2}</EmailColumn>
        </EmailSectionAndRow>
      );
    } else {
      outerHtml = ReactDOMServer.renderToStaticMarkup(
        <EmailSectionAndRow>
          <EmailColumn>{uuid1}</EmailColumn>
        </EmailSectionAndRow>
      );
    }

    let nodeHtml = outerHtml.split(uuid1).join(lexicalHtml1);
    nodeHtml = nodeHtml.split(uuid2).join(lexicalHtml2);

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
      <EmailSectionNodeComponent
        caption_1={this.__caption_1}
        caption_2={this.__caption_2}
      />
    );
  }
}

export function $createSectionNode(columnCount: 1 | 2 = 1): SectionNode {
  if (columnCount === 2) {
    return new SectionNode(
      createEditor({
        nodes: [],
      }),
      createEditor({
        nodes: [],
      })
    );
  }
  return new SectionNode(
    createEditor({
      nodes: [],
    })
  );
}

export function $isSectionNode(
  node: LexicalNode | null | undefined
): node is SectionNode {
  return node instanceof SectionNode;
}
