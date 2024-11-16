"use client"
import { createContext, useContext, useEffect, useState } from 'react'
import { kintoSDK } from '@/lib/kinto-sdk'

const defaultAuthContextValue = {
  userInfo: {},
  loginWithKinto: async () => {},
  logout: async () => {},
  authLoading: false,
  isLoggedIn: true,
}

const AuthContext = createContext(defaultAuthContextValue)

const AuthProvider = ({ children }) => {
  const [loginStatus, setLoginStatus] = useState(defaultAuthContextValue.isLoggedIn)
  const [userInfo, setUserInfo] = useState(defaultAuthContextValue.userInfo)
  const [authLoading, setAuthLoading] = useState(true)

  // useEffect(() => {
  //   const interval = setInterval(async () => {
  //     const currentStatus = await sdk.loginStatus()
  //     if (currentStatus === LoginStatus.CONNECTED) {
  //       const info = await sdk.getUserInfo()
  //       setUserInfo(info)
  //     } else if (currentStatus === LoginStatus.NOT_CONNECTED) {
  //       setUserInfo(null)
  //     }
  //     setLoginStatus(currentStatus)
  //     setAuthLoading(false)
  //   }, 1000)
  //   return () => clearInterval(interval)
  // }, [])

  const loginWithKinto = async () => {
    setAuthLoading(true)
    console.log(kintoSDK);
  
    kintoSDK.connect()
    .then((accountInfo) => {
      setLoginStatus(true)
      console.log('Connected account info:', accountInfo);
    })
    .catch((error) => {
      console.error('Failed to connect:', error);
    }); 
  }

  const logout = async () => {
    setAuthLoading(true)
    // await sdk.logout()
    setAuthLoading(false)
  }

  const value = {
    loginStatus,
    userInfo,
    loginWithKinto,
    logout,
    authLoading,
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