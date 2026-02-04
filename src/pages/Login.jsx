import React from 'react'
import { Mail, Lock,  Loader } from 'lucide-react'
import { useState } from 'react'
import {toast} from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { useAuth } from '../context/AuthContext'

const Login = () => {

    const [email, setEmail]=useState("");
    const [password, setPassword]=useState("");
    const [loading, setLoading]=useState(false);
    const {login}=useAuth();
    const navigate=useNavigate();

    const handleSubmit=async(e)=>{
        e.preventDefault();
        setLoading(true);
        const success=await login(email,password);
        if(success){
            toast.success("Login Successful");
            navigate('/main/transaction');
        } 
        setLoading(false);
    }

    return (
        <div className='flex flex-col gap-5'>
            <div>
                <h1 className='text-xl text-gray-900'>Welcome Back!</h1>
                <p className="text-gray-500 text-sm md:text-md">Please enter your details to sign in.</p> 
            </div>

            <form onSubmit={handleSubmit}>
                <div>
                    <label className='text-gray-900 text-sm'>Email Address</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-pink-800 transition-all"
                            placeholder="you@example.com"
                            />
                    </div>
                    <label className='text-gray-900 text-sm'>Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-pink-800 transition-all"
                            placeholder="**********"
                            />
                    </div>

                    <button
                        className='w-full mt-10 bg-blue-800/80 py-2 text-white flex-center'
                        disabled={loading}
                    >
                        
                        {loading? <Loader className='animate-spin'/>:<>Sign In</>}
                    </button>
                    
                </div>

                <p className="mt-8 text-center text-gray-600">
                New Here?{' '}
                <Link to="/auth/signup" className="text-blue-900 font-semibold hover:underline">
                    Register Here
                </Link>
            </p>
            </form>
        </div>
    )
}

export default Login
