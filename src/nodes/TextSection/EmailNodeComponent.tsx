import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { LexicalNestedComposer } from "@lexical/react/LexicalNestedComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { Column, Row, Section } from "@react-email/components";
import { LexicalEditor } from "lexical";

import { ToolbarPlugin } from "../../plugins/toolbar";
import { ReactNode } from "react";

//consider making EmailText a node that extends TextNode instead of being a decorator node. Then it gets used by lexical instead of regular TextNode
const EmailTextNodeComponent = ({ caption }: { caption: LexicalEditor }) => {
  return (
    <LexicalNestedComposer
      initialEditor={caption}
      //TODO use this to limit nodes allowed. Also maybe can use to auto-replace paragraph node with Text?
      // initialNodes={[RootNode, TextNode, LineBreakNode, CustomParagraphNode]}
    >
      <ToolbarPlugin />
      <RichTextPlugin
        contentEditable={
          <EmailTextWrapper>
            <ContentEditable
              aria-placeholder="Add some text"
              placeholder={
                <div
                  style={{
                    position: "absolute",
                    top: "0px",
                    left: "0px",
                    pointerEvents: "none",
                  }}
                >
                  Add some text
                </div>
              }
            />
          </EmailTextWrapper>
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

export const EmailTextWrapper = ({ children }: { children: ReactNode }) => {
  //TODO: handle fonts
  return (
    <Section>
      <Row style={{ position: "relative" }}>
        <Column>{children}</Column>
      </Row>
    </Section>
  );
};
