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
import { EmailColumn, EmailSectionAndRow } from "./SectionNodeComponent";
import { $generateHtmlFromNodes } from "@lexical/html";
import ReactDOMServer from "react-dom/server";
import { v4 as uuidv4 } from "uuid";
import EmailSectionNodeComponent from "./SectionNodeComponent";
import { EmailTextNode } from "../EmailText";
import { EmailImageNode } from "../EmailImage";
export type SerializedSectionNode = Spread<
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

    this.__caption_1 = caption_1 || createSectionNodeEditor();
    this.__caption_2 = caption_2;
  }

  static importJSON(serializedNode: SerializedSectionNode): SectionNode {
    return $createSectionNode().updateFromJSON(serializedNode);
  }

  setCaption1(editor: SerializedEditor) {
    const self = this.getWritable();
    const editorState1 = self.__caption_1.parseEditorState(editor.editorState);
    if (!editorState1.isEmpty()) {
      self.__caption_1.setEditorState(editorState1);
    }
    return self;
  }

  getCaption1(): LexicalEditor {
    const self = this.getLatest();
    return self.__caption_1;
  }

  setCaption2(editor: SerializedEditor | undefined) {
    const self = this.getWritable();
    if (!editor) {
      return self;
    }
    if (!self.__caption_2) {
      self.__caption_2 = createSectionNodeEditor();
    }
    const editorState1 = self.__caption_2.parseEditorState(editor.editorState);
    if (!editorState1.isEmpty()) {
      self.__caption_2.setEditorState(editorState1);
    }
    return self;
  }

  getCaption2(): LexicalEditor | undefined {
    const self = this.getLatest();
    return self.__caption_2;
  }

  updateFromJSON(
    serializedNode: LexicalUpdateJSON<SerializedSectionNode>
  ): this {
    return super
      .updateFromJSON(serializedNode)
      .setCaption1(serializedNode.caption_1)
      .setCaption2(serializedNode.caption_2);
  }

  exportJSON(): SerializedSectionNode {
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

//reuse this or nodes in SectionNodeComponent so we don't have to add new nodes in both places
const createSectionNodeEditor = () =>
  createEditor({
    nodes: [EmailTextNode, EmailImageNode],
  });

export function $createSectionNode(columnCount: 1 | 2 = 1): SectionNode {
  if (columnCount === 2) {
    return new SectionNode(
      createSectionNodeEditor(),
      createSectionNodeEditor()
    );
  }
  return new SectionNode(createSectionNodeEditor());
}

export function $isSectionNode(
  node: LexicalNode | null | undefined
): node is SectionNode {
  return node instanceof SectionNode;
}
