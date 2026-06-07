import { cn } from "@/lib/utils";

interface TableProps {
  children: React.ReactNode;
  className?: string;
}

interface TableCellProps {
  children?: React.ReactNode;
  className?: string;
  colSpan?: number;
}

function Table({ children, className }: TableProps) {
  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full border-collapse">{children}</table>
    </div>
  );
}

function TableHead({ children, className }: TableProps) {
  return <thead className={cn("border-b border-[#262626]", className)}>{children}</thead>;
}

function TableBody({ children, className }: TableProps) {
  return <tbody className={cn("divide-y divide-[#262626]", className)}>{children}</tbody>;
}

function TableRow({
  children,
  className,
  onClick,
}: TableProps & { onClick?: () => void }) {
  return (
    <tr
      className={cn(
        "transition-colors duration-150",
        onClick && "cursor-pointer hover:bg-[#161616]",
        className
      )}
      onClick={onClick}
    >
      {children}
    </tr>
  );
}

function TableHeadCell({ children, className }: TableProps) {
  return (
    <th
      className={cn(
        "px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#525252]",
        className
      )}
    >
      {children}
    </th>
  );
}

function TableCell({ children, className, colSpan }: TableCellProps) {
  return <td colSpan={colSpan} className={cn("px-4 py-3 text-sm text-on-surface", className)}>{children}</td>;
}

export { Table, TableHead, TableBody, TableRow, TableHeadCell, TableCell };
