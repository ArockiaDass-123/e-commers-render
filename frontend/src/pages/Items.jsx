import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../api/api';
import { ShoppingBag, Loader2 } from 'lucide-react';

const Items = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await api.get('/products');
                setProducts(res.data);
            } catch (err) {
                console.error(err);
                window.alert("Failed to fetch products");
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const addToCart = async (productId) => {
        try {
            await api.post('/carts/add', { product_id: productId });
            window.alert("Item added to cart!");
        } catch (err) {
            console.error(err);
            window.alert("Failed to add item to cart");
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-background antialiased">
            <Navbar />
            <main className="flex-1 container mx-auto px-4 py-12">
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h1 className="text-4xl font-bold font-display mb-2 text-foreground tracking-tight">Our Collection</h1>
                        <p className="text-muted-foreground text-lg">Premium products for your lifestyle.</p>
                    </div>
                    <div className="px-4 py-2 rounded-full border border-border text-sm font-semibold bg-secondary/50">
                        {products.length} Products
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {products.map((product) => (
                            <div key={product._id} className="bg-card rounded-[2rem] p-4 shadow-sm hover:shadow-2xl transition-all duration-500 group border border-border hover:border-primary/20">
                                <div className="aspect-[4/5] rounded-[1.5rem] relative overflow-hidden mb-6 bg-muted">
                                    {product.image_url ? (
                                        <img src={product.image_url} alt={product.name} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700" />
                                    ) : (
                                        <div className="h-full w-full bg-gradient-to-br from-primary/10 to-primary/5" />
                                    )}
                                    <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-md px-3 py-1 rounded-full text-[0.7rem] font-bold shadow-sm">
                                        AVAILABLE
                                    </div>
                                </div>
                                <div className="px-2">
                                    <h3 className="font-bold text-xl mb-1 text-foreground line-clamp-1">{product.name}</h3>
                                    <p className="text-muted-foreground text-sm mb-6">{product.category}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-2xl font-bold text-foreground font-display">${(product.price || 0).toFixed(2)}</span>
                                        <button
                                            onClick={() => addToCart(product._id)}
                                            className="px-6 py-2.5 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2 font-bold text-sm"
                                        >
                                            <ShoppingBag className="h-4 w-4" />
                                            Add
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Items;
