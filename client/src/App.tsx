import './App.css'
import { Layout, Routes } from './components'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { BrowserRouter } from 'react-router-dom'

library.add(fab, fas, far)

function App() {

  return (
    <div className='dark:bg-darkBackground-900 transition-colors duration-300 bg-lightBackground'>
      <BrowserRouter>
        <Layout />
        <Routes />
        <ToastContainer />
      </BrowserRouter>
    </div>
  )
}

export default App
