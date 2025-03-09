import { useEmailEditor } from "@/EmailEditor/emailEditorContext";
import { LexicalNode } from "lexical";

interface SelectableProps {
  children: React.ReactNode;
  node: LexicalNode;
}
const Selectable = ({ children, node }: SelectableProps) => {
  const { activeNode, setActiveNode } = useEmailEditor();

  // useEffect(() => {
  // console.log(
  //   imageRef.current?.naturalHeight,
  //   imageRef.current?.naturalWidth,
  //   imageRef.current
  // );
  // }, []);
  // if (activeNode?.getKey() === node.getKey())
  const isSelected = activeNode?.getKey() === node?.getKey();
  return (
    <div
      onClick={() => {
        if (node) setActiveNode(node);
      }}
      className={`box-border p-0 m-0 border hover:border-blue-400 ${
        isSelected
          ? "border-blue-400 border"
          : "border-transparent hover:bg-blue-50"
      }`}
    >
      {children}
    </div>
  );
};

export default Selectable;
