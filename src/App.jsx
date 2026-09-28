import './App.css'
import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Home from './pages/Home'
import AppView from './pages/AppView'
import TemplateView from './pages/TemplateView'
import EmailLogs from './pages/EmailLogs'
import Profile from './pages/Profile'
import Docs from './pages/Docs'
import useAuthStore from './context/AuthContext'
import Reset from './pages/Reset'
import Setnew from './pages/Setnew'
import Index from './pages/Index'

function App() {

  const { user } = useAuthStore();
  const authUser = user;

  return (
    <>
        <Routes>
          <Route path='/' element={authUser ? <Home /> : <Index />} />
          <Route path='/docs' element={<Docs />} />
          <Route path='/home' element={authUser ? <Home /> : <Navigate to="/login" />} />
          <Route path='/app/:appid' element={authUser ? <AppView /> : <Navigate to="/login" />} />
          <Route path='/template/:templateid' element={authUser ? <TemplateView /> : <Navigate to="/login" />} />
          <Route path='/logs' element={authUser ? <EmailLogs /> : <Navigate to="/login" />} />
          <Route path='/profile' element={authUser ? <Profile /> : <Navigate to="/login" />} />
          <Route path='/login' element={authUser ? <Navigate to="/home" /> : <Login />} />
          <Route path='/signup' element={authUser ? <Navigate to="/home" /> : <Signup />} />
          <Route path='/reset' element={authUser ? <Navigate to="/home" /> : <Reset />} />
          <Route path='/setnew/:token' element={authUser ? <Navigate to="/home" /> : <Setnew />} />
        </Routes>
        <Toaster/>
    </>
  )
}

export default App
