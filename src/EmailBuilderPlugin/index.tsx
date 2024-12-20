import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ErrorBoundaryType, useDecorators } from "./useDecorators";
import { $getRoot } from "lexical";
import { $generateHtmlFromNodes } from "@lexical/html";
import { $createEmailTextNode } from "../nodes/TextSection";
import { useCallback } from "react";
import { Body, Container, Head, Html } from "@react-email/components";
import { Button } from "@/components/ui/button";
import ReactDOMServer from "react-dom/server";
import React from "react";
import { randomUUID } from "crypto";
export default function EmailBuilderPlugin({
  ErrorBoundary,
}: {
  ErrorBoundary: ErrorBoundaryType;
}): JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  const decorators = useDecorators(editor, ErrorBoundary);
  const handleClick = () => {
    editor.update(() => {
      const splitUuid = randomUUID();

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
  return (
    <>
      <Button onClick={handleClick}>Export</Button>
      <MyCoolWrapper>
        <Container ref={ref}>{decorators}</Container>
      </MyCoolWrapper>
      <div style={{ display: "flex" }}>
        <div onClick={addEmailTextNode}>Add Text Node</div>
      </div>
    </>
  );
}

const MyCoolWrapper = React.forwardRef<
  HTMLTableElement,
  React.PropsWithChildren
>((props, ref) => <Container ref={ref}>{props.children}</Container>);
