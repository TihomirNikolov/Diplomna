import { useTitle } from "@/components";
import { CreateCard } from "@/components/account/PaymentCardComponent";
import {
  FinishPageAddressComponent,
  FinishPagePaymentsComponent,
} from "@/components/finishPage";
import { FinishPageAddressHandle } from "@/components/finishPage/FinishPageAddressComponent";
import { FinishPagePaymentsHandle } from "@/components/finishPage/FinishPagePaymentsComponent";
import { Textarea } from "@/components/ui/textarea";
import { useShoppingCart, useUser } from "@/contexts";
import {
  Address,
  authClient,
  axiosClient,
  baseOrdersURL,
  baseProductsURL,
  baseShoppingCartURL,
  notification,
} from "@/utilities";
import { OrderItem } from "@/utilities/models/account";
import { Card } from "@/utilities/models/checkout/Card";
import { StoreProduct } from "@/utilities/models/store/Product";
import { AreProductsAvailableRequest } from "@/utilities/requests";
import { AreProductsAvailableResponse } from "@/utilities/responses";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const initialAddress: Address = {
  city: "",
  country: "",
  firstName: "",
  id: 0,
  isDefault: false,
  lastName: "",
  phoneNumber: "",
  postalCode: "",
  region: "",
  streetAddress: "",
};

const initialNewCard: CreateCard = {
  cardNumber: "",
  cardholderName: "",
  month: "January",
  year: "2023",
  cardType: "None",
  cvv: "",
};

const initialCard: Card = {
  id: "",
  last4: "",
  type: "",
};

export default function FinishOrderPage() {
  const { t } = useTranslation();
  useTitle(t("title.finishOrder"));

  const { isAuthenticated } = useUser();
  const { sum, shoppingCartItems, deleteShoppingCart } = useShoppingCart();

  const addressRef = useRef<FinishPageAddressHandle>(null);
  const paymentsRef = useRef<FinishPagePaymentsHandle>(null);

  const [address, setAddress] = useState<Address>(initialAddress);
  const [newCard, setNewCard] = useState<CreateCard>(initialNewCard);
  const [card, setCard] = useState<Card>(initialCard);
  const [comment, setComment] = useState<string>("");

  const navigate = useNavigate();

  async function onSubmit() {
    console.log("is new card: " + paymentsRef.current?.isNewCard);
    if (!addressRef.current?.validate()) {
      notification.error(t("errorInput.addressInputInvalid"), "top-center");
      return;
    }

    if (!paymentsRef.current?.validate()) {
      notification.error(t("errorInput.cardInputInvalid"), "top-center");
      return;
    }

    try {
      var storeProducts: StoreProduct[] = [];
      for (var item of shoppingCartItems) {
        storeProducts.push({
          storeId: item.storeId,
          productId: item.productId,
          count: item.number,
        });
      }
      var request: AreProductsAvailableRequest = {
        storeProducts: storeProducts,
      };
      var response = await axiosClient.post(
        `${baseProductsURL()}api/stores/available`,
        request,
      );
      var data = response.data as AreProductsAvailableResponse;
      if (!data.isSuccessful) {
        notification.error("error", "top-center");
        return;
      }

      var items: OrderItem[] = [];
      for (var item of shoppingCartItems) {
        var price = item.discount > 0 ? item.discountedPrice : item.price;
        items.push({
          productId: item.productId,
          count: item.number.toString(),
          sum: (price * item.number).toString(),
          storeId: item.storeId,
        });
      }
      if (isAuthenticated) {
        var response = await authClient.post(
          `${baseOrdersURL()}api/orders/create/email`,
          {
            orderItems: items,
            comment: comment,
            address: address,
            isNewAddress: addressRef.current.isNewAddress,
            cardPayment: {
              cardId: card.id,
              newCard: newCard,
              isPaymentWithNewCard: paymentsRef.current.isNewCard,
            },
          },
        );
      } else {
        var response = await axiosClient.post(
          `${baseOrdersURL()}api/orders/create/browserid`,
          {
            orderItems: items,
            comment: comment,
            browserId: localStorage.getItem("uuid"),
            address: address,
            isNewAddress: addressRef.current.isNewAddress,
            cardPayment: {
              cardId: card.id,
              newCard: newCard,
              isPaymentWithNewCard: paymentsRef.current.isNewCard,
            },
          },
        );
      }
      await deleteShoppingCart();
      navigate("/order/successful", {
        state: { orderId: response.data as string },
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
      }
      console.log(error);
    }
  }

  return (
    <div className="grid px-3 md:grid-cols-12 md:px-0">
      <div className="md:col-span-8 md:col-start-3">
        <h1 className="text-2xl font-bold text-black dark:text-white">
          {t("title.finishOrder")}
        </h1>
        <div className="mt-10 grid space-x-2 md:grid-cols-6">
          <div className="col-span-4">
            <section className="rounded-lg border border-gray-300 px-2 py-2 dark:border-gray-800">
              <h1 className="py-2 text-2xl font-bold text-black dark:text-white">
                {t("address.address")}
              </h1>
              <FinishPageAddressComponent
                ref={addressRef}
                address={address}
                setAddress={setAddress}
              />
            </section>
            <section className="mt-10 rounded-lg border border-gray-300 px-2 py-2 dark:border-gray-800">
              <h1 className="py-2 text-2xl font-bold text-black dark:text-white">
                {t("paymentMethod")}
              </h1>
              <FinishPagePaymentsComponent
                ref={paymentsRef}
                card={card}
                setCard={setCard}
                newCard={newCard}
                setNewCard={setNewCard}
              />
            </section>
          </div>

          <section className="col-span-2 hidden md:block">
            <Finish sum={sum} onSubmit={onSubmit} />
          </section>
        </div>

        <section className="mt-10 rounded-lg border border-gray-300 px-2 py-2 dark:border-gray-800">
          <div className="flex items-center space-x-2 py-2">
            <FontAwesomeIcon
              icon={["fas", "comment"]}
              size="2x"
              className="text-black dark:text-white"
            />
            <h1 className="text-2xl font-bold text-black dark:text-white">
              {t("addComment")}
            </h1>
          </div>
          <Textarea
            className="text-black dark:text-white"
            placeholder={t("comment") || ""}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </section>

        <section className="col-span-2 md:hidden">
          <Finish sum={sum} onSubmit={onSubmit} />
        </section>
      </div>
    </div>
  );
}

interface FinishProps {
  sum: number;
  onSubmit: () => void;
}

function Finish({ sum, onSubmit }: FinishProps) {
  const { t } = useTranslation();

  return (
    <>
      <div
        className="flex max-h-56 flex-col justify-between rounded-lg border border-gray-300 py-2
                                    text-black dark:border-gray-800 dark:text-white"
      >
        <div className="flex items-center space-x-2 px-2">
          <FontAwesomeIcon icon={["fas", "money-bill"]} />
          <h1 className="text-2xl">{t("dueAmmount")}</h1>
        </div>
        <div className="flex w-full justify-end px-2">
          <span className="text-2xl">{t("total")}: </span>
          <span className="text-2xl">{sum}</span>
        </div>
      </div>
      <button
        className="mt-5 w-full rounded-lg bg-orange-600 py-2 text-center text-white hover:bg-orange-700"
        onClick={onSubmit}
      >
        {t("finishOrder")}
      </button>
    </>
  );
}
