"use client"
import { LoginStatus } from '@bitkub-chain/sdk.js'
import { createContext, useContext, useEffect, useState } from 'react'
import { sdk } from '@/lib/bitkubchain-sdk'

const defaultAuthContextValue = {
  userInfo: {},
  loginStatus: LoginStatus.NOT_CONNECTED,
  loginWithBitkubNext: async () => {},
  logout: async () => {},
  authLoading: false,
  isLoggedIn: false,
}

const AuthContext = createContext(defaultAuthContextValue)

const AuthProvider = ({ children }) => {
  const [loginStatus, setLoginStatus] = useState(defaultAuthContextValue.loginStatus)
  const [userInfo, setUserInfo] = useState(defaultAuthContextValue.userInfo)
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    const interval = setInterval(async () => {
      const currentStatus = await sdk.loginStatus()
      if (currentStatus === LoginStatus.CONNECTED) {
        const info = await sdk.getUserInfo()
        setUserInfo(info)
      } else if (currentStatus === LoginStatus.NOT_CONNECTED) {
        setUserInfo(null)
      }
      setLoginStatus(currentStatus)
      setAuthLoading(false)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const loginWithBitkubNext = async () => {
    setAuthLoading(true)
    if (loginStatus !== LoginStatus.CONNECTED) {
      await sdk.loginWithBitkubNext()
    }
  }

  const logout = async () => {
    setAuthLoading(true)
    await sdk.logout()
    setAuthLoading(false)
  }

  const value = {
    loginStatus,
    userInfo,
    loginWithBitkubNext,
    logout,
    authLoading,
    isLoggedIn: loginStatus === LoginStatus.CONNECTED,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export { AuthProvider, useAuth }