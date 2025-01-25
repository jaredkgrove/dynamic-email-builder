import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { LexicalNestedComposer } from "@lexical/react/LexicalNestedComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { LexicalEditor, ParagraphNode } from "lexical";

import { ToolbarPlugin } from "../../plugins/toolbar";
import { EmailParagraphNode } from "../EmailParagraph";
import { ActiveEditorStatePlugin } from "@/plugins/activeEditorState";

//consider making EmailText a node that extends TextNode instead of being a decorator node. Then it gets used by lexical instead of regular TextNode
const EmailTextNodeComponent = ({ caption }: { caption: LexicalEditor }) => {
  return (
    <LexicalNestedComposer
      initialEditor={caption}
      //TODO use this to limit nodes allowed. Also maybe can use to auto-replace paragraph node with Text?
      initialNodes={[
        EmailParagraphNode,
        EmailParagraphNode,
        {
          replace: ParagraphNode,
          with: () => {
            return new EmailParagraphNode();
          },
          withKlass: EmailParagraphNode,
        },
      ]}
    >
      <ToolbarPlugin />
      <RichTextPlugin
        contentEditable={
          <ContentEditable
            aria-placeholder="Add some text"
            className="outline-none"
            placeholder={
              <div className="absolute top-0 pointer-events-none">
                Add some text
              </div>
            }
          />
        }
        ErrorBoundary={LexicalErrorBoundary}
      />
      <ActiveEditorStatePlugin />

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
