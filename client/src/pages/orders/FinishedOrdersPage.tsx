import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient, baseOrdersURL } from "@/utilities";
import { Order, OrderStatusEnum } from "@/utilities/models/account";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Listbox, Transition } from "@headlessui/react";
import { ColumnDef } from "@tanstack/react-table";
import axios from "axios";
import { ArrowUpDown } from "lucide-react";
import moment from "moment";
import React, { LegacyRef, useRef } from "react";
import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import SlideDown from "react-slidedown";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Cell,
} from "recharts";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function FinishedOrdersPage() {
  const { t } = useTranslation();
  const [data, setData] = useState<{ name: string; total: number }[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedMonth, setSeletedMonth] = useState<string>("");

  const [selectedYear, setSelectedYear] = useState<string>("2023");
  const [isTableVisible, setIsTableVisible] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const slideDownRef = useRef<HTMLDivElement>(null);

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
            {t("usersId")}
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
          <span>
            {t(OrderStatusEnum[row.original.status ?? 0])}
          </span>
        );
      },
      size: 100,
    },
  ];

  useEffect(() => {
    fetchData(selectedYear);
  }, []);

  async function fetchData(year: string) {
    try {
      setIsLoading(true);
      var result = await authClient.get(
        `${baseOrdersURL()}api/orders/get-finishedCount/${year}`,
      );

      var data = result.data as { name: string; total: number }[];
      setData(data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
      }
    }
    setIsLoading(false);
  }

  function getYears() {
    var startYear = 2012;
    var years: string[] = [];
    for (var year = startYear; year <= new Date().getFullYear(); year++) {
      years.push(year.toString());
    }

    return years;
  }

  function onSelectedYearChanged(year: string) {
    setSelectedYear(year);
    fetchData(year);
  }

  async function onSelectedMonth(e: any) {
    try {
      var month = months.findIndex((m) => m == e.name) + 1;
      var result = await authClient.get(
        `${baseOrdersURL()}api/orders/get-finished/${month}`,
      );
      var data = result.data as Order[];
      setOrders(data);
      setIsTableVisible(true);
      setSeletedMonth(e.name);
    } catch (error) {
      if (axios.isAxiosError(error)) {
      }
    }
  }

  useEffect(() => {
    slideDownRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedMonth]);

  return (
    <div className="mx-2 mt-5 md:mx-0">
      {isLoading ? (
        <Skeleton />
      ) : (
        <div className="grid gap-5">
          <Listbox value={selectedYear} onChange={onSelectedYearChanged}>
            {({ open }) => (
              <div className="relative w-44">
                <Listbox.Button className="w-full rounded-lg border bg-white p-1 text-black dark:bg-darkBackground-800 dark:text-white">
                  <div className="flex w-full items-center justify-between">
                    <span>{selectedYear}</span>
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
                  <Listbox.Options className="absolute z-10 w-full rounded-lg bg-white shadow-lg dark:bg-darkBackground-800">
                    {getYears().map((value, index) => {
                      return (
                        <Listbox.Option
                          value={value}
                          key={index}
                          className="w-full cursor-pointer py-1 text-center text-black
                                    hover:text-orange-500 dark:text-white hover:dark:text-orange-500"
                        >
                          {value}
                        </Listbox.Option>
                      );
                    })}
                  </Listbox.Options>
                </Transition>
              </div>
            )}
          </Listbox>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}>
              <XAxis
                dataKey="name"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => {
                  return t(value);
                }}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Bar
                dataKey="total"
                fill="#adfa1d"
                radius={[4, 4, 0, 0]}
                onClick={onSelectedMonth}
              >
                {data.map((item, index) => {
                  return (
                    <Cell
                      key={index}
                      fill={selectedMonth == item.name ? "#67fa1d" : "#adfa1d"}
                    />
                  );
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <SlideDown ref={slideDownRef} className={"my-dropdown-slidedown"}>
        {isTableVisible ? <DataTable columns={columns} data={orders} /> : null}
      </SlideDown>
    </div>
  );
}
