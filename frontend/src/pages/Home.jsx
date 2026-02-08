import React from 'react';
import Navbar from '../components/Navbar';
import { Tag, ShoppingCart } from 'lucide-react';

const Home = () => {
    const products = [
        { id: 1, name: "Gaming Mouse", category: "Category", price: 49.99, color: "from-cyan-400 to-blue-600" },
        { id: 2, name: "Mechanical Keyboard", category: "Category", price: 129.99, color: "from-blue-500 to-indigo-700" },
        { id: 3, name: "Monitor 24 inch", category: "Category", price: 199.99, color: "from-indigo-400 to-blue-800" },
        { id: 4, name: "USB-C Cable", category: "Category", price: 12.99, color: "from-cyan-500 to-indigo-600" },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 antialiased selection:bg-primary/20">
            <Navbar />

            <main className="flex-1 container mx-auto px-4 py-12 md:px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-3">
                            Featured Collection
                        </h1>
                        <p className="text-slate-500 text-lg font-medium">Curated items just for you.</p>
                    </div>
                    <div>
                        <div className="px-4 py-2 rounded-xl border-2 border-slate-200 bg-white shadow-sm font-bold text-slate-700 text-sm flex items-center gap-2">
                            <span>5 Products</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <div key={product.id} className="group flex flex-col bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                            {/* Product Header / Image Area */}
                            <div className={`aspect-[4/5] rounded-[1.5rem] m-2 bg-gradient-to-br ${product.color} relative overflow-hidden`}>
                                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
                            </div>

                            {/* Product Info */}
                            <div className="p-6 pt-2">
                                <h3 className="font-extrabold text-xl text-slate-900 mb-2 truncate">
                                    {product.name}
                                </h3>
                                <div className="flex items-center gap-2 text-slate-400 mb-6">
                                    <Tag className="h-4 w-4" />
                                    <span className="text-sm font-bold tracking-wide uppercase">{product.category}</span>
                                </div>

                                <div className="flex items-center justify-between mt-auto">
                                    <span className="text-2xl font-black text-slate-900">
                                        ${product.price.toFixed(2)}
                                    </span>
                                    <button className="flex items-center gap-2 bg-[#7C3AED] text-white px-5 py-2.5 rounded-2xl font-black text-sm hover:bg-[#6D28D9] transition-all shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50">
                                        <ShoppingCart className="h-4 w-4" />
                                        Add
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            <footer className="border-t border-slate-100 py-8 text-center bg-white">
                <p className="text-slate-400 text-sm font-bold tracking-tight">
                    © 2026 LuxeMarket. All rights reserved.
                </p>
            </footer>
        </div>
    );
};

export default Home;
