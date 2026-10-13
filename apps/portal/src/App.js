import { jsx as _jsx } from "react/jsx-runtime";
import { useState } from 'react';
import { LoginForm } from './components/LoginForm';
import { Dashboard } from './components/Dashboard';
function App() {
    const [authState, setAuthState] = useState('login');
    const [doctorName, setDoctorName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const handleLogin = async (email, _password) => {
        setIsLoading(true);
        try {
            // Simulate login delay
            await new Promise((resolve) => setTimeout(resolve, 500));
            // Extract name from email for demo
            const name = email.split('@')[0].split('.').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
            setDoctorName(`Dr. ${name}`);
            setAuthState('authenticated');
            // Store auth state in localStorage
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('doctorEmail', email);
            localStorage.setItem('doctorName', `Dr. ${name}`);
        }
        catch (error) {
            console.error('Login error:', error);
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleLogout = () => {
        setAuthState('login');
        setDoctorName('');
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('doctorEmail');
        localStorage.removeItem('doctorName');
    };
    // Check if user was previously authenticated
    if (!doctorName && localStorage.getItem('isAuthenticated')) {
        const savedName = localStorage.getItem('doctorName') || '';
        setDoctorName(savedName);
        setAuthState('authenticated');
    }
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center py-12 px-4", children: authState === 'login' ? (_jsx(LoginForm, { onSubmit: handleLogin, isLoading: isLoading })) : (_jsx(Dashboard, { doctorName: doctorName, onLogout: handleLogout })) }));
}
export default App;
