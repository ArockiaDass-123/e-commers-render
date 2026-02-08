import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, LogOut } from 'lucide-react';

const Navbar = () => {
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const location = useLocation();
    const isHomePage = location.pathname === '/';

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-2">
            <div className="container flex h-14 items-center justify-between px-4 md:px-6 mx-auto">
                <Link to="/" className="flex items-center gap-2 text-xl font-black text-primary">
                    <div className="p-1.5 bg-primary/10 rounded-lg">
                        <ShoppingBag className="h-6 w-6 text-primary" />
                    </div>
                    <span className="tracking-tight text-foreground font-display">LuxeMarket</span>
                </Link>
                <div className="flex items-center gap-6">
                    {/* Only show Sign In/Up on Home Page, regardless of auth status */}
                    {isHomePage ? (
                        <div className="flex items-center gap-4">
                            <Link to="/login">
                                <button className="inline-flex items-center justify-center rounded-xl text-sm font-extrabold bg-[#7C3AED] text-white hover:bg-[#6D28D9] h-10 px-6 shadow-lg shadow-purple-500/20 transition-all hover:scale-105 active:scale-95">
                                    Sign In
                                </button>
                            </Link>
                            <Link to="/signup">
                                <button className="inline-flex items-center justify-center rounded-xl text-sm font-extrabold border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 h-10 px-6 transition-all hover:scale-105 active:scale-95">
                                    Sign Up
                                </button>
                            </Link>
                        </div>
                    ) : token ? (
                        <>
                            <Link to="/items" className="text-sm font-bold hover:text-primary transition-colors">Products</Link>
                            <Link to="/cart" className="text-sm font-bold hover:text-primary transition-colors flex items-center gap-1">
                                <ShoppingBag className="h-4 w-4 text-primary" />
                                Cart
                            </Link>
                            <Link to="/orders" className="text-sm font-bold hover:text-primary transition-colors">Orders</Link>
                            <button
                                onClick={handleLogout}
                                className="inline-flex items-center justify-center rounded-xl text-sm font-bold border border-input bg-background hover:bg-accent h-10 px-4 gap-2 transition-all hover:scale-105"
                            >
                                <LogOut className="h-4 w-4" />
                                <span>Sign Out</span>
                            </button>
                        </>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link to="/login">
                                <button className="inline-flex items-center justify-center rounded-xl text-sm font-extrabold bg-[#7C3AED] text-white hover:bg-[#6D28D9] h-10 px-6 shadow-lg shadow-purple-500/20 transition-all hover:scale-105 active:scale-95">
                                    Sign In
                                </button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
