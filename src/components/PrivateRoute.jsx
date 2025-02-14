import { Navigate } from 'react-router';
import { useState, useEffect } from 'react';

const PrivateRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const apiUrl =  process.env.REACT_APP_API_URL;
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch(`${apiUrl}/verify-token`, {
                    method: 'GET',
                    credentials: 'include', // Include cookies in the request
                });
                setIsAuthenticated(response.ok); // Set to true if the token is valid
            } catch (error) {
                console.error('Authentication check failed:', error);
                setIsAuthenticated(false); // User is not authenticated
            }
        };

        checkAuth();
    }, []);

    if (isAuthenticated === null) {
        return <div>Loading...</div>; // Optionally show a loading indicator
    }

    return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
