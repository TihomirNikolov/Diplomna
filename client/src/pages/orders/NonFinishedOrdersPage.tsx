import useOrderColumns from "@/components/hooks/useOrderColumns";
import { DataTable } from "@/components/ui/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient, baseOrdersURL } from "@/utilities";
import { Order, OrderStatusEnum } from "@/utilities/models/account";
import axios from "axios";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function NonFinishedOrdersPage() {
  const { t } = useTranslation();
  const [orders, setOrders] = useState<Order[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const columns = useOrderColumns({ updateStatus });

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      var result = await authClient.get(
        `${baseOrdersURL()}api/orders/get-non-finished`,
      );

      var data = result.data as Order[];
      setOrders(data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
      }
    }
    setIsLoading(false);
  }

  async function updateStatus(orderId: string, status: OrderStatusEnum) {
    try {
      await authClient.put(`${baseOrdersURL()}api/orders/update-status`, {
        orderId: orderId,
        orderStatus: status,
      });
      setOrders((prev) => {
        var newOrders = [...prev];
        if (
          status == OrderStatusEnum.New ||
          status == OrderStatusEnum.Delivered ||
          status == OrderStatusEnum.Cancelled
        ) {
          newOrders = newOrders.filter((o) => o.id != orderId);
        } else {
          var newOrder = newOrders.find((o) => o.id == orderId)!;
          newOrder.status = status;
        }

        return newOrders;
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
      }
    }
  }

  return (
    <div className="mt-5">
      {isLoading ? (
        <Skeleton className="h-56 w-full" />
      ) : (
        <DataTable columns={columns} data={orders} />
      )}
    </div>
  );
}
