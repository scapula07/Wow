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
          expanded ? "md:ml-64" : "md:ml-16",
          "md:px-10 px-5 transition-all duration-300"
        )}
      >
        <Navbar />
        {children}
      </main>
    </>
  );
};

export default DashboardLayout;
