import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Loader2 } from 'lucide-react';

export function ProtectedRoute({ children }) {
    const { user, accessToken, isInitialized } = useAuthStore();
    const location = useLocation();

    // Show loading while checking auth
    if (!isInitialized) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <Loader2 className="w-8 h-8 animate-spin text-accent" />
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!user || !accessToken) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
}
