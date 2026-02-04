import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { LogOut, ArrowDownLeft, ArrowUpRight, Wallet2, Loader2, LucideLoader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import {Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, XAxis, YAxis} from 'recharts'

const Card = ({ title, amount, icon:Icon, type }) => {
    const isIncome=type==="income";
    const isExpense=type==="expense";

    return(

        <div className="flex-1 flex items-center justify-between bg-white min-h-20 border-1 rounded-xl border-gray-300 px-3 py-5 text-white">
        <Icon className={`${isIncome
                            ?"text-green-900 bg-green-300/80"
                            :isExpense? "text-red-700 bg-red-300/80":"bg-blue-300 text-blue-800"} rounded-lg`} size={32} />
        <div className='flex-1 px-5'>
            <h1 className='text-gray-900 text-lg lg:text-xl font-semibold'>{title}</h1>
        </div>
        <h1 className={`font-semibold text-2xl 
                        ${isIncome
                        ?"text-green-600"
                        :isExpense
                        ?"text-red-600"
                    :"text-blue-600"}`}>₹{amount}</h1>
    </div>
    );
}

const Dashboard = () => {

    const [range, setRange] = useState("month");
    const [loading, setLoading] = useState(false);
    const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 });
    const [divisionSummary, setDivisionSummary]=useState([]);

    const { logout, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const incomeSummary = await api.get(`/summary/income-expense?range=${range}`);
                const categorySummary=await api.get(`/summary/category`)
                setSummary(incomeSummary.data);
                setDivisionSummary(categorySummary.data);
            }
            catch (e) {
                console.log("Error:", e);
                toast.error("Failed to load dashboard");

            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [range])


    const chartData=[
        {name:"Income", amount:summary.income},
        {name:"Expense", amount:summary.expense}
    ]

    return (
        <div className='space-y-3'>
            
            <div className="flex justify-between">
                <div>
                    <h1 className='text-xl md:text-3xl  flex-1 font-bold text-fuchsia-950'>Financial Overview</h1>
                    <p className='text-md md:text-lg text-gray-700/80'>Stay on track with your spendings...</p>
                </div>
                <div className="hidden md:flex bg-white rounded-xl p-1 h-12 shadow-lg overflow-hidden">
                    {["Week", "Month", "Year"].map((r) => (
                        <button
                            key={r}
                            onClick={() => setRange(r.toLowerCase())}
                            className={`text-md text-gray-500 transition-all rounded-xl px-3 ${range === r.toLowerCase() ? `bg-blue-700/90 text-white` : ` hover:text-black hover:bg-gray-300/70`}`}>

                            {r}
                        </button>
                    ))}
                </div>
                <div className="block md:hidden">
                    <select
                        onChange={(e) => setRange(e.target.value)}
                        className='px-5 py-1 rounded-lg border-1 border-gray-500 '>
                        <option value="week" className=''>Week</option>
                        <option value="month" className=''>Month</option>
                        <option value="year" className=''>Year</option>
                    </select>
                </div>
            </div>

            <div className="flex flex-col md:flex-row  justify-between gap-2">
                
                <Card title={"Total Income"} amount={summary.income.toLocaleString()} icon={ArrowUpRight} type="income"></Card>
                <Card title={"Total Expense"} amount={summary.expense.toLocaleString()} icon={ArrowDownLeft} type="expense"></Card>
                <Card title={"Balance"} amount={summary.balance.toLocaleString()} icon={Wallet2} type="balance"></Card>
                
                
            </div>

            <div className='space-y-5 py-8 flex flex-col'>
                    <h1 className='text-xl font-semibold'>Income vs Expense</h1>
                    <div className="bg-white/90 p-5 rounded-xl shadow-lg shadow-secondary h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>

                                <CartesianGrid strokeDasharray="5 5"/>
                                <XAxis dataKey="name" axisLine={false} tickLine={false}/>
                                <YAxis  axisLine={false} tickFormatter={(value)=> `₹${value}`}/>
                                <Bar dataKey="amount" barSize={50} radius={[4,4,0,0]}>
                                    {chartData.map((entry, index)=>(
                                        <Cell key={index} fill={entry.name==="Income"?'#10b981' : '#f52626'}></Cell>
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
            </div>
        </div>
    );
}

export default Dashboard
