import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import { ErrorBoundaryType, useDecorators } from "./useDecorators";
import {
  $getRoot,
  COMMAND_PRIORITY_CRITICAL,
  createCommand,
  LexicalCommand,
} from "lexical";
import { $generateHtmlFromNodes } from "@lexical/html";
import { useCallback, useEffect, useLayoutEffect } from "react";
import { Body, Container, Head, Html } from "@react-email/components";
import ReactDOMServer from "react-dom/server";
import React from "react";
import { v4 as uuidv4 } from "uuid";
import { useActiveEditors } from "@/EmailEditor/emailEditorContext";

export const EXPORT_HTML_PREVIEW: LexicalCommand<null> = createCommand();
export const IMPORT_JSON: LexicalCommand<string> = createCommand();
export default function EmailBuilderPlugin({
  ErrorBoundary,
}: {
  ErrorBoundary: ErrorBoundaryType;
}): JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  const decorators = useDecorators(editor, ErrorBoundary);
  const { parentEditor, setParentEditor } = useActiveEditors();

  useEffect(() => {
    if (!parentEditor) {
      setParentEditor(editor);
    }
  }, [editor, parentEditor, setParentEditor]);

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

  useLayoutEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        EXPORT_HTML_PREVIEW,
        (_, editor) => {
          editor.update(() => {
            const splitUuid = uuidv4();
            // console.log("JSON ", editor.toJSON());
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
          return false;
        },
        COMMAND_PRIORITY_CRITICAL //todo
      )
      // editor.registerCommand(
      //   IMPORT_JSON,
      //   (_, editor) => {
      //     editor.update(() => {
      //       const splitUuid = uuidv4();
      //       console.log("JSON ", editor.toJSON());
      //       const lexicalHtml = $generateHtmlFromNodes(editor, null);
      //       const emailOuterHtml = ReactDOMServer.renderToStaticMarkup(
      //         <Html>
      //           <Head />
      //           <Body>
      //             <MyCoolWrapper>{splitUuid}</MyCoolWrapper>
      //           </Body>
      //         </Html>
      //       );

      //       const finalHtml = emailOuterHtml.split(splitUuid).join(lexicalHtml);

      //       const newWindow = window.open();
      //       newWindow?.document.write(finalHtml);
      //     });
      //     return false;
      //   },
      //   COMMAND_PRIORITY_CRITICAL //todo
      // )
    );
  }, [editor]);

  return (
    <>
      <MyCoolWrapper ref={ref}>{decorators}</MyCoolWrapper>
    </>
  );
}

const MyCoolWrapper = React.forwardRef<
  HTMLTableElement,
  React.PropsWithChildren
>((props, ref) => <Container ref={ref}>{props.children}</Container>);
