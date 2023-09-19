import { SortDirection } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

interface Props {
  isSorted: boolean | SortDirection;
}

export function SortingArrow({ isSorted }: Props) {
  return (
    <>
      {!isSorted ? (
        <ArrowUpDown className="ml-2 h-4" />
      ) : (
        <>
          {isSorted == "asc" ? (
            <ArrowUp className="ml-2 h-4" />
          ) : (
            <ArrowDown className="ml-2 h-4" />
          )}
        </>
      )}
    </>
  );
}
