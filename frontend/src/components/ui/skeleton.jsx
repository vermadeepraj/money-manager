/**
 * Skeleton component - HeroUI wrapper
 * Maintains backwards compatibility with shadcn/ui Skeleton API
 */
import { Skeleton as HeroSkeleton } from "@heroui/react"
import { cn } from "../../lib/utils"

function Skeleton({ className, ...props }) {
    return (
        <HeroSkeleton
            className={cn("rounded-md", className)}
            {...props}
        />
    )
}

export { Skeleton }
