import { COMMAND_PRIORITY_CRITICAL, SELECTION_CHANGE_COMMAND } from "lexical";
import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEmailEditor } from "@/EmailEditor/emailEditorContext";

export function ActiveEditorStatePlugin() {
  const [editor] = useLexicalComposerContext();
  const { setActiveColumn, setActiveEditor } = useEmailEditor();

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_, activeEditor) => {
        setActiveEditor(activeEditor);
        setActiveColumn(editor);
        return false;
      },
      COMMAND_PRIORITY_CRITICAL
    );
  }, [editor, setActiveColumn, setActiveEditor]);

  return null;
}
