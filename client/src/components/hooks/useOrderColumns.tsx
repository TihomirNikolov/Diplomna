import { cn } from "@/lib/utils";
import {
  Order,
  OrderStatusEnum,
  statuses,
} from "@/utilities/models/account/Order";
import { ColumnDef } from "@tanstack/react-table";
import { Check, ChevronsUpDown } from "lucide-react";
import moment from "moment";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";
import { Command, CommandGroup, CommandItem } from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { SortingArrow } from "../utilities";

interface Props {
  updateStatus: (id: string, status: OrderStatusEnum) => void;
  onDetailsClicked: (id: string) => void;
}

export default function useOrderColumns({
  updateStatus,
  onDetailsClicked,
}: Props) {
  const { t } = useTranslation();

  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: "id",
      header: ({ column }) => {
        return (
          <Button
            className="w-full justify-start"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t("orderId")}
            <SortingArrow isSorted={column.getIsSorted()} />
          </Button>
        );
      },
      size: 300,
    },
    {
      accessorKey: "uniqueId",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t("usersId")}
            <SortingArrow isSorted={column.getIsSorted()} />
          </Button>
        );
      },
      size: 300,
    },
    {
      accessorKey: "orderSum",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t("sum")}
            <SortingArrow isSorted={column.getIsSorted()} />
          </Button>
        );
      },
      size: 200,
    },
    {
      accessorKey: "orderDate",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t("date")}
            <SortingArrow isSorted={column.getIsSorted()} />
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <span>
            {moment(new Date(row.original.orderDate)).format(
              "DD-MM-YYYY HH:mm:ss",
            )}
          </span>
        );
      },
      size: 100,
    },
    {
      accessorKey: "status",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t("status")}
            <SortingArrow isSorted={column.getIsSorted()} />
          </Button>
        );
      },
      cell: ({ row }) => {
        const [open, setOpen] = useState<boolean>(false);

        return (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-[200px] justify-between"
              >
                {t(OrderStatusEnum[row.original.status])}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandGroup>
                  {statuses.map((status, index) => (
                    <CommandItem
                      key={index}
                      value={status.id.toString()}
                      onSelect={(currentValue) => {
                        updateStatus(row.original.id, parseInt(currentValue));
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          row.original.status == status.id
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                      {t(OrderStatusEnum[status.id])}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        );
      },
      size: 100,
    },
    {
      accessorKey: "orderDate",
      header: ({ column }) => {
        return (
          <Button variant="ghost" className="w-full justify-start">
            Details
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <button
            className="w-full text-center"
            onClick={() => onDetailsClicked(row.original.id)}
          >
            Details
          </button>
        );
      },
      size: 100,
    },
  ];

  return columns;
}
