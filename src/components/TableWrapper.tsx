import { Column, Row } from "@react-email/components";
import React, { ReactElement } from "react";

interface SelectableProps {
  children: React.ReactNode;
  textAlign: "center" | "left" | "right";
}
const TableWrapper = ({ children, textAlign }: SelectableProps) => {
  const isReactElement = React.isValidElement(children);

  return (
    <Row>
      <Column align={textAlign} style={{ textAlign }}>
        {isReactElement
          ? React.cloneElement(children, {
              style: {
                ...children.props.style,
                display: "block",
                margin:
                  textAlign === "center"
                    ? "0 auto"
                    : textAlign === "right"
                    ? "0 0 0 auto"
                    : undefined,
              },
            })
          : children}
      </Column>
    </Row>
  );
};

export default TableWrapper;
