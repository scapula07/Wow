import { cn } from "@/lib/utils";
import { type FC, type PropsWithChildren } from "react";

type Props = {
  icon: React.ReactNode;
  label: string;
  expanded: boolean;
};

export const SidebarItem: FC<PropsWithChildren<Props>> = ({
  icon,
  label,
  expanded,
}: Props) => {
  return (
    <div className="flex items-center text-[#9F9F9F] hover:text-primary cursor-pointer relative">
      {icon}
      <span
        className={cn(
          "text-sm font-medium transform transition-all duration-300 absolute left-9",
          expanded
            ? "opacity-100 translate-x-0"
            : "opacity-0 -translate-x-5 pointer-events-none"
        )}
      >
        {label}
      </span>
    </div>
  );
};

export default SidebarItem;
