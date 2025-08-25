import { useState, type FC, type PropsWithChildren } from "react";
import Sidebar from "../shared/sidebar";
import { cn } from "@/lib/utils";
import Navbar from "../shared/navbar";

const DashboardLayout: FC<PropsWithChildren> = ({ children }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <Sidebar expanded={expanded} setExpanded={setExpanded} />
      <main
        className={cn(
          expanded ? "ml-64" : "ml-16",
          "px-10 transition-all duration-300"
        )}
      >
        <Navbar />
        {children}
      </main>
    </>
  );
};

export default DashboardLayout;
