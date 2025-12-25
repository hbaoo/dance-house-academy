import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../services/authService';

/**
 * Guard component that ensures the user is authenticated before rendering children.
 * It performs an async check against Supabase Auth and shows a loading indicator
 * while the authentication status is being resolved.
 */
const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const location = useLocation();
    const [checked, setChecked] = useState(false);
    const [auth, setAuth] = useState(false);

    useEffect(() => {
        const verify = async () => {
            const result = await isAuthenticated();
            setAuth(result);
            setChecked(true);
        };
        verify();
    }, []);

    if (!checked) {
        // Simple loading UI – can be replaced with a spinner if desired
        return (
            <div className="flex items-center justify-center min-h-screen">
                <span className="text-gray-500">Đang kiểm tra quyền truy cập…</span>
            </div>
        );
    }

    if (!auth) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};

export default RequireAuth;
