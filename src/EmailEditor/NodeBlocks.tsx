import { $getRoot } from "lexical";
import { useEmailEditor } from "./emailEditorContext";
import { $createSectionNode } from "@/nodes/Section";
import { EXPORT_HTML_PREVIEW, IMPORT_JSON } from "@/EmailBuilderPlugin";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const NodeBlocks = () => {
  const [jsonStateStr, setJsonStateStr] = useState<string>();
  const { parentEditor } = useEmailEditor();
  const handleExport = () => {
    parentEditor?.dispatchCommand(EXPORT_HTML_PREVIEW, null);
  };

  const handleImport = () => {
    if (jsonStateStr) {
      parentEditor?.dispatchCommand(IMPORT_JSON, jsonStateStr);
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
        value={jsonStateStr}
        onChange={(e) => setJsonStateStr(e.target.value)}
      ></textarea>
      <Button onClick={handleImport}>Import</Button>
    </div>
  );
};

export default NodeBlocks;
