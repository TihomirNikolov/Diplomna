import './App.css'
import { Layout, Routes, useData } from './components'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { BrowserRouter } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { User, useTheme, useUser } from './contexts'
import axios, { AxiosError } from 'axios'
import { TokenModel, authClient, baseURL, getRefreshToken, getTokenObject, setTokenObject } from './utilities'
import createAuthRefreshInterceptor from 'axios-auth-refresh'

library.add(fab, fas, far)

function App() {
  const { user, setUser } = useUser();
  const { theme } = useTheme();

  useEffect(() => {
    var usr = getTokenObject();

    function handleStorageEventHandler(event: StorageEvent) {
      if (event.key === 'token') {
        const user = JSON.parse(event.newValue!);
        setUser(user);
      }
    }

    window.addEventListener('storage', handleStorageEventHandler);

    return window.removeEventListener('storage', handleStorageEventHandler);
  })

  useEffect(() => {
    var tokenModel = getTokenObject();

    async function verifyEmail() {
      if (tokenModel != null) {
        try {
          var response = await authClient.get(`${baseURL()}api/user/emailVerification`);
          var isVerified = response.data as boolean;

          const user: User = { accessToken: tokenModel.accessToken, refreshToken: tokenModel.refreshToken, isEmailConfirmed: isVerified, role: 'user' }
          setUser(user);
        }
        catch (error) {
          setUser({ accessToken: '', isEmailConfirmed: false, refreshToken: '', role: 'user' });
        }
      }
      else {
        setUser({ accessToken: '', isEmailConfirmed: false, refreshToken: '', role: 'user' });
      }
    }

    verifyEmail();
  }, [])

  return (
    <div className='dark:bg-darkBackground-900 transition-colors duration-300 bg-lightBackground'>
      <BrowserRouter>
        <Layout />
        <Routes />
        <ToastContainer theme={theme} />
      </BrowserRouter>
    </div>
  )
}

export default App
