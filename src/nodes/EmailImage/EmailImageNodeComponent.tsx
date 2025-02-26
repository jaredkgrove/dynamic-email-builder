import { useEmailEditor } from "@/EmailEditor/emailEditorContext";
import { Img } from "@react-email/components";
import { useEffect, useRef } from "react";
import { EmailImageNode } from ".";

const EmailImageNodeComponent = ({ node }: { node?: EmailImageNode }) => {
  const { activeNode, setActiveNode } = useEmailEditor();

  // useEffect(() => {
  // console.log(
  //   imageRef.current?.naturalHeight,
  //   imageRef.current?.naturalWidth,
  //   imageRef.current
  // );
  // }, []);
  // if (activeNode?.getKey() === node.getKey())
  console.log(activeNode?.getKey(), node?.getKey());
  return (
    <div
      onClick={() => {
        if (node) setActiveNode(node);
      }}
      className="box-border p-0 m-0 hover:border-blue-400 hover:border-4"
    >
      <EmailImageComponent />
    </div>
  );
};

export const EmailImageComponent = () => {
  const imageRef = useRef<HTMLImageElement>(null);

  // useEffect(() => {
  // console.log(
  //   imageRef.current?.naturalHeight,
  //   imageRef.current?.naturalWidth,
  //   imageRef.current
  // );
  // }, []);
  // if (activeNode?.getKey() === node.getKey())
  return (
    <Img
      // alt="Atoms Vacuum Canister"
      //todo these don't translate to email right now
      // need to configure tailwind to work with react email
      // className="rounded-[12px] [margin:12px_auto_12px] h-[150px]"
      style={{ height: 150 }}
      height={150}
      ref={imageRef}
      src="https://ci3.googleusercontent.com/meips/ADKq_Nbxyugz-chyMj7Gm6k3xhDzv_HvMQKm60I4tLU9I9qF0j3IPROeU0iCY1y3zwjrtwX981qskw0p8_zZXAdOk1-3r5PCxdw7smENfEi9YelBZRyTY4xNBPUo180JCO2SbO5Arp7kHSIVuRsBwu7i6OZu1IRNn_t_itHvz3TONLx_9xpUI8hwk8HGeqMQIDrP2OmKv_64iCbx-17aUvJcl0LClIzSi6WOpy54MsDfYRnbeGqZeUja4FKzyAs-YTrP68k7BeU=s0-d-e1-ft#https://media.shopmonkey.cloud/image/upload/f_auto/sandbox/5f81eb02-5e0f-4d6a-ab8f-5d4908839533/3f17c748-09bb-454a-9d18-137667839687/1721858491455-XR30KJUVKI7M30PLCVF3YA.jpg"
    ></Img>
  );
};

export default EmailImageNodeComponent;
