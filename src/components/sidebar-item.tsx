import { cn } from "@/lib/utils";
import { type FC, type PropsWithChildren } from "react";
import { Link } from "react-router";

type Props = {
  icon: React.ReactNode;
  label: string;
  expanded: boolean;
  link: string;
  active: boolean;
};

export const SidebarItem: FC<PropsWithChildren<Props>> = ({
  icon,
  label,
  expanded,
  link,
  active,
}: Props) => {
  return (
    <Link to={link}>
      <div
        className={cn(
          "flex items-center hover:text-primary cursor-pointer relative",
          active ? "text-primary" : "text-[#9F9F9F]"
        )}
      >
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
    </Link>
  );
};

export default SidebarItem;
