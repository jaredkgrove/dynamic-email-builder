import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ErrorBoundaryType, useDecorators } from "./useDecorators";
import { $getRoot } from "lexical";
import { $createEmailTextNode } from "../nodes/TextSection";
import { useCallback } from "react";
import { Body, Container } from "@react-email/components";
export default function EmailBuilderPlugin({
  ErrorBoundary,
}: {
  ErrorBoundary: ErrorBoundaryType;
}): JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  const decorators = useDecorators(editor, ErrorBoundary);

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
      <Body>
        <Container ref={ref}>{decorators}</Container>
      </Body>
      <div style={{ display: "flex" }}>
        <div onClick={addEmailTextNode}>Add Text Node</div>
      </div>
    </>
  );
}
