import React from 'react'
import {User, Mail, Lock, Loader} from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {toast} from 'react-hot-toast'

const Signup = () => {

    const [name,setName]=useState("");
    const [email,setEmail]=useState("");
    const [password, setPassword]=useState("");
    const [loading, setLoading]=useState(false);
    const {signup}=useAuth();
    const navigate=useNavigate();

    const handleSubmit=async (e)=>{
        e.preventDefault();
        setLoading(true);
        const success=await signup(name, email, password);
        if(success){
            toast.success("Account Created Successfully!");
            navigate('/auth/login');
        }
        setLoading(false);
    }

  return (
    <div className='flex flex-col gap-2 lg:gap-5'>
            <div>
                <h1 className='text-xl  font-semibold text-gray-900'>Create Account!</h1>
                <p className="text-gray-500">Please enter your details to sign in.</p> 
            </div>

            <form onSubmit={handleSubmit}>
                <div>
                    <label className='text-gray-900 text-sm'>Name</label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-pink-800 transition-all"
                            placeholder="Your Name"
                            />
                    </div>
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
                        className='w-full mt-5 bg-blue-800/80 py-2 text-white'
                        disabled={loading}
                    >
                        
                        {loading? <Loader className='animate-spin'/>:<>Sign Up</>}
                    </button>
                    
                </div>

                <p className="mt-8 text-center text-gray-600">
                Already have an account?{' '}
                <Link to="/auth/login" className="text-blue-900 font-semibold hover:underline">
                    Log in
                </Link>
            </p>
            </form>
        </div>
  )
}

export default Signup
