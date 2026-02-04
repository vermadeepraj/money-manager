import { cn } from '../../lib/utils'
import { Spinner as HeroSpinner } from '@heroui/react'

/**
 * LoadingSpinner component
 * A reusable loading indicator with multiple size variants
 * Now using HeroUI Spinner
 * 
 * Usage:
 *   <LoadingSpinner />                    // Default medium size
 *   <LoadingSpinner size="sm" />          // Small spinner
 *   <LoadingSpinner size="lg" />          // Large spinner
 *   <LoadingSpinner className="text-emerald-500" />  // Custom color
 */
export function LoadingSpinner({ size = 'md', className, color = 'primary' }) {
    // Map custom sizes to HeroUI sizes
    const sizeMap = {
        xs: 'sm',
        sm: 'sm',
        md: 'md',
        lg: 'lg',
        xl: 'lg',
    }

    return (
        <HeroSpinner
            size={sizeMap[size] || 'md'}
            color={color}
            className={className}
        />
    )
}

/**
 * FullPageLoader component
 * Shows a centered loading spinner that fills the available space
 * 
 * Usage:
 *   <FullPageLoader />
 *   <FullPageLoader message="Loading transactions..." />
 */
export function FullPageLoader({ message = 'Loading...' }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
            <HeroSpinner size="lg" color="primary" />
            <p className="text-sm text-muted-foreground">{message}</p>
        </div>
    )
}

/**
 * InlineLoader component
 * A smaller inline loading indicator for buttons or inline elements
 * 
 * Usage:
 *   <InlineLoader />
 *   <Button disabled><InlineLoader /> Saving...</Button>
 */
export function InlineLoader({ className, color = 'current' }) {
    return (
        <HeroSpinner
            size="sm"
            color={color}
            className={cn('inline-block', className)}
        />
    )
}

/**
 * Skeleton component
 * Placeholder loading state for content
 * 
 * Usage:
 *   <Skeleton className="h-4 w-[200px]" />
 *   <Skeleton className="h-12 w-full" />
 */
export function Skeleton({ className }) {
    return (
        <div
            className={cn(
                'animate-pulse rounded-md bg-white/10',
                className
            )}
        />
    )
}

/**
 * TableSkeleton component
 * Loading placeholder for data tables
 * 
 * Usage:
 *   <TableSkeleton rows={5} columns={4} />
 */
export function TableSkeleton({ rows = 5, columns = 4 }) {
    return (
        <div className="space-y-3">
            {/* Header */}
            <div className="flex gap-4 p-4 border-b border-white/10">
                {Array.from({ length: columns }).map((_, i) => (
                    <Skeleton key={i} className="h-4 flex-1" />
                ))}
            </div>
            {/* Rows */}
            {Array.from({ length: rows }).map((_, rowIndex) => (
                <div key={rowIndex} className="flex gap-4 p-4">
                    {Array.from({ length: columns }).map((_, colIndex) => (
                        <Skeleton key={colIndex} className="h-4 flex-1" />
                    ))}
                </div>
            ))}
        </div>
    )
}

/**
 * CardSkeleton component
 * Loading placeholder for card content
 * 
 * Usage:
 *   <CardSkeleton />
 */
export function CardSkeleton() {
    return (
        <div className="p-6 rounded-xl bg-white/5 border border-white/10 space-y-4">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-3 w-2/3" />
        </div>
    )
}
