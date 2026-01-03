import React, { ReactNode } from "react";
import dynamic from "next/dynamic";
import { Box } from "@mui/material";
import Nav from "../Nav";
import { useStyles } from "./useStyles";

const DynamicHead = dynamic(() => import("next/head"), { ssr: false });

type LayoutProps = {
  children: ReactNode;
  header: string;
  showNav?: boolean;
};

export default function Layout({
  children,
  header,
  showNav = true,
}: LayoutProps) {

  const styles = useStyles()
  return (
    <>
      <DynamicHead>
        <title>{header}</title>
      </DynamicHead>

      {showNav && <Nav />}

      <Box sx={styles.container}>
        {children}
      </Box>
    </>
  );
}
