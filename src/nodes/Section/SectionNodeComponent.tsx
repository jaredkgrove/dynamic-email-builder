import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { LexicalNestedComposer } from "@lexical/react/LexicalNestedComposer";
import { Column, Row, Section } from "@react-email/components";
import { $getRoot, $nodesOfType, LexicalEditor } from "lexical";

import React, { useCallback } from "react";
import { useDecorators } from "@/EmailBuilderPlugin/useDecorators";
import { $createEmailTextNode, TextSectionNode } from "../EmailText";

const EmailSectionNodeComponent = ({
  caption_1,
  caption_2,
}: {
  caption_1: LexicalEditor;
  caption_2: LexicalEditor;
}) => {
  const decorators1 = useDecorators(caption_1, LexicalErrorBoundary);
  const decorators2 = useDecorators(caption_2, LexicalErrorBoundary);

  const ref1 = useCallback(
    (rootElement: null | HTMLElement) => {
      caption_1.setRootElement(rootElement);
      //Lexical adds a paragraph node when setRootElement is called.
      //I'm not sure why. There may be a better solution, but here is a hack for now
      caption_1.update(() => {
        const root = $getRoot();
        root.clear();
      });
    },
    [caption_1]
  );

  const ref2 = useCallback(
    (rootElement: null | HTMLElement) => {
      caption_2.setRootElement(rootElement);
      //Lexical adds a paragraph node when setRootElement is called.
      //I'm not sure why. There may be a better solution, but here is a hack for now
      caption_2.update(() => {
        const root = $getRoot();
        root.clear();
      });
    },
    [caption_2]
  );

  const addEmailTextNode1 = () => {
    caption_1.update(() => {
      const root = $getRoot();
      const emailTextNode1 = $createEmailTextNode();

      root.append(emailTextNode1);
    });
    caption_1.getEditorState().read(() => {});
  };

  const addEmailTextNode2 = () => {
    caption_2.update(() => {
      const root = $getRoot();
      const emailTextNode = $createEmailTextNode();

      root.append(emailTextNode);
    });
    caption_2.getEditorState().read(() => {});
  };

  return (
    <>
      <EmailSectionAndRow>
        <EmailColumn>
          <LexicalNestedComposer
            initialEditor={caption_1}
            initialNodes={[TextSectionNode]}
          >
            {/* <ToolbarPlugin /> */}
            <div ref={ref1}> {decorators1}</div>

            {/* {decorators.map((d, i) => (
            <EmailColumn key={d.key}>{d}</EmailColumn>
          ))} */}

            {decorators1.length === 0 && (
              <div onClick={addEmailTextNode1}>Add Text Node1</div>
            )}
          </LexicalNestedComposer>
        </EmailColumn>
        <EmailColumn>
          <LexicalNestedComposer
            initialEditor={caption_2}
            initialNodes={[TextSectionNode]}
          >
            {/* <ToolbarPlugin /> */}
            <div ref={ref2}> {decorators2}</div>

            {/* {decorators.map((d, i) => (
      <EmailColumn key={d.key}>{d}</EmailColumn>
    ))} */}

            {decorators2.length === 0 && (
              <div onClick={addEmailTextNode2}>Add Text Node2</div>
            )}
          </LexicalNestedComposer>
        </EmailColumn>
      </EmailSectionAndRow>
    </>
  );
};

export default EmailSectionNodeComponent;

export const EmailSectionAndRow = React.forwardRef<
  HTMLTableElement,
  React.PropsWithChildren
>((props) => (
  <Section>
    <Row className="rowGuy">
      {/* allow multiple columns */}
      {props.children}
    </Row>
  </Section>
));

// need column node I think?
// helpers like addColumnNodeWithText, addColumnNodeWithImage
// or maybe auto create x# of column nodes when creating a section node
// then column node contains <div onClick={addEmailTextNode1}>Add Text Node1</div>
// and section node gets deleted if it has no columns
export const EmailColumn = React.forwardRef<
  HTMLTableCellElement,
  React.PropsWithChildren
>((props) => (
  //todo make sure classNames don't affect emails?
  <Column className="relative" style={{ width: "50%" }}>
    {props.children}
  </Column>
));
