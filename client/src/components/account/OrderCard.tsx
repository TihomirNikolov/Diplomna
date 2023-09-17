import { Order, OrderStatusEnum } from "@/utilities/models/account"
import moment from "moment"
import { Link } from "react-router-dom"
import { BlackWhiteButton } from "../buttons"
import { useTranslation } from "react-i18next"

interface Props {
    order: Order
}

export default function OrderCard({ order }: Props) {
    const { t } = useTranslation();
    
    return (
        <section className="grid grid-cols-3 border rounded-lg border-gray-300 dark:border-gray-700 p-2">
            <div className="col-span-2">
                <div className="grid grid-cols-2">
                    <span>Id на поръчка: </span>
                    <span className=" line-clamp-1">{order.id}</span>
                </div>
                <div className="grid grid-cols-2">
                    <span>Дата на регистрация: </span>
                    <span>{moment(new Date(order.orderDate)).format("DD-MM-YYYY HH:mm")}</span>
                </div>
                <div className="grid grid-cols-2">
                    <span>Дължима сума: </span>
                    <span>{order.orderSum} лв.</span>
                </div>
                <div className="grid grid-cols-2">
                    <span>Статус: </span>
                    <span>{t(OrderStatusEnum[order.status as OrderStatusEnum].toString().toLocaleLowerCase())}</span>
                </div>
            </div>
            <div className="grid justify-items-end">
                <Link to={`/sales/order/${order.id}`} className="h-fit border-2 border-black dark:border-white px-5 py-1 rounded-lg 
                            hover:bg-black hover:dark:bg-white text-black dark:text-white
                             hover:text-white hover:dark:text-black">
                    Виж поръчка
                </Link>
            </div>
        </section>
    )
}