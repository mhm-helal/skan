"use client";

import { useState } from "react";
import LoadingScreen from "./LoadingScreen";
import DockNav from "./DockNav";
import CustomCursor from "./CustomCursor";

export default function ClientShell({ children }: { children: React.ReactNode }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      <CustomCursor />
      <LoadingScreen onComplete={() => setLoaded(true)} />
      {loaded && <DockNav />}
      {children}
    </>
  );
}
