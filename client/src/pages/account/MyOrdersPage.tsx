import { useTranslation } from "react-i18next";
import { useTitle } from "../../components";
import { useEffect, useState } from "react";
import { Order } from "@/utilities/models/account";
import axios from "axios";
import { authClient, baseOrdersURL } from "@/utilities";
import { OrderCard } from "@/components/account";
import { Skeleton } from "@/components/ui/skeleton";

export default function MyOrdersPage() {
    const { t } = useTranslation();
    useTitle(t('title.myOrders'));

    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    async function fetchOrders() {
        try {
            setIsLoading(true);
            var result = await authClient.get(`${baseOrdersURL()}api/orders/get`);
            var data = result.data as Order[];
            setOrders(data)
        }
        catch (error) {
            if (axios.isAxiosError(error)) {

            }
        }
        setIsLoading(false);
    }

    useEffect(() => {
        fetchOrders();
    }, [])

    return (
        <div className="mx-2 md:mx-0">
            <h1 className="my-2 text-2xl font-bold">{t('title.myOrders')}</h1>
            {isLoading ?
                <div className="flex flex-col space-y-2">
                    {new Array(3).fill(null).map((_, index) => {
                        return (
                            <Skeleton key={index} className="h-28 w-full" />
                        )
                    })}
                </div>
                :
                <div className="flex flex-col gap-2">
                    {orders.map((order, index) => {
                        return (
                            <OrderCard key={index} order={order} />
                        )
                    })}
                </div>
            }
        </div>
    )
}