import { createContext, useContext, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'

import { SnackbarProvider } from '@ozen-ui/kit/Snackbar'
import { ThemeProvider, themeOzenDefault } from '@ozen-ui/kit/ThemeProvider'

import { selectIsAuthenticated } from '../features/auth/authSlice'

import s from './App.module.css'

import {LoginPage} from "../features/LoginPage/LoginPage.jsx";
import {RegistrationPage} from "../features/RegistrationPage/RegistrationPage.jsx";
import {LogoutPage} from "../features/LogoutPage/LogoutPage.jsx";
import AllRequestsTable from "../features/request/AllRequestsTable.jsx";

export const AppContext = createContext({})

export const useApp = () => useContext(AppContext)

export const AppProvider = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated)

  const [scrollContainerEl, setScrollContainerEl] = useState(null)
  const location = useLocation()

  useEffect(() => {
    scrollContainerEl?.scrollTo({ top: 0, behavior: 'instant' })
  }, [location.pathname, scrollContainerEl])

    const renderContent = () => {
        // сначала обрабатываем публичные маршруты
        if (location.pathname === '/signup') {
            return <RegistrationPage />;
        }


        if (!isAuthenticated) {
            return <LoginPage />;
        }
        if (location.pathname === '/logout') {
            return <LogoutPage />;
        }




        return children;
    };
  return (
      <ThemeProvider theme={themeOzenDefault} className={s.app}>
        <SnackbarProvider
            lifetime={10000}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            maxMessages={3}
        >
          <AppContext.Provider
              value={{
                scrollContainerEl,
                setScrollContainerEl,
              }}
          >
            {renderContent()}

          </AppContext.Provider>
        </SnackbarProvider>
      </ThemeProvider>
  )
}
