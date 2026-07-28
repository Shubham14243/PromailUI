import { useState } from 'react'
import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Home from './pages/Home'

function App() {

  const authUser = true;

  return (
    <>
        <Routes>
          <Route path='/' element={authUser ? <Home /> : <Navigate to="/login" />} />
          <Route path='/login' element={authUser ? <Navigate to="/" /> : <Login />} />
          <Route path='/signup' element={authUser ? <Navigate to="/" /> : <Signup />} />
        </Routes>
        <Toaster/>
    </>
  )
}

export default App
