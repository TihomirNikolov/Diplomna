import { Order, OrderStatusEnum } from "@/utilities/models/account";
import moment from "moment";
import { Link } from "react-router-dom";
import { BlackWhiteButton } from "../buttons";
import { useTranslation } from "react-i18next";

interface Props {
  order: Order;
}

export default function OrderCard({ order }: Props) {
  const { t } = useTranslation();

  return (
    <section className="grid grid-cols-3 rounded-lg border border-gray-300 p-2 dark:border-gray-700">
      <div className="col-span-2">
        <div className="grid grid-cols-2">
          <span>{t("orderId")}: </span>
          <span className=" line-clamp-1">{order.id}</span>
        </div>
        <div className="grid grid-cols-2">
          <span>{t("orderDate")}: </span>
          <span>
            {moment(new Date(order.orderDate)).format("DD-MM-YYYY HH:mm")}
          </span>
        </div>
        <div className="grid grid-cols-2">
          <span>{t("dueAmount")}: </span>
          <span>
            {order.orderSum} {t("lv")}
          </span>
        </div>
        <div className="grid grid-cols-2">
          <span>{t("status")}: </span>
          <span>
            {t(
              OrderStatusEnum[order.status]
                .toString(),
            )}
          </span>
        </div>
      </div>
      <div className="grid justify-items-end">
        <Link
          to={`/sales/order/${order.id}`}
          className="h-fit rounded-lg border-2 border-black px-5 py-1 text-black 
                            hover:bg-black hover:text-white dark:border-white dark:text-white
                             hover:dark:bg-white hover:dark:text-black"
        >
          {t("viewOrder")}
        </Link>
      </div>
    </section>
  );
}
