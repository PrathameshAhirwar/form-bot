import React from 'react'
import LandingPage from './components/LandingPage/LandingPage'
import LoginPage from './components/LoginPage/LoginPage'
import { Outlet } from 'react-router'
import Dashboard from './components/Dashboard/Dashboard'

const App = () => {
  return (
    <>
      <div style={{ fontFamily: "'Roboto', sans-serif" }}>
        <Outlet />
        
      </div>
      
    </>
  )
}

export default App
