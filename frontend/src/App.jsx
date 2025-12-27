import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import { getAuthToken, removeAuthToken } from './utils/api';

function App() {
    const [currentPage, setCurrentPage] = useState('login');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    // Check authentication on mount
    useEffect(() => {
        const token = getAuthToken();
        if (token) {
            setIsAuthenticated(true);
            setCurrentPage('dashboard');
        }
    }, []);

    const handleLoginSuccess = (userData, token) => {
        setUser(userData);
        setIsAuthenticated(true);
        setCurrentPage('dashboard');
    };

    const handleLogout = () => {
        removeAuthToken();
        setIsAuthenticated(false);
        setUser(null);
        setCurrentPage('login');
    };

    const handleNavigate = (page) => {
        setCurrentPage(page);
    };

    // Render current page
    const renderPage = () => {
        if (isAuthenticated && currentPage === 'dashboard') {
            return <Dashboard user={user} onLogout={handleLogout} />;
        }

        switch (currentPage) {
            case 'register':
                return (
                    <Register
                        onSuccess={handleLoginSuccess}
                        onNavigate={handleNavigate}
                    />
                );
            case 'login':
            default:
                return (
                    <Login
                        onSuccess={handleLoginSuccess}
                        onNavigate={handleNavigate}
                    />
                );
        }
    };

    return <div className="min-h-screen">{renderPage()}</div>;
}

export default App;
