import CheckBox from "@/components/inputs/CheckBox";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { authClient, baseUserURL } from "@/utilities";
import { UserDTO } from "@/utilities/models/user";
import { ColumnDef } from "@tanstack/react-table";
import axios from "axios";
import { ArrowUpDown } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function AdminPanelPage() {
  const { t } = useTranslation();
  const [users, setUsers] = useState<UserDTO[]>([]);

  const columns: ColumnDef<UserDTO>[] = [
    {
      accessorKey: "id",
      header: ({ column }) => {
        return (
          <Button
            className="w-full justify-start"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t("id")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "email",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Email
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t("name")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "isActive",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t("active")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-center">
            <CheckBox
              id={`checkbox ${row.index}`}
              checked={row.original.isActive}
              onChange={() => changeUserActiveStatus(row.original.id)}
            />
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      var result = await authClient.get(`${baseUserURL()}api/user/get-all`);

      var data = result.data as UserDTO[];
      setUsers(data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
      }
    }
  }

  async function changeUserActiveStatus(userId: string) {
    try {
      authClient.put(`${baseUserURL()}api/user/change-active-status/${userId}`);
      setUsers((prev) => {
        var newUsers = [...prev];

        var usr = newUsers.find((u) => u.id == userId)!;

        usr.isActive = !usr.isActive;

        return newUsers;
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
      }
    }
  }

  return (
    <div className="grid grid-cols-12">
      <div className="col-span-8 col-start-3 my-5">
        <DataTable columns={columns} data={users} />
      </div>
    </div>
  );
}
