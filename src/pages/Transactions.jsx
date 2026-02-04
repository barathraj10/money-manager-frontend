import React, { useContext, useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import toast from 'react-hot-toast';
import { ArrowUp, ArrowDown, Plus, Pen, Trash2, Loader2, Funnel, X } from 'lucide-react';

const Transactions = () => {

  const [transactions, setTransactions] = useState([]);
  const [modal, setModal] = useState(false);
  const [type, setType] = useState('All');
  const [loading, setLoading] = useState(false);

  const [isEdit, setIsEdit] = useState(false);
  const [selected, setSelected] = useState(null);

  const [transactionType, setTransactionType] = useState('expense');
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [division, setDivision] = useState("personal");
  const [description, setDescription] = useState("");

  const [filterDivision, setFilterDivision] = useState("All");
  const [filterCategory, setFilterCategory] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [isFilter, setIsFilter] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
  }, [modal])

  const resetValues = () => {
    setTransactionType("expense");
    setAmount("");
    setCategory("");
    setDivision("personal");
    setDescription("");
  }
  const handleAdd = async (e) => {
    e.preventDefault();

    const payload = {
      type: transactionType,
      amount: Number(amount),
      category,
      division,
      description
    }

    try {
      setLoading(true);
      if (isEdit && selected._id) {
        await api.patch(`/transactions/${selected._id}`, payload);
        toast.success("Updated Successfully");
      }
      else {
        await api.post('/transactions', payload);
        toast.success("Transaction added successfully");
      }
      setModal(false);
      fetchData();
      resetValues();
    } catch (e) {
      toast.error(e.response?.data?.message);
    } finally {
      setLoading(false);
    }
  }

  const handleEdit = (txn) => {
    setIsEdit(true);
    setSelected(txn);

    setTransactionType(txn.type);
    setAmount(txn.amount);
    setCategory(txn.category);
    setDivision(txn.division);
    setDescription(txn.description || "");
    setModal(true);

  }

  const fetchData = async (filters = {}) => {
    try {
      setLoading(true);
      const params = {};

      if (filters.type && filters.type != "All") params.type = filters.type;

      if (filters.division && filters.division != "All") params.division = filters.division;

      if (filters.category && filters.category != "All") params.category = filters.category;

      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;



      const { data } = await api.get('/transactions', { params });
      setTransactions(data);
      console.log("Data", data);

    } catch (e) {
      console.log(e?.response?.message);
      toast.error("Failed fetching Transaction data!");
    } finally {
      setLoading(false);
    }
  }
  const applyFilters = () => {
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      toast.error("Start Date cannot be greater than End Date");
      return;
    }
    fetchData({
      type,
      division: filterDivision,
      category: filterCategory,
      startDate,
      endDate
    })
    setIsFilter(false);
  }

  const resetFilters = () => {
    setType("All")
    setFilterDivision("All")
    setFilterCategory("All")
    setStartDate("")
    setEndDate("")
    fetchData();
    setIsFilter(false);
  }
  const deleteTransaction = async (id) => {
    try {
      await api.delete(`/transactions/${id}`);
      toast.success("Deleted successfully");
      fetchData();
    } catch (e) {
      toast.error(e.response?.data?.message);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = transactions.filter(t => {
    if (type === "All") return true;
    return t.type === type;
  })
  return (
    <div>



      <div className="flex flex-col gap-6">
        <div className='flex flex-col gap-5 md:flex-row justify-between'>
          <div>
            <h1 className='text-xl lg:text-3xl text-black/90'>Hi <span className='text-3xl  font-semibold text-pink-900/90'>{user?.name}!</span></h1>
            <p className='text-md lg:text-lg text-gray-800/80'>Keep track of your expenses</p>
          </div>
          <button
            onClick={() => { setModal(true) }}
            className='flex-center transition-all py-4 text-md md:text-md gap-1 cursor-pointer hover:bg-blue-400  text-white bg-blue-600 px-3 rounded-xl shadow-lg shadow-blue-800 font-semibold'><Plus className='font-bold' size={24}></Plus> Add Transaction</button>
        </div>
        <div className="flex justify-between gap-3">

          <button onClick={() => setIsFilter(!isFilter)} className='text-white bg-purple-800 rounded-xl px-3 shadow-lg shadow-purple-950 font-semibold flex-center gap-3'><Funnel size={20}></Funnel>Filters</button>
          <div className='flex justify-end gap-2'>
            {["All", "income", "expense"].map((t) => (
              <button
                key={t}
                className={`px-2 lg:px-3 capitalize py-3 shadow-lg shadow-secondary/80 hover:-translate-y-1 transition-all text-sm lg:text-md rounded-xl ${type === t ? `bg-black text-white` : `bg-white  text-black`}`}
                onClick={() => { setType(t) }}
              >
                {t}
              </button>
            ))}
          </div>

        </div>
        <div className="">
          <div onClick={() => setIsFilter(false)} className={`backdrop-blur-md fixed z-50 w-sm top-0 right-0 ${isFilter ? "-translate-x-0" : "translate-x-full"} transition-transform duration-300`}>
          <div className="flex justify-end">

            <div className={`z-50 h-screen transition-all w-lg lg:w-xl bg-gray-100/70 border-l-2 border-purple-400  shadow-purple-800 rounded-xl p-4 shadow-lg flex flex-col gap-3
        `}>

              <div className="flex justify-between  ">
                <h2 className="font-semibold text-lg text-black/80">Filters</h2>
                <button onClick={()=>setIsFilter(false)} className='text-red-600 bg-red-300 p-1 rounded-lg'><X size={24}/></button>
              </div>

              <div className="flex flex-col gap-3" onClick={(e) => e.stopPropagation()}>

                {/* Division Filter */}
                <select
                  value={filterDivision}
                  onChange={(e) => setFilterDivision(e.target.value)}
                  className="p-3 border text-gray-600 border-gray-500 rounded-xl"
                >
                  <option value="All">All Divisions</option>
                  <option value="personal">Personal</option>
                  <option value="office">Office</option>
                </select>

                {/* Category Filter */}
                <input
                  value={filterCategory === "All" ? "" : filterCategory}
                  placeholder="Category (leave empty for All)"
                  onChange={(e) => setFilterCategory(e.target.value ? e.target.value : "All")}
                  className="p-3 border border-gray-500 rounded-xl"
                />

                <div className="flex gap-3">
                  <div className="flex-1 flex flex-col">
                    {/* Start Date */}
                <label className='text-gray-800'>From</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="p-3 border border-gray-500 rounded-xl"
                />
                  </div>

                <div className="flex-1 flex flex-col">
                  {/* End Date */}
                <label className='text-gray-800'>To</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="p-3 border border-gray-500 rounded-xl"
                />
                </div>
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 rounded-xl border border-gray-400 text-gray-700"
                >
                  Reset
                </button>

                <button
                  onClick={applyFilters}
                  className="px-4 py-2 rounded-xl bg-black text-white"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        </div>
        {loading ?
          <div className="bg-white flex-center p-5 rounded-xl">
            <p className='flex gap-3 font-semibold'>Loading Transactions <Loader2 className='flex-center animate-spin' size={36}></Loader2></p>
          </div>
          :

          <div className='w-full flex flex-col gap-4 overflow-y-hidden'>
            {filtered.map((transaction) => (
              <div key={transaction._id}
                className={`px-3 py-2 rounded-xl min-h-20 flex items-center justify-between gap-2 bg-white border-1 border-gray-500/50`}
              >
                <div className="flex-center">
                  {transaction.type === "income" ?
                    <ArrowUp
                      className='text-green-900 h-10 bg-green-300/80 rounded-lg' size={28}>
                    </ArrowUp> :
                    <ArrowDown size={28}
                      className='text-red-500/80 h-10 bg-red-300/80 rounded-lg'>
                    </ArrowDown>}
                </div>
                <div className="w-full px-3 flex-1">
                  <h1 className='text-md md:tex-xl font-semibold text-black/80'>{transaction?.category}</h1>
                  <p className='text-sm lg:tex-md capitalize text-gray-500'>{transaction.division} | {new Date(transaction.createdAt).toLocaleDateString()}</p>
                  <p className='text-xs md:text-sm text-gray-500'>{transaction.description}</p>
                </div>
                <div className='flex-center gap-3'>
                  <h1 className={`text-lg lg:text-2xl font-bold ${transaction.type === 'income' ? `text-green-600` : `text-red-600`}`}>₹{transaction.amount.toLocaleString()}</h1>
                  <div className="flex gap-1">
                    <button onClick={() => handleEdit(transaction)} className='text-gray-600 border-1  rounded p-1'><Pen size={16} /></button>
                    <button onClick={() => deleteTransaction(transaction._id)} className='text-gray-600 border-1 rounded p-1'><Trash2 size={16} /></button>
                  </div>
                </div>

              </div>
            ))}
          </div>}
      </div>

      {modal ? (
        <div className="fixed  top-0 left-0 p-4 flex-center m-auto z-50 min-h-screen w-screen backdrop-blur"
          onClick={() => setModal(false)}
        >
          <form onSubmit={handleAdd} onClick={(e) => e.stopPropagation()} className='w-full max-w-md flex flex-col gap-3 bg-white p-5 rounded-xl shadow-lg shadow-gray-400'>
            <div className="flex gap-3">
              {["income", "expense"].map((t) => (
                <button
                  key={t}
                  type='button'
                  onClick={() => setTransactionType(t)} className={`rounded 
                    ${transactionType === t ?
                      (t === 'income' ?
                        `bg-green-600 text-white shadow-green-500`
                        : `bg-red-600 text-white shadow-red-500`)
                      : "bg-gray-500/70 text-gray-900"}
                      px-1 py-2 flex-1  shadow-lg capitalize`}>{t}</button>

              ))}
            </div>
            <input placeholder='Amount'
              className='w-full p-2 mt-5 border-gray-500/70 border-1 rounded'
              value={amount}
              type="number"
              onChange={(e) => setAmount(e.target.value)} />
            <div className="flex gap-1 w-full">
              <input placeholder='Category'
                className='flex-1 min-w-0 p-2 mt-5 border-gray-500/70 border-1 rounded'
                value={category}
                onChange={(e) => { setCategory(e.target.value) }} />
              <select placeholder='Division'
                value={division}
                className='flex-1 min-w-0 p-2 mt-5 border-gray-500/70 border-1 rounded'
                onChange={(e) => setDivision(e.target.value)}>
                <option value="personal">Personal</option>
                <option value="office">Office</option>
              </select>
            </div>
            <input placeholder='Description (optional)'
              className='p-2 mt-5 border-gray-500/70 border-1 rounded'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <button
              type='submit' className="flex-center bg-blue-500 rounded w-full p-3 text-white">
              {isEdit ? "Update"
                : transactionType === 'income' ? 'Add Income' : 'Add Expense'}
            </button>
          </form>
        </div>
      ) : null}
    </div>
  )
}

export default Transactions
