import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  LexicalCommand,
} from "lexical";
import { useEffect, useState } from "react";
import {
  $isCustomParagraphNode,
  CustomParagraphNode,
} from "../../nodes/emailParagraph";
import { TypeOutline } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useActiveEditors } from "@/EmailEditor/emailEditorContext";

const SET_FONT_SIZE_COMMAND: LexicalCommand<number> = createCommand();

export function ToolbarPlugin(): JSX.Element | null {
  const [typeStyle, setTypeStyle] = useState<string | undefined>();
  const [editor] = useLexicalComposerContext();
  const { activeEditor } = useActiveEditors();

  useEffect(() => {
    if (!editor.hasNodes([CustomParagraphNode])) {
      throw new Error(
        "ToolbarPlugin: CustomParagraphNode not registered on editor (initialConfig.nodes)"
      );
    }

    return editor.registerCommand<number>(
      SET_FONT_SIZE_COMMAND,
      (fontSize) => {
        const selection = $getSelection();
        const selectedNodes = selection?.getNodes();

        selectedNodes?.forEach((n) => {
          if ($isCustomParagraphNode(n)) {
            n.setFontSize(fontSize);
          }
          const parent = n.getParent();
          if ($isCustomParagraphNode(parent)) {
            parent.setFontSize(fontSize);
          }
        });
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [editor]);

  const handleChangeFontSize = (value: string) => {
    switch (value) {
      case "header_1":
        editor.dispatchCommand(SET_FONT_SIZE_COMMAND, 48);
        break;
      case "header_2":
        editor.dispatchCommand(SET_FONT_SIZE_COMMAND, 24);
        break;
      case "regular":
        editor.dispatchCommand(SET_FONT_SIZE_COMMAND, 12);
        break;

      default:
        break;
    }
  };

  const handleOpen = (open: boolean) => {
    //does this need to be in editor.read?
    if (open) {
      editor.read(() => {
        const selection = $getSelection();
        const selectedNodes = selection?.getNodes();
        const selectedCustomParagraphNodes = selectedNodes
          ?.map((n) => {
            if ($isCustomParagraphNode(n)) {
              return n;
            }
            const parent = n.getParent();
            if ($isCustomParagraphNode(parent)) {
              return parent;
            }
            return null;
          })
          .filter(Boolean);
        if (selectedCustomParagraphNodes?.length === 1) {
          const selectedParagraphNode = selectedCustomParagraphNodes[0];
          if (selectedParagraphNode?.getFontSize() === 48) {
            setTypeStyle("header_1");
          } else if (selectedParagraphNode?.getFontSize() === 24) {
            setTypeStyle("header_2");
          } else if (selectedParagraphNode?.getFontSize() === 12) {
            setTypeStyle("regular");
          }
        } else {
          setTypeStyle(undefined);
        }
      });
    }
  };

  if (activeEditor?.getKey() !== editor.getKey()) {
    return <></>;
  }

  return (
    <div className="border-slate-500 border-2 absolute top-0 -translate-y-full">
      <DropdownMenu onOpenChange={handleOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            onClick={(e) => e.stopPropagation()}
            variant="outline"
            size="icon"
          >
            <TypeOutline />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Panel Position</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={typeStyle}
            onValueChange={handleChangeFontSize}
          >
            <DropdownMenuRadioItem value="header_1">
              Header 1
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="header_2">
              Header 2
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="regular">
              Regular
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
