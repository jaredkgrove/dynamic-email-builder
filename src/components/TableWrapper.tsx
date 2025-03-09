import { Column, Row } from "@react-email/components";
import React, { ReactElement } from "react";

interface SelectableProps {
  children: React.ReactNode;
  textAlign: "center" | "left" | "right";
}
const TableWrapper = ({ children, textAlign }: SelectableProps) => {
  return (
    <Row>
      <Column align={textAlign}>{children}</Column>
    </Row>
  );
};

export default TableWrapper;
