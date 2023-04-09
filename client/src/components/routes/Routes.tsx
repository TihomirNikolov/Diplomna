import { Navigate, Route, Routes, useRoutes } from 'react-router-dom'
import { ForgottenPasswordPage, HomePage, LoginPage, NotFoundPage, SignUpPage } from '../../pages'
import ProtectedRoute from './ProtectedRoute'
import AuthRoute from './AuthRoute'

export default function Router() {

    function homeRoutes(){
        return ['/home','/logout'].map(function (path, index){
            return <Route path={path} element={<Navigate to='/'/>} key={index}/>
        })
    }

    return (
        <Routes>
            <Route path={''} element={<HomePage/>}/>
            {homeRoutes()}
            <Route element={<AuthRoute />}>
                <Route path='/login' element={<LoginPage />} />
                <Route path='/signup' element={<SignUpPage />} />
                <Route path='/forgotpassword' element={<ForgottenPasswordPage />} />
            </Route>
            <Route path='/404' element={<NotFoundPage />} />
            <Route path='*' element={<Navigate to='/404' />} />
        </Routes>
    )
}