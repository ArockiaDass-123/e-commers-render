import { useEffect, useState } from 'react';
import Navbar from './Navbar';
import api from '../api/axios';
import { ShoppingBag, Loader2 } from 'lucide-react';

export default function Items() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const res = await api.get('/items');
                setItems(res.data.data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchItems();
    }, []);

    const addToCart = async (itemId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            window.alert("Please login to shop.");
            // Optional: navigate('/login');
            return;
        }

        try {
            await api.post('/carts', { item_id: itemId });
            window.alert("Item added to cart!");
        } catch (err) {
            console.error(err);
            window.alert("Failed to add to cart");
        }
    };

    const checkout = async () => {
        const token = localStorage.getItem('token');
        if (!token) return window.alert("Please login.");

        try {
            console.log("Checkout initiated...");
            const cartRes = await api.get('/carts');
            const cart = cartRes.data.data;
            console.log("Cart fetched for checkout:", cart);

            if (!cart) return window.alert("No active cart found.");

            const cartId = cart.id || cart.ID;
            const items = cart.items || cart.Items || [];

            if (!cartId) {
                console.error("Cart ID missing from object:", cart);
                return window.alert("Cart ID missing. Please refresh.");
            }

            if (items.length === 0) {
                return window.alert("Cart is empty.");
            }

            console.log("Attempting POST /orders with cart_id:", cartId);
            const res = await api.post('/orders', { cart_id: Number(cartId) });
            console.log("Order response:", res.data);

            window.alert("Order successful");
        } catch (err) {
            console.error("Checkout error:", err);
            const errMsg = err.response?.data?.error || err.message;
            window.alert("Checkout failed: " + errMsg);
        }
    };

    const showCartAlert = async () => {
        try {
            const res = await api.get('/carts');
            const cart = res.data.data;
            if (!cart) return window.alert("Cart is empty");

            // Requirement: show all cart items (i.e. cart_id, item_id)
            const itemDetails = cart.Items.map(i => `item_id: ${i.item_id}`).join('\n');
            window.alert(`cart_id: ${cart.id}\n${itemDetails}`);
        } catch (err) {
            window.alert("Failed to fetch cart: " + err.message);
        }
    };

    const showOrdersAlert = async () => {
        try {
            const res = await api.get('/orders');
            const orders = res.data.data || [];
            if (orders.length === 0) return window.alert("No orders found");

            // Requirement: show all the placed Order ids
            const orderIds = orders.map(o => o.id).join(', ');
            window.alert(`Order IDs: ${orderIds}`);
        } catch (err) {
            window.alert("Failed to fetch orders: " + err.message);
        }
    };

    return (
        <div className="min-h-screen bg-background pb-12">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col gap-6 mb-10">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold font-display text-foreground tracking-tight mb-2">Featured Collection</h1>
                            <p className="text-muted-foreground text-lg">Curated items just for you.</p>
                        </div>
                        <span className="px-4 py-1.5 rounded-full border border-border text-sm font-medium bg-white/50 backdrop-blur self-start">
                            {items.length} Products
                        </span>
                    </div>

                    <div className="flex flex-wrap gap-4 p-4 bg-muted/30 rounded-2xl border border-border/50">
                        <button
                            onClick={checkout}
                            className="px-6 py-2 bg-primary text-primary-foreground rounded-full font-bold shadow-md hover:bg-primary/90 transition-all flex items-center gap-2"
                        >
                            Checkout
                        </button>
                        <button
                            onClick={showCartAlert}
                            className="px-6 py-2 bg-secondary text-secondary-foreground rounded-full font-bold border border-border hover:bg-secondary/80 transition-all"
                        >
                            Cart (Alert)
                        </button>
                        <button
                            onClick={showOrdersAlert}
                            className="px-6 py-2 bg-secondary text-secondary-foreground rounded-full font-bold border border-border hover:bg-secondary/80 transition-all"
                        >
                            Order History (Alert)
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {items.map((item) => (
                            <div key={item.id} className="bg-white rounded-[2rem] p-4 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col border border-transparent hover:border-primary/10">
                                <div className="aspect-[4/5] rounded-3xl relative overflow-hidden mb-4 bg-gradient-to-br from-blue-600 to-primary">
                                    {item.image_url ? (
                                        <img src={item.image_url} alt={item.name} className="object-cover w-full h-full mix-blend-overlay opacity-50 group-hover:opacity-100 group-hover:mix-blend-normal transition-all duration-500" />
                                    ) : (
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 opacity-80" />
                                    )}
                                    {/* Optional: Add a 'New' badge if needed */}
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                                        New
                                    </div>
                                </div>

                                <div className="flex-1 flex flex-col px-1">
                                    <h3 className="font-bold text-xl mb-1 text-foreground font-display">{item.name}</h3>
                                    <div className="flex items-center gap-2 mb-6 text-muted-foreground text-sm">
                                        <ShoppingBag className="h-3 w-3" />
                                        <span>{item.category}</span>
                                    </div>

                                    <div className="mt-auto flex items-center justify-between">
                                        <span className="text-xl font-bold font-display text-foreground">${item.price.toFixed(2)}</span>
                                        <button
                                            onClick={() => addToCart(item.id)}
                                            className="px-6 py-2.5 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 flex items-center gap-2 font-medium text-sm group-hover:scale-105 active:scale-95"
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
}
