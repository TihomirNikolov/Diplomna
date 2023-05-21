import { Navigate, Route, Routes } from 'react-router-dom'
import {
    AccountPage, AddressPage, CategoryPage, ChangeEmailPage, ConfirmEmailPage, ForgottenPasswordPage, HomePage, LoginPage,
    MyAddressesPage, MyOrdersPage, NotFoundPage, PaymentCardsPage, ProductPage, RegisterPage,
    ResetPasswordPage, ShoppingCartPage, WishlistPage
} from '../../pages'
import ProtectedRoute from './ProtectedRoute'
import AuthRoute from './AuthRoute'
import { AccountLayout } from '../layouts'

interface Props {
    isLoading: boolean
}

export default function Router(props: Props) {

    function homeRoutes() {
        return ['/home', '/logout'].map(function (path, index) {
            return <Route path={path} element={<Navigate to='/' />} key={index} />
        })
    }
    return (
        <Routes>
            <Route path={''} element={<HomePage />} />
            {homeRoutes()}
            <Route path='/checkout/cart' element={<ShoppingCartPage />} />
            <Route path='/email/verify/:emailConfirmToken' element={<ConfirmEmailPage />} />
            <Route path='/email/change/:emailChangeToken' element={<ChangeEmailPage />} />
            <Route path='/category/*' element={<CategoryPage />} />
            <Route path='/product/*' element={<ProductPage></ProductPage>} />
            <Route element={<AuthRoute isLoading={props.isLoading} />}>
                <Route path='/login' element={<LoginPage />} />
                <Route path='/register' element={<RegisterPage />} />
                <Route path='/forgotpassword' element={<ForgottenPasswordPage />} />
                <Route path='/password/reset/:resetToken' element={<ResetPasswordPage />} />
            </Route>
            <Route element={<ProtectedRoute isLoading={props.isLoading} />}>
                <Route path='/account' element={<AccountLayout><AccountPage /></AccountLayout>} />
                <Route path='/account/address' element={<AccountLayout><MyAddressesPage /></AccountLayout>} />
                <Route path='/payments/cards' element={<AccountLayout><PaymentCardsPage /></AccountLayout>} />
                <Route path='/account/history' element={<AccountLayout><MyOrdersPage /></AccountLayout>} />
                <Route path='/wishlist' element={<AccountLayout><WishlistPage /></AccountLayout>} />
                <Route path='/account/address/add' element={<AccountLayout><AddressPage /></AccountLayout>} />
                <Route path='/account/address/edit/id/:id' element={<AccountLayout><AddressPage /></AccountLayout>} />
            </Route>
            <Route path='/404' element={<NotFoundPage />} />
            <Route path='*' element={<NotFoundPage />} />
        </Routes>
    )
}