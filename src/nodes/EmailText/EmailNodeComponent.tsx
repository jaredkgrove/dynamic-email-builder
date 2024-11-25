import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { LexicalNestedComposer } from "@lexical/react/LexicalNestedComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { Text } from "@react-email/components";
import {
  LexicalEditor,
  LineBreakNode,
  ParagraphNode,
  RootNode,
  TextNode,
} from "lexical";

//consider making EmailText a node that extends TextNode instead of being a decorator node. Then it gets used by lexical instead of regular TextNode
const EmailTextNodeComponent = ({ caption }: { caption: LexicalEditor }) => {
  return (
    <LexicalNestedComposer
      initialEditor={caption}
      initialNodes={[RootNode, TextNode, LineBreakNode, ParagraphNode]}
    >
      <RichTextPlugin
        contentEditable={
          <Text>
            <ContentEditable />
          </Text>
        }
        ErrorBoundary={LexicalErrorBoundary}
      />
    </LexicalNestedComposer>
  );
};

export default EmailTextNodeComponent;
