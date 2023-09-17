import {
  Order,
  OrderStatusEnum,
  statuses,
} from "@/utilities/models/account/Order";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Listbox, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";
import { ArrowUpDown } from "lucide-react";
import moment from "moment";
import { ColumnDef } from "@tanstack/react-table";

interface Props {
  updateStatus: (id: string, status: OrderStatusEnum) => void;
}

export default function useOrderColumns({ updateStatus }: Props) {
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
            Id на поръчка
            <ArrowUpDown className="ml-2 h-4 w-4" />
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
            Users id
            <ArrowUpDown className="ml-2 h-4 w-4" />
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
            <ArrowUpDown className="ml-2 h-4 w-4" />
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
            <ArrowUpDown className="ml-2 h-4 w-4" />
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
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <Listbox
            value={t(
              OrderStatusEnum[row.original.status ?? 0].toLocaleLowerCase(),
            )}
            onChange={(value: any) => updateStatus(row.original.id, value.id)}
          >
            {({ open }) => (
              <div className="w-44">
                <Listbox.Button
                  className="w-full rounded-lg border bg-white p-1
                         text-black dark:bg-darkBackground-800 dark:text-white"
                >
                  <div className="flex w-full items-center justify-between">
                    <span>
                      {t(
                        OrderStatusEnum[
                          row.original.status ?? 0
                        ].toLocaleLowerCase(),
                      )}
                    </span>
                    {open == true ? (
                      <FontAwesomeIcon icon={["fas", "chevron-up"]} />
                    ) : (
                      <FontAwesomeIcon icon={["fas", "chevron-down"]} />
                    )}
                  </div>
                </Listbox.Button>

                <Transition
                  show={open}
                  as={Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="opacity-0 translate-y-1"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 translate-y-1"
                >
                  <Listbox.Options className="absolute z-10 mt-2 w-44 rounded-lg bg-white shadow-lg dark:bg-darkBackground-800">
                    {statuses.map((value, index) => {
                      return (
                        <Listbox.Option
                          value={value}
                          key={index}
                          className="w-full cursor-pointer py-1 text-center text-black
                                            hover:text-orange-500 dark:text-white hover:dark:text-orange-500"
                        >
                          {t(value.key.toLocaleLowerCase())}
                        </Listbox.Option>
                      );
                    })}
                  </Listbox.Options>
                </Transition>
              </div>
            )}
          </Listbox>
        );
      },
      size: 100,
    },
  ];

  return columns;
}
