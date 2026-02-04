import { Outlet } from "react-router-dom";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import { Wallet, Wallet2 } from "lucide-react";

const AuthLayout = () => {


    return (
        <div className="">
            <div className="flex p-10 lg:p-20 rounde min-h-screen">
                    <div className="left hidden md:flex flex-1 rounded-l-lg bg-gradient-to-tr from-[#470e7c] to-[#fa3296] min-h-full flex-center  flex-col ">
                        <Wallet2 size={48} className="text-white" />
                        <h1 className="text-5xl text-white font-semibold">Fund Flow</h1>
                        <p className="text-xl text-white mt-5">Take your finances to the next level!</p>
                    </div>
                    <div className="right p-5 flex-1 rounded-lg md:rounded-r-lg flex-center bg-white">
                        <Outlet />
                    </div>
            </div>
        </div>
    )
}

export default AuthLayout;