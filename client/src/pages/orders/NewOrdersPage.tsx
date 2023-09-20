import useOrderColumns from "@/components/hooks/useOrderColumns";
import { DataTable } from "@/components/ui/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { Image } from "@/components/utilities";
import { authClient, baseOrdersURL, baseProductsURL } from "@/utilities";
import {
  FullOrderItem,
  Order,
  OrderStatusEnum,
} from "@/utilities/models/account";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import SlideDown from "react-slidedown";

export default function NewOrdersPage() {
  const { t } = useTranslation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order>();
  const [orderItems, setOrderItems] = useState<FullOrderItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [areDetailsVisible, setAreDetailsVisible] = useState<boolean>(false);
  const columns = useOrderColumns({ updateStatus, onDetailsClicked });

  const slideDownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      var result = await authClient.get(`${baseOrdersURL()}api/orders/get-new`);

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
        var newOrders = prev.filter((o) => o.id != orderId);
        return newOrders;
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
      }
    }
  }

  async function onDetailsClicked(orderId: string) {
    try {
      var response = await authClient.get(
        `${baseOrdersURL()}api/orders/order-items/${orderId}`,
      );
      var items = response.data as FullOrderItem[];
      setOrderItems(items);
      setSelectedOrder(orders.find((o) => o.id == orderId));
      setAreDetailsVisible(true);
    } catch (error) {}
  }

  useEffect(() => {
    slideDownRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [areDetailsVisible]);

  return (
    <div className="mt-5">
      {isLoading ? (
        <Skeleton className="h-56 w-full" />
      ) : (
        <DataTable columns={columns} data={orders} />
      )}
      <SlideDown ref={slideDownRef} className={"my-dropdown-slidedown"}>
        {areDetailsVisible ? (
          <div>
            {orderItems.map((item, index) => {
              return (
                <div key={`${item.name} ${index}`}>
                  <Image
                    alt="product"
                    src={`${baseProductsURL()}${item.imageUrl}`}
                    className="w-56"
                  />
                </div>
              );
            })}
          </div>
        ) : null}
      </SlideDown>
    </div>
  );
}
