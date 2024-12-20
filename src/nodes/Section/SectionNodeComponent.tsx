import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { LexicalNestedComposer } from "@lexical/react/LexicalNestedComposer";
import { Column, Row, Section } from "@react-email/components";
import { $getRoot, LexicalEditor } from "lexical";

import React, { useCallback } from "react";
import { useDecorators } from "@/EmailBuilderPlugin/useDecorators";
import { $createEmailTextNode, TextSectionNode } from "../TextSection";

const EmailSectionNodeComponent = ({ caption }: { caption: LexicalEditor }) => {
  const decorators = useDecorators(caption, LexicalErrorBoundary);

  const ref = useCallback(
    (rootElement: null | HTMLElement) => {
      caption.setRootElement(rootElement);
      //Lexical adds a paragraph node when setRootElement is called.
      //I'm not sure why. There may be a better solution, but here is a hack for now
      caption.update(() => {
        const root = $getRoot();
        root.clear();
      });
    },
    [caption]
  );

  const addEmailTextNode = () => {
    caption.update(() => {
      const root = $getRoot();
      const emailTextNode = $createEmailTextNode();

      root.append(emailTextNode);
    });
    caption.getEditorState().read(() => {});
  };

  return (
    <LexicalNestedComposer
      initialEditor={caption}
      initialNodes={[TextSectionNode]}
    >
      {/* <ToolbarPlugin /> */}
      <EmailSectionWrapper ref={ref}>{decorators}</EmailSectionWrapper>
      {decorators.length === 0 && (
        <div onClick={addEmailTextNode}>Add Text2 Node</div>
      )}
    </LexicalNestedComposer>
  );
};

export default EmailSectionNodeComponent;

export const EmailSectionWrapper = React.forwardRef<
  HTMLTableElement,
  React.PropsWithChildren
>((props, ref) => (
  <Section>
    <Row ref={ref}>
      {/* allow multiple columns */}
      <Column style={{ position: "relative" }}>{props.children}</Column>
    </Row>
  </Section>
));
