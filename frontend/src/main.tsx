import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import { Provider } from 'react-redux'
import store from './store'

import './style/main.scss';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Root element not found — check that index.html has a <div id='root'>.");
}

createRoot(rootElement).render(
  <StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Provider>
  </StrictMode>,
)