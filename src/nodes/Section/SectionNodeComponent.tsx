import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { LexicalNestedComposer } from "@lexical/react/LexicalNestedComposer";
import { Column, Row, Section } from "@react-email/components";
import { $getRoot, LexicalEditor } from "lexical";

import React, { useCallback } from "react";
import { useDecorators } from "@/EmailBuilderPlugin/useDecorators";
import { $createEmailTextNode, EmailTextNode } from "../EmailText";
import { Button } from "@/components/ui/button";
import { $createEmailImageNode, EmailImageNode } from "../EmailImage";
import { ActiveEditorStatePlugin } from "@/plugins/activeEditorState";
import { ToolbarPlugin } from "@/plugins/toolbar";

const EmailSectionNodeComponent = ({
  caption_1,
  caption_2,
}: {
  caption_1: LexicalEditor;
  caption_2?: LexicalEditor;
}) => {
  const decorators1 = useDecorators(caption_1, LexicalErrorBoundary);
  const decorators2 = useDecorators(caption_2, LexicalErrorBoundary);

  const ref1 = useCallback(
    (rootElement: null | HTMLElement) => {
      caption_1.setRootElement(rootElement);
    },
    [caption_1]
  );

  const ref2 = useCallback(
    (rootElement: null | HTMLElement) => {
      caption_2?.setRootElement(rootElement);
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

  const addEmailImageNode1 = () => {
    caption_1.update(() => {
      const root = $getRoot();
      const emailImageNode1 = $createEmailImageNode();

      root.append(emailImageNode1);
    });
    caption_1.getEditorState().read(() => {});
  };

  const addEmailImageNode2 = () => {
    caption_2?.update(() => {
      const root = $getRoot();
      const emailImageNode2 = $createEmailImageNode();

      root.append(emailImageNode2);
    });
    caption_2?.getEditorState().read(() => {});
  };

  const addEmailTextNode2 = () => {
    caption_2?.update(() => {
      const root = $getRoot();
      const emailTextNode = $createEmailTextNode();

      root.append(emailTextNode);
    });
    caption_2?.getEditorState().read(() => {});
  };

  return (
    <>
      <EmailSectionAndRow>
        <EmailColumn>
          <LexicalNestedComposer
            initialEditor={caption_1}
            initialNodes={[EmailTextNode, EmailImageNode]}
          >
            {/* make this a sidebar plugin or something and have text specific toolbar? */}
            <ToolbarPlugin />
            <ActiveEditorStatePlugin />
            {/* <ToolbarPlugin /> */}
            <div ref={ref1}> {decorators1}</div>

            {/* {decorators.map((d, i) => (
            <EmailColumn key={d.key}>{d}</EmailColumn>
          ))} */}

            {decorators1.length === 0 && (
              <>
                <Button onClick={addEmailTextNode1}>Text</Button>
                <Button onClick={addEmailImageNode1}>Image</Button>
              </>
            )}
          </LexicalNestedComposer>
        </EmailColumn>
        {caption_2 && (
          <EmailColumn>
            <LexicalNestedComposer
              initialEditor={caption_2}
              initialNodes={[EmailTextNode, EmailImageNode]}
            >
              <ActiveEditorStatePlugin />

              <div ref={ref2}> {decorators2}</div>

              {/* {decorators.map((d, i) => (
      <EmailColumn key={d.key}>{d}</EmailColumn>
    ))} */}

              {decorators2.length === 0 && (
                <>
                  <Button onClick={addEmailTextNode2}>Text</Button>
                  <Button onClick={addEmailImageNode2}>Image</Button>
                </>
              )}
            </LexicalNestedComposer>
          </EmailColumn>
        )}
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
