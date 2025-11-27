import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';

export default function Auth() {
    const [isLogin, setIsLogin] = useState<boolean>(false); // Start with register view
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const { login, register, isLoading } = useAuth();
    const [error, setError] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            if (isLogin) {
                await login(username, password);
            } else {
                await register(username, password);
            }
        } catch (err: any) {
            setError(err.message || `${isLogin ? 'Login' : 'Registration'} failed`);
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setError('');
        setUsername('');
        setPassword('');
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-50">
            <div className="w-full max-w-sm">
                <Card className="border border-gray-300">
                    <CardHeader className="text-center pb-4">
                        <CardTitle className="text-2xl font-semibold">
                            {isLogin ? 'Login' : 'Sign up'}
                        </CardTitle>
                        {!isLogin && (
                            <p className="text-gray-500 text-sm mt-2">
                                Sign up to see photos and videos from your friends.
                            </p>
                        )}
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <div className="space-y-1">
                                <Input
                                    id="username"
                                    type="text"
                                    placeholder="Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    className="bg-gray-50 border-gray-300"
                                />
                            </div>
                            <div className="space-y-1">
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="bg-gray-50 border-gray-300"
                                />
                            </div>
                            {error && (
                                <p className="text-red-500 text-sm font-medium text-center">
                                    {error}
                                </p>
                            )}
                            <Button
                                type="submit"
                                className="w-full bg-blue-500 hover:bg-blue-600"
                                disabled={isLoading}
                            >
                                {isLoading
                                    ? (isLogin ? 'Logging in...' : 'Signing up...')
                                    : (isLogin ? 'Log in' : 'Sign up')
                                }
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Toggle between login and signup */}
                <Card className="border border-gray-300 mt-3">
                    <CardContent className="text-center py-5">
                        <p className="text-sm">
                            {isLogin ? (
                                <>
                                    Don't have an account?{' '}
                                    <button
                                        type="button"
                                        onClick={toggleMode}
                                        className="text-blue-500 font-semibold hover:text-blue-700"
                                    >
                                        Sign up
                                    </button>
                                </>
                            ) : (
                                <>
                                    Already have an account?{' '}
                                    <button
                                        type="button"
                                        onClick={toggleMode}
                                        className="text-blue-500 font-semibold hover:text-blue-700"
                                    >
                                        Log in
                                    </button>
                                </>
                            )}
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
