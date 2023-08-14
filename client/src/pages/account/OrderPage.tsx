import { NotFoundComponent } from "@/components";
import { Skeleton } from "@/components/ui/skeleton";
import { Image } from "@/components/utilities";
import { useLanguage } from "@/contexts";
import { authClient, baseOrdersURL, baseProductsURL } from "@/utilities";
import { OrderWithItems } from "@/utilities/models/account";
import { Separator } from "@radix-ui/react-separator";
import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

export default function OrderPage() {
    const { t } = useTranslation();

    const [order, setOrder] = useState<OrderWithItems>();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { orderId } = useParams();

    const { language } = useLanguage();

    if (orderId == undefined || orderId == '') {
        return (
            <div className="h-screen">
                <NotFoundComponent />
            </div>
        )
    }

    async function fetchOrder() {
        try {
            setIsLoading(true);
            var result = await authClient.get(`${baseOrdersURL()}api/orders/get/id/${orderId}`);
            var data = result.data as OrderWithItems;
            setOrder(data);
        }
        catch (error) {
            if (axios.isAxiosError(error)) {

            }
        }
        setIsLoading(false);
    }

    useEffect(() => {
        fetchOrder();
    }, [])

    if (!isLoading && order == null) {
        return (
            <div className="h-screen">
                <NotFoundComponent />
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-2 mt-2 mx-2 md:mx-0">
            <h1 className="my-2 text-2xl font-bold">Детайли за поръчката</h1>
            {isLoading ?
                <Skeleton className="h-48 w-full" />
                :
                <section className="grid grid-cols-3 p-2 rounded-lg bg-white dark:bg-gray-700 shadow-lg">
                    <div className="col-span-2">
                        <div className="grid grid-cols-2">
                            <span>Id на поръчка: </span>
                            <span className=" line-clamp-1">{order?.id}</span>
                        </div>
                        <div className="grid grid-cols-2">
                            <span>Дата на регистрация: </span>
                            <span>{moment(new Date(order?.orderDate!)).format("DD-MM-YYYY HH:mm")}</span>
                        </div>
                        <div className="grid grid-cols-2">
                            <span>Дължима сума: </span>
                            <span>{order?.orderSum} лв.</span>
                        </div>
                        <div className="grid grid-cols-2">
                            <span>Статус: </span>
                            <span>{order?.status}</span>
                        </div>
                    </div>
                </section>
            }
            {isLoading ?
                <Skeleton className="h-48 w-full" />
                :
                <section className="grid grid-cols-3 p-2 rounded-lg bg-white dark:bg-gray-700 shadow-lg">
                    <div>
                        Адрес за доставка
                    </div>
                    <div className="flex flex-col">
                        <span>{order?.address.firstName} {order?.address.lastName}</span>
                        <span>{order?.address.country} {order?.address.city}</span>
                        <span>{order?.address.streetAddress}</span>
                    </div>
                </section>
            }
            {isLoading ?
                <>
                    {new Array(3).fill(null).map((_, index) => {
                        return (
                            <Skeleton key={index} className="h-24 w-full" />
                        )
                    })}
                </>
                :
                <section className="p-2 rounded-lg bg-white dark:bg-gray-700 shadow-lg">
                    {order?.orderItems.map((orderItem, index) => {
                        return (
                            <div key={index} className="flex gap-2">
                                <Image src={`${baseProductsURL()}${orderItem.imageUrl}`} alt="orderItem" className="h-24 rounded" />
                                <div className="flex flex-col">
                                    <span>{orderItem.name.find(n => n.key == language.code)?.value}</span>
                                    <span>{(Number.parseFloat(orderItem.sum) / Number.parseInt(orderItem.count)).toFixed(2)} лв.</span>
                                    <span>{orderItem.count} бр.</span>
                                </div>
                            </div>
                        )
                    })}
                </section>}
            {isLoading ?
                <Skeleton className="h-12 w-full" />
                :
                <section className="grid grid-cols-9 p-2 items-center rounded-lg bg-white dark:bg-gray-700 shadow-lg">
                    <div className="col-span-4 flex justify-between">
                        <span>Начин на плащане: </span>
                        <span>С карта</span>
                    </div>
                    <Separator orientation="vertical" className="h-10 w-[1px] ml-2 bg-black dark:bg-white justify-self-center" />
                    <div className="col-span-4 flex justify-between ml-2">
                        <span>Сума за плащане: </span>
                        <span>{order?.orderSum} лв.</span>
                    </div>
                </section>}
        </div>
    )
}