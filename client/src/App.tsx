import { Footer, Layout, Routes, ScrollToTop } from './components'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { BrowserRouter } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { User, useTheme, useUser } from './contexts'
import { authClient, axiosClient, baseUserURL, getAccessToken, getRefreshToken, removeTokenObject, setTokenObject } from './utilities'
import { AxiosRequestConfig } from 'axios'
import { v4 as uuidv4 } from 'uuid'
import { Chatbot } from './components/utilities'

library.add(fab, fas, far)

function App() {
  const { setUser, setIsAuthenticated } = useUser();
  const { theme } = useTheme();

  let isRefreshing = false;
  let refreshSubscribers: ((user: User) => void)[] = [];

  function checkForUserId() {
    if (localStorage.getItem('uuid') == null) {
      var userId = uuidv4();
      localStorage.setItem('uuid', userId);
    }
  }

  useEffect(() => {
    checkForUserId();

    axiosClient.interceptors.request.use((config) => {
      config.headers['BrowserId'] = localStorage.getItem('uuid');
      return config;
    })

    authClient.interceptors.request.use((config) => {
      config.headers['Authorization'] = 'Bearer ' + getAccessToken();
      config.headers['RefreshToken'] = getRefreshToken();

      return config;
    })

    authClient.interceptors.response.use(
      function (response) {
        return response;
      },
      async function (error) {
        const config: AxiosRequestConfig = error.config;
        if (error.response?.status === 401) {
          if (isRefreshing) {
            try {
              const user = await new Promise<User>((resolve) => {
                refreshSubscribers.push(user => resolve(user));
              });
              config.headers!['Authorization'] = 'Bearer ' + user.accessToken;
              config.headers!['RefreshToken'] = user.refreshToken;
              return axiosClient.request(config);
            } catch (e) {
              return Promise.reject(e);
            }
          }

          isRefreshing = true;
          try {
            var response = await axiosClient.post(`${baseUserURL()}api/authenticate/refresh-token`, { refreshToken: "" }, {
              headers: {
                Authorization: "Bearer " + getAccessToken(),
                RefreshToken: getRefreshToken()
              }
            });
            var data = response.data as User;
            setUser(data);
            setTokenObject(data);
            config.headers!['Authorization'] = 'Bearer ' + data.accessToken;
            config.headers!['RefreshToken'] = data.refreshToken;

            refreshSubscribers.forEach((subscriber) => subscriber(data));
            refreshSubscribers = [];

            return axiosClient.request(config);
          }
          catch (err) {
            setUser({ accessToken: "", refreshToken: "" });
            removeTokenObject();
            setIsAuthenticated(false);
          }
          finally {
            isRefreshing = false;
          }
        }
        return Promise.reject(error);
      }
    );
  }, [])

  return (
    <>
      <BrowserRouter>
        <ScrollToTop />
        <Layout />
        <main className='min-h-screen bg-lightBackground dark:bg-darkBackground-900'>
          <Routes />
        </main>
        <Chatbot />
        <Footer />
        <ToastContainer theme={theme} />
      </BrowserRouter>
    </>
  )
}

export default App
