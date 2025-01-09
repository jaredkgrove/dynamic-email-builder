import { COMMAND_PRIORITY_CRITICAL, SELECTION_CHANGE_COMMAND } from "lexical";
import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useActiveEditors } from "@/EmailEditor/emailEditorContext";

export function ActiveEditorStatePlugin() {
  const [editor] = useLexicalComposerContext();
  const { setActiveEditor } = useActiveEditors();

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_, activeEditor) => {
        setActiveEditor(activeEditor);
        return false;
      },
      COMMAND_PRIORITY_CRITICAL
    );
  }, [editor, setActiveEditor]);

  return null;
}
