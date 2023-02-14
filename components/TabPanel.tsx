import { Box } from "@material-ui/core";
import React from "react";

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
  style: any,
}

export function TabPanel(props: TabPanelProps) {
  const { children, value, index, style } = props;

  return (
    <React.Fragment>
      {value === index && (
        <Box className={style}>
          {children}
        </Box>
      )}
    </React.Fragment>
  );
}