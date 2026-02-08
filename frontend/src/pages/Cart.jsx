import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../api/api';
import { Trash2, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const res = await api.get('/carts');
                setCart(res.data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCart();
    }, []);

    const handleCheckout = async () => {
        try {
            await api.post('/orders', { cart_id: cart.id });
            // Spec: "Order successful" -> Returns user to Items screen
            window.alert("Order successful!");
            navigate('/items');
        } catch (err) {
            console.error(err);
            window.alert("Checkout failed: " + (err.response?.data?.error || "Unknown error"));
        }
    };

    if (loading) return <div className="min-h-screen bg-background"><Navbar /><div className="p-8 text-center">Loading...</div></div>;

    if (!cart || !cart.items || cart.items.length === 0) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                    <h2 className="text-2xl font-bold mb-4 font-display">Your cart is empty</h2>
                    <p className="text-muted-foreground mb-8">Start shopping to add items to your cart.</p>
                    <button onClick={() => navigate('/items')} className="text-primary hover:underline">Browse Products</button>
                </div>
            </div>
        );
    }

    const total = cart.items.reduce((sum, item) => sum + (item.item?.price || 0), 0);

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold font-display mb-8">Shopping Cart</h1>

                <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
                    <div className="divide-y divide-border">
                        {cart.items.map((cartItem) => (
                            <div key={cartItem.id} className="p-6 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="h-16 w-16 bg-muted rounded-md overflow-hidden flex-shrink-0">
                                        {cartItem.item?.image_url && <img src={cartItem.item.image_url} alt={cartItem.item.name} className="h-full w-full object-cover" />}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">{cartItem.item?.name || "Unknown Item"}</h3>
                                        <p className="text-muted-foreground text-sm">{cartItem.item?.category || "Unknown Category"}</p>
                                        <p className="text-xs text-muted-foreground mt-1">ID: {cartItem.item_id}, CartID: {cartItem.cart_id}</p>
                                    </div>
                                </div>
                                <div className="font-bold font-display text-lg">
                                    ${(cartItem.item?.price || 0).toFixed(2)}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="p-6 bg-muted/50 border-t border-border flex flex-col items-end">
                        <div className="flex justify-between w-full max-w-xs mb-6 text-xl font-bold">
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                        <button
                            onClick={handleCheckout}
                            className="bg-primary text-primary-foreground px-8 py-3 rounded-md font-bold hover:bg-primary/90 transition-all shadow-md flex items-center gap-2"
                        >
                            <CreditCard className="h-5 w-5" />
                            Checkout
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
