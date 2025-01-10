import { createContext, useContext, useMemo, useState } from "react";
import { LexicalEditor } from "lexical";

type EditorContextValue = {
  activeEditor?: LexicalEditor;
  setActiveEditor: (editor: LexicalEditor) => void;
  parentEditor?: LexicalEditor;
  setParentEditor: (editor: LexicalEditor) => void;
};

const EditorContext = createContext<EditorContextValue | null>(null);

export const EmailEditorProvider = (props: React.PropsWithChildren) => {
  const [activeEditor, setActiveEditor] = useState<LexicalEditor>();
  const [parentEditor, setParentEditor] = useState<LexicalEditor>();

  const value = useMemo(() => {
    return {
      activeEditor,
      parentEditor,
      setActiveEditor,
      setParentEditor,
    };
  }, [activeEditor, parentEditor]);

  return (
    <EditorContext.Provider value={value}>
      {props.children}
    </EditorContext.Provider>
  );
};

export const useActiveEditors = (): EditorContextValue => {
  const context = useContext(EditorContext);
  if (context === null) {
    throw new Error(
      `The \`useEditors\` hook must be used inside the <EditorProvider> component's context.`
    );
  }
  return context;
};
