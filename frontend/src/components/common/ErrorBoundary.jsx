import { Component } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '../ui/button'

/**
 * Error Boundary component to catch JavaScript errors in child components
 * Displays a fallback UI instead of crashing the whole app
 * 
 * Usage:
 *   <ErrorBoundary>
 *     <ComponentThatMightError />
 *   </ErrorBoundary>
 * 
 * Or with custom fallback:
 *   <ErrorBoundary fallback={<CustomErrorUI />}>
 *     <ComponentThatMightError />
 *   </ErrorBoundary>
 */
export class ErrorBoundary extends Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false, error: null, errorInfo: null }
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render shows the fallback UI
        return { hasError: true, error }
    }

    componentDidCatch(error, errorInfo) {
        // Log error to console (could also send to error reporting service)
        console.error('ErrorBoundary caught an error:', error, errorInfo)
        this.setState({ errorInfo })
        
        // Optional: Send to error reporting service
        // reportError(error, errorInfo)
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null, errorInfo: null })
    }

    handleReload = () => {
        window.location.reload()
    }

    render() {
        if (this.state.hasError) {
            // Custom fallback provided
            if (this.props.fallback) {
                return this.props.fallback
            }

            // Default fallback UI
            return (
                <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                        <AlertTriangle className="w-8 h-8 text-red-500" />
                    </div>
                    
                    <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
                    <p className="text-muted-foreground mb-6 max-w-md">
                        An unexpected error occurred. Please try again or refresh the page.
                    </p>

                    {/* Show error details in development */}
                    {import.meta.env.DEV && this.state.error && (
                        <details className="mb-6 text-left w-full max-w-lg">
                            <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                                Show error details
                            </summary>
                            <pre className="mt-2 p-4 bg-white/5 rounded-lg text-xs overflow-auto max-h-48 text-red-400">
                                {this.state.error.toString()}
                                {this.state.errorInfo?.componentStack}
                            </pre>
                        </details>
                    )}

                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            onClick={this.handleReset}
                        >
                            Try Again
                        </Button>
                        <Button onClick={this.handleReload}>
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Refresh Page
                        </Button>
                    </div>
                </div>
            )
        }

        return this.props.children
    }
}
