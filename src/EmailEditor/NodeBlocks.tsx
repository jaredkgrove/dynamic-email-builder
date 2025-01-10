import { $getRoot } from "lexical";
import { useActiveEditors } from "./emailEditorContext";
import { $createSectionNode } from "@/nodes/Section";
import { EXPORT_HTML_PREVIEW } from "@/EmailBuilderPlugin";
import { Button } from "@/components/ui/button";

const NodeBlocks = () => {
  const { parentEditor } = useActiveEditors();
  const handleClick = () => {
    parentEditor?.dispatchCommand(EXPORT_HTML_PREVIEW, null);
  };
  const addSectionNode = (columnCount: 1 | 2) => {
    parentEditor?.update(() => {
      const root = $getRoot();
      const sectionNode = $createSectionNode(columnCount);

      root.append(sectionNode);
    });
  };
  return (
    <div className="flex flex-col">
      <Button onClick={handleClick}>Export</Button>
      <Button variant="outline" onClick={() => addSectionNode(1)}>
        Single Column
      </Button>
      <Button variant="outline" onClick={() => addSectionNode(2)}>
        Double Column
      </Button>
    </div>
  );
};

export default NodeBlocks;
