import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../api/api';
import { PackageCheck } from 'lucide-react';

export default function Orders() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await api.get('/orders');
                setOrders(res.data.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchOrders();
    }, []);

    const showOrderDetails = (order) => {
        const orderIds = orders.map(o => `Order #${o._id} ($${(o.total_price || 0).toFixed(2)})`).join('\n');
        window.alert(`Your Orders:\n${orderIds}`);
    };

    if (orders.length === 0) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 py-16 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                        <PackageCheck className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2 font-display">No orders yet</h2>
                    <p className="text-muted-foreground mb-8">Items you purchase will appear here.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="max-w-4xl mx-auto px-4 py-12">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight font-display mb-2">Order History</h1>
                        <p className="text-muted-foreground">Manage and track your past orders.</p>
                    </div>
                    <div className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-bold">
                        {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
                    </div>
                </div>

                <div className="space-y-4">
                    {orders.map((order) => (
                        <div
                            key={order._id}
                            className="group bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300"
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="h-12 w-12 rounded-xl bg-primary/5 flex items-center justify-center">
                                        <PackageCheck className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-bold text-lg">Order #{order._id.substring(order._id.length - 8).toUpperCase()}</span>
                                            <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-wider">
                                                {order.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                                                month: 'long',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 pt-4 md:pt-0 mt-2 md:mt-0">
                                    <span className="text-sm text-muted-foreground md:mb-1 font-medium">Total Amount</span>
                                    <span className="text-2xl font-bold font-display text-primary">
                                        ${(order.total_price || 0).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
