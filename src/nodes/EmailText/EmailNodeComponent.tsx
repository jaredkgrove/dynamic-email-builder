import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { LexicalNestedComposer } from "@lexical/react/LexicalNestedComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { Column, Row, Section, Text } from "@react-email/components";
import {
  LexicalEditor,
  LineBreakNode,
  ParagraphNode,
  RootNode,
  TextNode,
} from "lexical";
import { CustomParagraphNode } from "../../EmailEditor";

//consider making EmailText a node that extends TextNode instead of being a decorator node. Then it gets used by lexical instead of regular TextNode
const EmailTextNodeComponent = ({ caption }: { caption: LexicalEditor }) => {
  return (
    <LexicalNestedComposer
      initialEditor={caption}
      //TODO use this to limit nodes allowed. Also maybe can use to auto-replace paragraph node with Text?
      // initialNodes={[RootNode, TextNode, LineBreakNode, CustomParagraphNode]}
    >
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
    </LexicalNestedComposer>
  );
};

export default EmailTextNodeComponent;
