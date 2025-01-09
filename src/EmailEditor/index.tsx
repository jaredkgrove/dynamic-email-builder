import { EditorState, LexicalEditor, ParagraphNode } from "lexical";

import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import {
  InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import EmailBuilderPlugin from "../EmailBuilderPlugin";

import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { SectionNode } from "@/nodes/Section";
import { EmailEditorProvider } from "./emailEditorContext";
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
    nodes: [SectionNode],
  };

  return (
    <EmailEditorProvider>
      <LexicalComposer initialConfig={initialConfig}>
        <OnChangePlugin onChange={onChangeDebugger} />
        <EmailBuilderPlugin ErrorBoundary={LexicalErrorBoundary} />
        <HistoryPlugin />
        <AutoFocusPlugin />
      </LexicalComposer>
    </EmailEditorProvider>
  );
};

export default Editor;
