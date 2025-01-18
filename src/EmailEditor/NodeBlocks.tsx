import { $getRoot } from "lexical";
import { useActiveEditors } from "./emailEditorContext";
import { $createSectionNode } from "@/nodes/Section";
import { EXPORT_HTML_PREVIEW, IMPORT_JSON } from "@/EmailBuilderPlugin";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const NodeBlocks = () => {
  const [jsonState, setJsonState] = useState<string>();
  const { parentEditor } = useActiveEditors();
  const handleExport = () => {
    parentEditor?.dispatchCommand(EXPORT_HTML_PREVIEW, null);
  };

  const handleImport = () => {
    if (jsonState) {
      parentEditor?.dispatchCommand(IMPORT_JSON, jsonState);
    }
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
      <Button onClick={handleExport}>Export</Button>
      <Button variant="outline" onClick={() => addSectionNode(1)}>
        Single Column
      </Button>
      <Button variant="outline" onClick={() => addSectionNode(2)}>
        Double Column
      </Button>
      <textarea
        value={jsonState}
        onChange={(e) => setJsonState(e.target.value)}
      ></textarea>
      <Button onClick={handleImport}>Import</Button>
    </div>
  );
};

export default NodeBlocks;
