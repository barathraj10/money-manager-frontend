import React from 'react'
import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from './layout/AuthLayout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { AuthProvider } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import { useAuth } from './context/AuthContext';
import MainLayout from './layout/MainLayout';
import Transactions from './pages/Transactions';

const ProtectedRoute=({children})=>{
  const {token}=useAuth();
  if(!token){
    return <Navigate to="/auth/login"/>
  }
  return children;
}

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>

        <Toaster position="top-center"></Toaster>
        <Routes>
          <Route path="/" element={<Navigate to="/auth/login"/>}/> 
          <Route path="/auth" element={<AuthLayout />}>
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
          </Route>

        <Route path='/main' element={<ProtectedRoute><MainLayout/></ProtectedRoute>}>
          <Route path="transaction" element={<Transactions/>}/>
          <Route path="dashboard" element={<Dashboard/>}></Route>
        </Route>

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
