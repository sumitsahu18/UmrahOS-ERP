import { Routes, Route, Navigate } from 'react-router-dom'
import { useApp } from './context/AppContext'
import Layout from './components/Layout'
import Login from './pages/common/Login'
import Landing from './pages/Landing'
import ModulePage from './pages/ModulePage'
import Notifications from './pages/common/Notifications'
import Profile from './pages/common/Profile'
import { Search, Documents, Help, Security, BookingView } from './pages/common/OtherScreens'
import ExpenseDetail from './pages/screens/ExpenseDetail'
import PassengerProfile from './pages/screens/PassengerProfile'

import ExecutiveDashboard from './pages/dashboards/ExecutiveDashboard'
import HeadOfficeDashboard from './pages/dashboards/HeadOfficeDashboard'
import FinanceDashboard from './pages/dashboards/FinanceDashboard'
import BranchDashboard from './pages/dashboards/BranchDashboard'
import BranchFinanceDashboard from './pages/dashboards/BranchFinanceDashboard'
import BookingDashboard from './pages/dashboards/BookingDashboard'
import HotelDashboard from './pages/dashboards/HotelDashboard'
import TransportDashboard from './pages/dashboards/TransportDashboard'

const DASHBOARDS = {
  'super-admin': ExecutiveDashboard,
  'head-office-admin': HeadOfficeDashboard,
  'ho-accountant': FinanceDashboard,
  'branch-manager': BranchDashboard,
  'branch-accountant': BranchFinanceDashboard,
  'booking-officer': BookingDashboard,
  'hotel-operator': HotelDashboard,
  'transport-officer': TransportDashboard,
}

function RoleDashboard() {
  const { roleId } = useApp()
  const D = DASHBOARDS[roleId] || ExecutiveDashboard
  return <D />
}

function Protected({ children }) {
  const { role } = useApp()
  return role ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route element={<Protected><Layout /></Protected>}>
        <Route path="/dashboard" element={<RoleDashboard />} />
        <Route path="/m/:section" element={<ModulePage />} />
        <Route path="/m/:section/:child" element={<ModulePage />} />
        <Route path="/booking/:id" element={<BookingView />} />
        <Route path="/expense/:id" element={<ExpenseDetail />} />
        <Route path="/passenger/:id" element={<PassengerProfile />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/search" element={<Search />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/help" element={<Help />} />
        <Route path="/security" element={<Security />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
