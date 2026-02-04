/**
 * Progress component - HeroUI wrapper
 * New component for HeroUI migration
 */
import { Progress as HeroProgress, CircularProgress as HeroCircularProgress } from "@heroui/react"
import { forwardRef } from "react"
import { cn } from "../../lib/utils"

// Linear Progress bar
const Progress = forwardRef(({ 
    className, 
    value = 0, 
    max = 100,
    color = "primary",
    size = "md",
    label,
    showValueLabel = false,
    ...props 
}, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

    return (
        <HeroProgress
            ref={ref}
            value={percentage}
            color={color}
            size={size}
            label={label}
            showValueLabel={showValueLabel}
            classNames={{
                base: cn("w-full", className),
                track: "bg-default-200",
                indicator: color === "primary" ? "bg-accent" : undefined,
            }}
            {...props}
        />
    )
})
Progress.displayName = "Progress"

// Circular Progress
const CircularProgress = forwardRef(({
    className,
    value,
    color = "primary",
    size = "md",
    showValueLabel = false,
    strokeWidth,
    ...props
}, ref) => (
    <HeroCircularProgress
        ref={ref}
        value={value}
        color={color}
        size={size}
        showValueLabel={showValueLabel}
        strokeWidth={strokeWidth}
        classNames={{
            base: cn(className),
            svg: "w-full h-full",
            track: "stroke-default-200",
            indicator: color === "primary" ? "stroke-accent" : undefined,
        }}
        {...props}
    />
))
CircularProgress.displayName = "CircularProgress"

export { Progress, CircularProgress }
