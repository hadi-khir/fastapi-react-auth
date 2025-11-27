import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface User {
    username: string;
    id: number;
}

interface AuthContextType {
    token: string | null;
    user: User | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    // Initialize state from local storage to persist login across refreshes
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Effect to fetch user details if a token exists on mount
    useEffect(() => {
        if (token && !user) {
            fetchUser(token);
        }
    }, [token]);

    const login = async (username: string, password: string) => {
        setIsLoading(true);
        try {
            // OAuth2 standard requires x-www-form-urlencoded
            const formData = new URLSearchParams();
            formData.append('username', username);
            formData.append('password', password);

            const response = await fetch('http://localhost:8000/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Login failed');
            }

            const data = await response.json();
            const accessToken = data.access_token;

            // Save and set state
            localStorage.setItem('token', accessToken);
            setToken(accessToken);

            // Fetch user immediately
            await fetchUser(accessToken);
        } catch (error) {
            console.error(error);
            throw error; // Re-throw for the Login component to handle
        } finally {
            setIsLoading(false);
        }
    };

    const fetchUser = async (accessToken: string) => {
        try {
            const response = await fetch('http://localhost:8000/users/me', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user');
            }

            const userData: User = await response.json();
            setUser(userData);
        } catch (error) {
            // If fetching user fails (e.g., token expired), log them out
            logout();
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ token, user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};