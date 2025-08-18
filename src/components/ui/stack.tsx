import type { HTMLAttributes } from "react";

export type StackProps = HTMLAttributes<HTMLDivElement>;

export const VStack = ({ children, className, ...props }: StackProps) => {
  return (
    <div className={`flex flex-col ${className}`} {...props}>
      {children}
    </div>
  );
};

export const HStack = ({ children, className, ...props }: StackProps) => {
  return (
    <div className={`flex flex-row ${className}`} {...props}>
      {children}
    </div>
  );
};
