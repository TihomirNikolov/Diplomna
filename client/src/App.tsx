import './App.css'
import { Layout, Routes } from './components'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { BrowserRouter } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Role, User, useTheme, useUser } from './contexts'
import { authClient, axiosClient, baseURL, getAccessToken, getRefreshToken, getTokenObject, setTokenObject } from './utilities'
import { AxiosRequestConfig } from 'axios'

library.add(fab, fas, far)

function App() {

  const [isLoadingState, setIsLoadingState] = useState<boolean>(true);

  const { setUser, setRoles, setIsEmailConfirmed } = useUser();
  const { theme } = useTheme();

  let isRefreshing = false;
  let refreshSubscribers: ((user: User) => void)[] = [];

  useEffect(() => {
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
            var response = await axiosClient.post(`${baseURL()}api/authenticate/refresh-token`, { refreshToken: "" }, {
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
    setIsLoadingState(true);
    var userObject = getTokenObject();
    if (userObject == null) {
      userObject = { accessToken: '', refreshToken: '' }
    }
    setUser(userObject);
    setIsLoadingState(false);

    async function fetchRole() {
      if (getTokenObject() != null) {
        try {
          var response = await authClient.get(`${baseURL()}api/user/roles`);
          var data = response.data as Role[]
          setRoles(data);
        }
        catch (error) {
          setRoles(['User'])
        }
      }
      else {
        setRoles(['User']);
      }
    }

    async function fetchIsEmailConfirmed() {
      if (getTokenObject() != null) {
        try {
          var response = await authClient.get(`${baseURL()}api/user/emailVerification`);
          var data = response.data as boolean;
          setIsEmailConfirmed(data);
        }
        catch (error) {
          setIsEmailConfirmed(false);
        }
      } else {
        setIsEmailConfirmed(false);
      }
    }
    fetchRole();
    fetchIsEmailConfirmed();
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
