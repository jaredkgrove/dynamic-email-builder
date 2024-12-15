import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { LexicalNestedComposer } from "@lexical/react/LexicalNestedComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { Row, Section } from "@react-email/components";
import {
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  LexicalEditor,
  $nodesOfType,
  LexicalCommand,
} from "lexical";
import { useEffect } from "react";
import { CustomParagraphNode } from "./customParagraphNode";
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";

//consider making EmailText a node that extends TextNode instead of being a decorator node. Then it gets used by lexical instead of regular TextNode
const EmailTextNodeComponent = ({ caption }: { caption: LexicalEditor }) => {
  return (
    <LexicalNestedComposer
      initialEditor={caption}
      //TODO use this to limit nodes allowed. Also maybe can use to auto-replace paragraph node with Text?
      // initialNodes={[RootNode, TextNode, LineBreakNode, CustomParagraphNode]}
    >
      <FontSizePlugin />
      <RichTextPlugin
        contentEditable={
          <Section>
            <Row>
              <ContentEditable />
            </Row>
          </Section>
        }
        ErrorBoundary={LexicalErrorBoundary}
      />
      {/* <PlainTextPlugin
        contentEditable={
          <Section>
            <Row>
              <ContentEditable />
            </Row>
          </Section>
        }
        ErrorBoundary={LexicalErrorBoundary}
      /> */}
    </LexicalNestedComposer>
  );
};

export default EmailTextNodeComponent;

export const SET_FONT_SIZE_COMMAND: LexicalCommand<number> = createCommand();

export function FontSizePlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([CustomParagraphNode])) {
      throw new Error(
        "TwitterPlugin: TweetNode not registered on editor (initialConfig.nodes)"
      );
    }

    return editor.registerCommand<number>(
      SET_FONT_SIZE_COMMAND,
      (fontSize) => {
        const customParagraphNodes = $nodesOfType(CustomParagraphNode);
        console.log("SET_FONT_SIZE_COMMAND ", fontSize);
        customParagraphNodes.forEach((n) => n.setFontSize(fontSize));

        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [editor]);

  const handleChangeFontSize = () => {
    editor.dispatchCommand(SET_FONT_SIZE_COMMAND, 96);
  };

  return <div onClick={handleChangeFontSize}>change font size</div>;
}
