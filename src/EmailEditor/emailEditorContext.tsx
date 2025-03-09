import { createContext, useContext, useMemo, useState } from "react";
import { LexicalEditor, LexicalNode } from "lexical";

type EditorContextValue = {
  activeColumn?: LexicalEditor;
  activeEditor?: LexicalEditor;
  activeNode?: LexicalNode;
  setActiveColumn: (editor: LexicalEditor) => void;
  setActiveEditor: (editor: LexicalEditor) => void;
  setActiveNode: (node: LexicalNode) => void;
  parentEditor?: LexicalEditor;
  setParentEditor: (editor: LexicalEditor) => void;
};

const EditorContext = createContext<EditorContextValue | null>(null);

export const EmailEditorProvider = (props: React.PropsWithChildren) => {
  const [activeEditor, setActiveEditor] = useState<LexicalEditor>();
  const [activeColumn, setActiveColumn] = useState<LexicalEditor>();
  const [parentEditor, setParentEditor] = useState<LexicalEditor>();
  const [activeNode, setActiveNode] = useState<LexicalNode>();

  const value = useMemo(() => {
    return {
      activeColumn,
      activeEditor,
      activeNode,
      parentEditor,
      setActiveColumn,
      setActiveEditor,
      setActiveNode,
      setParentEditor,
    };
  }, [activeColumn, activeEditor, activeNode, parentEditor]);
  console.log("active guy ", activeColumn?.getEditorState());
  return (
    <EditorContext.Provider value={value}>
      {props.children}
    </EditorContext.Provider>
  );
};

export const useEmailEditor = (): EditorContextValue => {
  const context = useContext(EditorContext);
  if (context === null) {
    throw new Error(
      `The \`useEditors\` hook must be used inside the <EditorProvider> component's context.`
    );
  }
  return context;
};
