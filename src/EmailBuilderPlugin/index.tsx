import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ErrorBoundaryType, useDecorators } from "./useDecorators";
import { $getRoot, $nodesOfType } from "lexical";
import { $generateHtmlFromNodes } from "@lexical/html";
import { $createEmailTextNode } from "../nodes/EmailText";
import { useCallback } from "react";
import { Body, Container, Head, Html } from "@react-email/components";
import { Button } from "@/components/ui/button";
import ReactDOMServer from "react-dom/server";
import React from "react";
import { v4 as uuidv4 } from "uuid";
import { $createSectionNode, SectionNode } from "@/nodes/Section";
export default function EmailBuilderPlugin({
  ErrorBoundary,
}: {
  ErrorBoundary: ErrorBoundaryType;
}): JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  const decorators = useDecorators(editor, ErrorBoundary);
  const handleClick = () => {
    editor.update(() => {
      const splitUuid = uuidv4();

      const lexicalHtml = $generateHtmlFromNodes(editor, null);
      const emailOuterHtml = ReactDOMServer.renderToStaticMarkup(
        <Html>
          <Head />
          <Body>
            <MyCoolWrapper>{splitUuid}</MyCoolWrapper>
          </Body>
        </Html>
      );

      const finalHtml = emailOuterHtml.split(splitUuid).join(lexicalHtml);

      const newWindow = window.open();
      newWindow?.document.write(finalHtml);
    });
  };

  const ref = useCallback(
    (rootElement: null | HTMLElement) => {
      editor.setRootElement(rootElement);
      //Lexical adds a paragraph node when setRootElement is called.
      //I'm not sure why. There may be a better solution, but here is a hack for now
      editor.update(() => {
        const root = $getRoot();
        root.clear();
      });
    },
    [editor]
  );
  const addEmailTextNode = () => {
    editor.update(() => {
      const root = $getRoot();
      const emailTextNode = $createEmailTextNode();

      root.append(emailTextNode);
    });
    editor.getEditorState().read(() => {});
  };

  const addSectionNode = () => {
    editor.update(() => {
      const root = $getRoot();
      const sectionNode = $createSectionNode();

      root.append(sectionNode);
    });
    editor.getEditorState().read(() => {
      console.log("what ", $nodesOfType(SectionNode));
    });
  };
  return (
    <>
      <Button onClick={handleClick}>Export</Button>
      <MyCoolWrapper ref={ref}>{decorators}</MyCoolWrapper>
      <div style={{ display: "flex" }}>
        <div onClick={addSectionNode}>Add Section Node</div>
      </div>
    </>
  );
}

const MyCoolWrapper = React.forwardRef<
  HTMLTableElement,
  React.PropsWithChildren
>((props, ref) => <Container ref={ref}>{props.children}</Container>);
