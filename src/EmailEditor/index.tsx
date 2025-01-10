import { EditorState, LexicalEditor } from "lexical";

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
import NodeBlocks from "./nodeBlocks";

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
    <div className="w-screen h-screen p-10 bg-slate-50">
      <EmailEditorProvider>
        <div className="flex w-full">
          <div className="flex-grow border p-10">
            <LexicalComposer initialConfig={initialConfig}>
              <OnChangePlugin onChange={onChangeDebugger} />
              <EmailBuilderPlugin ErrorBoundary={LexicalErrorBoundary} />
              <HistoryPlugin />
              <AutoFocusPlugin />
            </LexicalComposer>
          </div>
          <div>
            <NodeBlocks />
          </div>
        </div>
      </EmailEditorProvider>
    </div>
  );
};

export default Editor;
