import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/login', { username, password });
            localStorage.setItem('token', res.data.token);
            navigate('/items');
        } catch (err) {
            window.alert("Invalid username/password");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md p-8 bg-card rounded-2xl shadow-xl border border-border">
                <h2 className="text-3xl font-bold text-center mb-8 font-display">Sign In</h2>
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Username</label>
                        <input
                            type="text"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-muted border-none focus:ring-2 focus:ring-primary outline-none transition-all"
                            placeholder="johndoe"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-muted border-none focus:ring-2 focus:ring-primary outline-none transition-all"
                            placeholder="••••••••"
                        />
                    </div>
                    <button type="submit" className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
