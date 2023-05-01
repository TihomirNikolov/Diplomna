import { Navigate, Route, Routes } from 'react-router-dom'
import { AccountPage, ConfrimEmailPage, ForgottenPasswordPage, HomePage, LoginPage, MyAddressesPage, MyOrdersPage, NotFoundPage, PaymentCardsPage, ResetPasswordPage, ShoppingCartPage, SignUpPage, WishlistPage } from '../../pages'
import ProtectedRoute from './ProtectedRoute'
import AuthRoute from './AuthRoute'
import { AccountLayout } from '../layouts'


export default function Router() {

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
            <Route path='/email/verify/:emailConfirmToken' element={<ConfrimEmailPage />} />
            <Route element={<AuthRoute />}>
                <Route path='/login' element={<LoginPage />} />
                <Route path='/signup' element={<SignUpPage />} />
                <Route path='/forgotpassword' element={<ForgottenPasswordPage />} />
                <Route path='/password/reset/:resetToken' element={<ResetPasswordPage />} />
            </Route>
            <Route element={<ProtectedRoute />}>
                <Route path='/account' element={<AccountLayout><AccountPage /></AccountLayout>} />
                <Route path='/account/address' element={<AccountLayout><MyAddressesPage /></AccountLayout>} />
                <Route path='/payments/cards' element={<AccountLayout><PaymentCardsPage /></AccountLayout>} />
                <Route path='/account/history' element={<AccountLayout><MyOrdersPage /></AccountLayout>} />
                <Route path='/wishlist' element={<AccountLayout><WishlistPage /></AccountLayout>} />
            </Route>
            <Route path='/404' element={<NotFoundPage />} />
            <Route path='*' element={<Navigate to='/404' />} />
        </Routes>
    )
}