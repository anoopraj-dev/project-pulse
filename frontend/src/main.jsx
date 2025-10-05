import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ModalProvider from './contexts/ModalContext.jsx'
import { UserProvider } from './contexts/UserContext.jsx'

createRoot(document.getElementById('root')).render(

  <StrictMode>
    <UserProvider>
    <ModalProvider>
      <App />
    </ModalProvider>
    </UserProvider>

  </StrictMode>,
)
