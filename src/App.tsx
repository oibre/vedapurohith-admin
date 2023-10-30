import Signup from './pages/Signup'
import { AuthProvider } from './contexts/FirebaseContext'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import PrivateRoutes from './global/PrivateRoutes'
import ForgotPassword from './pages/ForgotPassword'
import { ToastProvider } from './contexts/ToastContext'
import { ApiProvider } from './contexts/ApiContext'
import 'react-toastify/dist/ReactToastify.min.css'
import AppContextProviders from './contexts/AppContextProvider'
import NotFound from './pages/404'
import Poojas from './pages/Poojas'
import PoojaDetails from './pages/PoojaDetails'
import Success from './pages/Success'
import ChatComponent from './pages/Messages'
import ComingSoon from './pages/comingSoon'
import Booking from './pages/Booking'

function App() {
  const providers = [ToastProvider, AuthProvider, ApiProvider]
  return (
    <Router>
      <AppContextProviders components={providers}>
        <Routes>
          <Route element={<PrivateRoutes />}>
            <Route element={<Dashboard />} path="/" />
            <Route element={<Poojas />} path="/poojas" />
            <Route element={<PoojaDetails />} path="/poojas/:id" />
            <Route element={<Booking />} path="/bookings" />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path='/success' element={<Success />}/>
          <Route path="/messages" element={<ComingSoon />} />
          <Route element={<ComingSoon />} path='/items' />
          <Route path='*' element={<NotFound />}/>
        </Routes>
      </AppContextProviders>
    </Router>
  )
}

export default App