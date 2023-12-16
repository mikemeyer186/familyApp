import { useNavigate } from 'react-router';
import { useUser } from '../../contexts/userContext';
import { useEffect } from 'react';

function ProtectedRoute({ children }) {
    const { isAuthenticated } = useUser();
    const navigate = useNavigate();

    /**
     * checks if user is authenticated
     * if not, redirects to login page
     */
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    return isAuthenticated ? children : null;
}

export default ProtectedRoute;
