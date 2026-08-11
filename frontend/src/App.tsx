import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';

import SplashPage from './pages/SplashPage';
import LoginPage from './pages/LoginPage';
import UserHome from './pages/user/UserHome';
import ProducerHome from './pages/producer/ProducerHome';
import SuccessPage from './pages/user/SuccessPage';
import CancelPage from './pages/user/CancelPage';
import OrderPage from './pages/producer/OrderPage';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import RecycleBuddy from './components/RecycleBuddy';

import ProtectedRoute from './components/ProtectedRoute';

function App() {

  const [showGreenAssistant, setShowGreenAssistant] = useState(false);

  return (
    <>
      <BrowserRouter>
        {showGreenAssistant && (<RecycleBuddy onClose={() => setShowGreenAssistant(false)} />)}
        <Routes>
          {/* the splashpage will navigate to the components and here represent the entry point of the App */}
          <Route path="/" element={<SplashPage />} />
          <Route path="/Login" element={<LoginPage />} />
          <Route path="/UserHome" element={<ProtectedRoute><UserHome /></ProtectedRoute>} />
          <Route path="/ProducerHome" element={<ProtectedRoute><ProducerHome setShowGreenAssistant={setShowGreenAssistant} /></ProtectedRoute>} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/cancel" element={<CancelPage />} />
          <Route path="/ForgotPassword" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/orders" element={<ProtectedRoute><OrderPage setShowGreenAssistant={setShowGreenAssistant} /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App