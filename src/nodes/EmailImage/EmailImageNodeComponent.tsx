import { Img } from "@react-email/components";

//consider making EmailText a node that extends TextNode instead of being a decorator node. Then it gets used by lexical instead of regular TextNode
const EmailImageNodeComponent = () => {
  return (
    <Img
      alt="Atoms Vacuum Canister"
      //todo these don't translate to email right now
      // need to configure tailwind to work with react email
      className="rounded-[12px] [margin:12px_auto_12px] h-[150px]"
      height={150}
      src="https://react.email/static/atmos-vacuum-canister.jpg"
    ></Img>
  );
};

export default EmailImageNodeComponent;
