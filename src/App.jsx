import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
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

function App() {

  const { user } = useAuthStore();
  const authUser = user;

  return (
    <>
        <Routes>
          <Route path='/' element={authUser ? <Home /> : <Navigate to="/login" />} />
          <Route path='/app' element={authUser ? <AppView /> : <Navigate to="/login" />} />
          <Route path='/template' element={authUser ? <TemplateView /> : <Navigate to="/login" />} />
          <Route path='/logs' element={authUser ? <EmailLogs /> : <Navigate to="/login" />} />
          <Route path='/profile' element={authUser ? <Profile /> : <Navigate to="/login" />} />
          <Route path='/docs' element={authUser ? <Docs /> : <Navigate to="/login" />} />
          <Route path='/login' element={authUser ? <Navigate to="/" /> : <Login />} />
          <Route path='/signup' element={authUser ? <Navigate to="/" /> : <Signup />} />
        </Routes>
        <Toaster/>
    </>
  )
}

export default App
