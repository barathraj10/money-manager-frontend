import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    ArrowRightLeft,
    LogOut,
    Menu,
    X,
    Wallet
} from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, to, active, onClick }) => (
    <Link
        to={to}
        onClick={onClick}
        className={`
            flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium
            ${active
                ? "bg-purple-900 text-white shadow-lg shadow-primary/25"
                : "text-purple-950 hover:bg-white hover:text-purple-600 hover:shadow-md"}`
        }
    >
        <Icon size={20} />
        <span>{label}</span>
    </Link>
);

const MainLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user, logout } = useAuth();
    const location = useLocation();

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    return (
        <div className="min-h-screen flex">
            {sidebarOpen && (
                <div
                    className="fixed inset-0  backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <aside
                className={`fixed lg:static inset-y-0 left-0 z-50 w-60 backdrop-blur-sm bg-gray-300/50 lg:bg-gradient-to-t from-violet-900/80 to-purple-300 border-r lg:border-none border-gray-200 p-6 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0
                    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
            >
                <div className="flex items-center border-b-1 border-gray-900 py-3 gap-3 px-2 mb-10">
                    <div className="p-2 bg-purple-900 rounded-lg text-white">
                        <Wallet size={24} />
                    </div>
                    <span className="text-xl font-bold text-dark">Kapital</span>
                </div> 

                <nav className="flex-1 space-y-2">
                    <SidebarItem
                        icon={LayoutDashboard}
                        label="Transactions"
                        to="/main/transaction"
                        active={location.pathname === '/main/transaction'}
                        onClick={() => setSidebarOpen(false)}
                    />
                    <SidebarItem
                        icon={ArrowRightLeft}
                        label="Dashboard"
                        to="/main/dashboard"
                        active={location.pathname === '/main/dashboard'}
                        onClick={() => setSidebarOpen(false)}
                    />
                </nav>

                <div className="mt-auto pt-6 border-t border-gray-200/50">
                    <div className="flex items-center gap-3 px-4 mb-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-600 to-secondary/70 flex items-center justify-center text-white font-bold">
                            {user?.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-white font-semibold text-dark truncate">{user?.name}</p>
                            <p className="text-xs text-gray-200 truncate">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-white hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors font-medium"
                    >
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            <main className="flex-1 min-w-0 h-screen">
                <header className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200 bg-white/50 backdrop-blur-sm sticky top-0 z-30">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-purple-900 rounded text-white">
                            <Wallet size={18} />
                        </div>
                        <span className="font-bold text-dark">Money Manager</span>
                    </div>
                    <button
                        onClick={toggleSidebar}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </header>

                <div className="max-h-screen overflow-x-hidden relative p-4 bg-transparent lg:p-8 mx-auto space-y-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default MainLayout;
