import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { CartProvider } from './context/CartContext.jsx'

import './style/main.scss';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CartProvider>
    <AuthProvider>
      <App />
    </AuthProvider>
    </CartProvider>
  </StrictMode>,
)
