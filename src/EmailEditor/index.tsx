import { EditorState, LexicalEditor, ParagraphNode } from "lexical";

import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import {
  InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { TextSectionNode } from "../nodes/TextSection";
import EmailBuilderPlugin from "../EmailBuilderPlugin";

import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { CustomParagraphNode } from "../nodes/emailParagraph";
import { Button } from "@/components/ui/button";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import ReactDOMServer from "react-dom/server";
import { $generateHtmlFromNodes } from "@lexical/html";
const theme = {
  // Theme styling goes here
  //...
};

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error: Error) {
  console.error(error);
}

const onChangeDebugger = (editorState: EditorState, _editor: LexicalEditor) => {
  console.log(JSON.parse(JSON.stringify(editorState)), _editor);
};

const Editor = () => {
  const initialConfig: InitialConfigType = {
    namespace: "EmailBuilder",
    theme,
    onError,
    editorState: undefined,
    nodes: [
      TextSectionNode,
      CustomParagraphNode,
      {
        replace: ParagraphNode,
        with: () => {
          return new CustomParagraphNode();
        },
        withKlass: CustomParagraphNode,
      },
    ],
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <ExportHeader />
      <OnChangePlugin onChange={onChangeDebugger} />
      <EmailBuilderPlugin ErrorBoundary={LexicalErrorBoundary} />
      <HistoryPlugin />
      <AutoFocusPlugin />
    </LexicalComposer>
  );
};

export default Editor;

const ExportHeader = () => {
  const [editor] = useLexicalComposerContext();
  const handleClick = () => {
    editor.update(() => {
      // const splitUuid = "areallyrandomstring";

      const lexicalHtml = $generateHtmlFromNodes(editor, null);
      const emailOuterHtml = ReactDOMServer.renderToStaticMarkup(lexicalHtml);

      // const finalHtml = emailOuterHtml.split(splitUuid).join(lexicalHtml);

      const newWindow = window.open();
      newWindow?.document.write(emailOuterHtml);
    });
  };

  return <Button onClick={handleClick}>Export</Button>;
};
