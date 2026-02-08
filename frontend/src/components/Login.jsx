import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/users/login', { username, password });
            localStorage.setItem('token', res.data.token);
            navigate('/items');
        } catch (err) {
            if (err.response) {
                if (err.response.status === 403) {
                    window.alert("You cannot login on another device.");
                } else if (err.response.status === 400) {
                    window.alert("Invalid username/password");
                } else {
                    window.alert("Login failed: " + err.response.data.error);
                }
            } else {
                console.error(err);
                window.alert("Login failed: Network error");
            }
        }
    };

    const handleRegister = async () => {
        try {
            await api.post('/users', { username, password });
            window.alert("User created! Please login.");
        } catch (err) {
            window.alert("Registration failed: " + (err.response?.data?.error || err.message));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md p-8 bg-card rounded-lg shadow-lg border border-border">
                <h2 className="text-3xl font-bold text-center mb-2 font-display text-foreground">Welcome Back</h2>
                <p className="text-center text-muted-foreground mb-8">Enter your credentials to access your account</p>
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Username</label>
                        <input
                            type="text"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2 rounded-md bg-input border border-input focus:ring-2 focus:ring-ring focus:border-transparent outline-none transition-all placeholder:text-muted-foreground"
                            placeholder="johndoe"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 rounded-md bg-input border border-input focus:ring-2 focus:ring-ring focus:border-transparent outline-none transition-all"
                            placeholder="••••••••"
                        />
                    </div>
                    <button type="submit" className="w-full bg-primary text-primary-foreground py-2 rounded-md font-medium hover:bg-primary/90 transition-colors shadow-sm">
                        Sign In
                    </button>
                </form>
                <div className="mt-6 text-center pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground mb-2">Don't have an account?</p>
                    <button onClick={handleRegister} className="text-sm font-medium text-primary hover:underline">
                        Create new account
                    </button>
                </div>
            </div>
        </div>
    );
}
