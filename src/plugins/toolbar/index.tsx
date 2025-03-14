import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getRoot,
  $getSelection,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  LexicalCommand,
} from "lexical";
import { mergeRegister } from "@lexical/utils";

import { useEffect, useState } from "react";
import { $isEmailParagraphNode } from "../../nodes/EmailParagraph";
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
import { useEmailEditor } from "@/EmailEditor/emailEditorContext";
import { $isEmailTextNode } from "@/nodes/EmailText";
import { $isEmailImageNode } from "@/nodes/EmailImage";

export const SET_FONT_SIZE_COMMAND: LexicalCommand<number> = createCommand();
const SET_TEXT_ALIGN: LexicalCommand<"center" | "left" | "right"> =
  createCommand();
export function ToolbarPlugin(): JSX.Element | null {
  const [typeStyle, setTypeStyle] = useState<string | undefined>();
  const [textAlign, setTextAlign] = useState<
    "center" | "left" | "right" | undefined
  >();
  const [editor] = useLexicalComposerContext();
  const { activeEditor, activeColumn } = useEmailEditor();

  useEffect(() => {
    // if (!editor.hasNodes([EmailParagraphNode])) {
    //   throw new Error(
    //     "ToolbarPlugin: EmailParagraphNode not registered on editor (initialConfig.nodes)"
    //   );
    // }

    return mergeRegister(
      editor.registerCommand<number>(
        SET_FONT_SIZE_COMMAND,
        (fontSize) => {
          const selection = $getSelection();
          const selectedNodes = selection?.getNodes();

          selectedNodes?.forEach((n) => {
            if ($isEmailParagraphNode(n)) {
              n.setFontSize(fontSize);
            }
            const parent = n.getParent();
            if ($isEmailParagraphNode(parent)) {
              parent.setFontSize(fontSize);
            }
          });
          return true;
        },
        COMMAND_PRIORITY_EDITOR
      )
    );
  }, [activeColumn, editor]);
  useEffect(() => {
    // if (!editor.hasNodes([EmailParagraphNode])) {
    //   throw new Error(
    //     "ToolbarPlugin: EmailParagraphNode not registered on editor (initialConfig.nodes)"
    //   );
    // }
    if (!activeColumn) {
      return;
    }
    return mergeRegister(
      activeColumn.registerCommand<"center" | "left" | "right">(
        SET_TEXT_ALIGN,
        (textAlign) => {
          const root = $getRoot();
          const nodes = root.getChildren();

          nodes.forEach((node) => {
            if ($isEmailTextNode(node) || $isEmailImageNode(node)) {
              node.setTextAlign(textAlign);
            }
          });

          return true;
        },
        COMMAND_PRIORITY_EDITOR
      )
    );
  }, [activeColumn]);

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

  const handleChangeTextAlign = (value: string) => {
    switch (value) {
      case "left":
        activeColumn?.dispatchCommand(SET_TEXT_ALIGN, "left");
        break;
      case "center":
        activeColumn?.dispatchCommand(SET_TEXT_ALIGN, "center");
        break;
      case "right":
        activeColumn?.dispatchCommand(SET_TEXT_ALIGN, "right");
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
            if ($isEmailParagraphNode(n)) {
              return n;
            }
            const parent = n.getParent();
            if ($isEmailParagraphNode(parent)) {
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
          // if (selectedParagraphNode) {
          //   setTextAlign(selectedParagraphNode.getTextAlign());
          // }
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
            value={textAlign}
            onValueChange={handleChangeTextAlign}
          >
            <DropdownMenuRadioItem value="left">Left</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="center">Center</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="right">Right</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
