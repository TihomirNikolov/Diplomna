import './App.css'
import { Layout, Routes } from './components'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { BrowserRouter } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { User, useTheme, useUser } from './contexts'
import { TokenModel, authClient, axiosClient, baseURL, removeTokenObject } from './utilities'
import axios, { AxiosRequestConfig } from 'axios'

library.add(fab, fas, far)

function App() {
  const [isLoadingState, setIsLoadingState] = useState<boolean>(true);

  const { setUser, setRole, setIsEmailConfirmed } = useUser();
  const { theme } = useTheme();

  let isRefreshing = false;
  let refreshSubscribers: ((token: string) => void)[] = [];

  useEffect(() => {
    authClient.interceptors.response.use(
      function (response) {
        return response;
      },
      async function (error) {
        const config: AxiosRequestConfig = error.config;
        if (error.response?.status === 401) {
          if (isRefreshing) {
            try {
              const token = await new Promise<string>((resolve) => {
                refreshSubscribers.push((token) => resolve(token));
              });
              return axiosClient.request(config);
            } catch (e) {
              return Promise.reject(e);
            }
          }

          isRefreshing = true;
          try {
            var response = await axiosClient.post(`${baseURL()}api/authenticate/refresh-token`, { refreshToken: "" });
            var data = response.data as User;
            setUser(data);

            refreshSubscribers.forEach((subscriber) => subscriber(data.accessToken));
            refreshSubscribers = [];

            return axiosClient.request(config);
          }
          catch (err) {
            setUser({ accessToken: "", refreshToken: "" });

          }
          finally {
            isRefreshing = false;
          }
        }
        return Promise.reject(error);
      }
    );
  }, [])

  useEffect(() => {
    async function isLogged() {
      setIsLoadingState(true);
      try {
        var response = await authClient.get(`${baseURL()}api/authenticate/is-logged`);
        var tokenModel = response.data as TokenModel;

        const user: User = { accessToken: tokenModel.accessToken, refreshToken: tokenModel.refreshToken }
        setUser(user);
        setRole('user');
        setIsEmailConfirmed(tokenModel.isEmailConfirmed);
      }
      catch (error) {

      }

      setIsLoadingState(false);
    }

    isLogged();
  }, [])

  return (
    <div className='dark:bg-darkBackground-900 transition-colors duration-300 bg-lightBackground'>
      <BrowserRouter>
        <Layout />
        <Routes isLoading={isLoadingState} />
        <ToastContainer theme={theme} />
      </BrowserRouter>
    </div>
  )
}

export default App
