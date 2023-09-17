import { Navigate, Route, Routes } from "react-router-dom";
import { HomePage } from "../../pages";
import ProtectedRoute from "./ProtectedRoute";
import AuthRoute from "./AuthRoute";
import { AccountLayout, EmployeeLayout } from "../layouts";
import { Suspense, lazy } from "react";
import UserLoadedRoute from "./UserLoadedRoute";
import RoleProtectedRoute from "./RoleProtectedRoute";

const AccountPage = lazy(() =>
  import("../../pages").then((module) => ({ default: module.AccountPage })),
);
const AddressPage = lazy(() =>
  import("../../pages").then((module) => ({ default: module.AddressPage })),
);
const CategoryPage = lazy(() =>
  import("../../pages").then((module) => ({ default: module.CategoryPage })),
);
const ChangeEmailPage = lazy(() =>
  import("../../pages").then((module) => ({ default: module.ChangeEmailPage })),
);
const ConfirmEmailPage = lazy(() =>
  import("../../pages").then((module) => ({
    default: module.ConfirmEmailPage,
  })),
);
const ForgottenPasswordPage = lazy(() =>
  import("../../pages").then((module) => ({
    default: module.ForgottenPasswordPage,
  })),
);
const LoginPage = lazy(() =>
  import("../../pages").then((module) => ({ default: module.LoginPage })),
);
const MyAddressesPage = lazy(() =>
  import("../../pages").then((module) => ({ default: module.MyAddressesPage })),
);
const MyOrdersPage = lazy(() =>
  import("../../pages").then((module) => ({ default: module.MyOrdersPage })),
);
const OrderPage = lazy(() =>
  import("../../pages").then((module) => ({ default: module.OrderPage })),
);
const NotFoundPage = lazy(() =>
  import("../../pages").then((module) => ({ default: module.NotFoundPage })),
);
const PaymentCardsPage = lazy(() =>
  import("../../pages").then((module) => ({
    default: module.PaymentCardsPage,
  })),
);
const AddPaymentCardPage = lazy(() =>
  import("../../pages").then((module) => ({
    default: module.AddPaymentCardPage,
  })),
);
const ProductPage = lazy(() =>
  import("../../pages").then((module) => ({ default: module.ProductPage })),
);
const RegisterPage = lazy(() =>
  import("../../pages").then((module) => ({ default: module.RegisterPage })),
);
const ResetPasswordPage = lazy(() =>
  import("../../pages").then((module) => ({
    default: module.ResetPasswordPage,
  })),
);
const ShoppingCartPage = lazy(() =>
  import("../../pages").then((module) => ({
    default: module.ShoppingCartPage,
  })),
);
const FinishOrderPage = lazy(() =>
  import("../../pages").then((module) => ({ default: module.FinishOrderPage })),
);
const WishlistPage = lazy(() =>
  import("../../pages").then((module) => ({ default: module.WishlistPage })),
);
const SearchPage = lazy(() =>
  import("../../pages").then((module) => ({ default: module.SearchPage })),
);
const NewOrderMadePage = lazy(() =>
  import("../../pages").then((module) => ({
    default: module.NewOrderMadePage,
  })),
);
const AdminPanelPage = lazy(() =>
  import("../../pages").then((module) => ({ default: module.AdminPanelPage })),
);
const OwnerPanelPage = lazy(() =>
  import("../../pages").then((module) => ({ default: module.OwnerPanelPage })),
);
const NewOrdersPage = lazy(() =>
  import("../../pages").then((module) => ({ default: module.NewOrdersPage })),
);
const FinishedOrdersPage = lazy(() =>
  import("../../pages").then((module) => ({
    default: module.FinishedOrdersPage,
  })),
);
const NonFinishedOrdersPage = lazy(() =>
  import("../../pages").then((module) => ({
    default: module.NonFinishedOrdersPage,
  })),
);
const CancelledOrdersPage = lazy(() =>
  import("../../pages").then((module) => ({
    default: module.CancelledOrdersPage,
  })),
);

export default function Router() {
  function homeRoutes() {
    return ["/home", "/logout"].map(function (path, index) {
      return <Route path={path} element={<Navigate to="/" />} key={index} />;
    });
  }
  return (
    <Suspense fallback={<div></div>}>
      <Routes>
        <Route path="/checkout/cart" element={<ShoppingCartPage />} />
        <Route path="/checkout/finish" element={<FinishOrderPage />} />
        <Route
          path="/email/verify/:emailConfirmToken"
          element={<ConfirmEmailPage />}
        />
        <Route
          path="/email/change/:emailChangeToken"
          element={<ChangeEmailPage />}
        />
        <Route path="/order/successful" element={<NewOrderMadePage />} />
        <Route path="/search/:searchText" element={<SearchPage />} />

        <Route element={<UserLoadedRoute />}>
          <Route path={""} element={<HomePage />} />
          {homeRoutes()}
          <Route path="/category/*" element={<CategoryPage />} />
          <Route path="/product/:productUrl" element={<ProductPage />} />
        </Route>

        <Route element={<AuthRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgotpassword" element={<ForgottenPasswordPage />} />
          <Route
            path="/password/reset/:resetToken"
            element={<ResetPasswordPage />}
          />
        </Route>

        <Route element={<RoleProtectedRoute role="Administrator" />}>
          <Route path="/admin-panel" element={<AdminPanelPage />} />
        </Route>

        <Route element={<RoleProtectedRoute role="Owner" />}>
          <Route path="/owner-panel" element={<OwnerPanelPage />} />
        </Route>

        <Route element={<RoleProtectedRoute role="Employee" />}>
          <Route
            path="/employee-panel/new-orders"
            element={
              <EmployeeLayout>
                <NewOrdersPage />
              </EmployeeLayout>
            }
          />
          <Route
            path="/employee-panel/finished-orders"
            element={
              <EmployeeLayout>
                <FinishedOrdersPage />
              </EmployeeLayout>
            }
          />
          <Route
            path="/employee-panel/nonfinished-orders"
            element={
              <EmployeeLayout>
                <NonFinishedOrdersPage />
              </EmployeeLayout>
            }
          />
          <Route
            path="/employee-panel/cancelled-orders"
            element={
              <EmployeeLayout>
                <CancelledOrdersPage />
              </EmployeeLayout>
            }
          />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route
            path="/account"
            element={
              <AccountLayout>
                <AccountPage />
              </AccountLayout>
            }
          />
          <Route
            path="/account/address"
            element={
              <AccountLayout>
                <MyAddressesPage />
              </AccountLayout>
            }
          />
          <Route
            path="/payments/cards"
            element={
              <AccountLayout>
                <PaymentCardsPage />
              </AccountLayout>
            }
          />
          <Route
            path="/payments/cards/add"
            element={
              <AccountLayout>
                <AddPaymentCardPage />
              </AccountLayout>
            }
          />
          <Route
            path="/sales/order/history"
            element={
              <AccountLayout>
                <MyOrdersPage />
              </AccountLayout>
            }
          />
          <Route
            path="/sales/order/:orderId"
            element={
              <AccountLayout>
                <OrderPage />
              </AccountLayout>
            }
          />
          <Route
            path="/wishlist"
            element={
              <AccountLayout>
                <WishlistPage />
              </AccountLayout>
            }
          />
          <Route
            path="/account/address/add"
            element={
              <AccountLayout>
                <AddressPage />
              </AccountLayout>
            }
          />
          <Route
            path="/account/address/edit/id/:id"
            element={
              <AccountLayout>
                <AddressPage />
              </AccountLayout>
            }
          />
        </Route>

        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
