import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Loader2 } from 'lucide-react';

/**
 * PublicRoute - Redirects authenticated users away from public pages
 * Used for login/register pages to redirect logged-in users to the app
 */
export function PublicRoute({ children }) {
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

    // Redirect to app if already authenticated
    if (user && accessToken) {
        // Redirect to the page they were trying to visit, or dashboard
        const from = location.state?.from?.pathname || '/app/dashboard';
        return <Navigate to={from} replace />;
    }

    return children;
}
