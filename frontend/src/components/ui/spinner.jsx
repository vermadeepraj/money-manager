/**
 * Spinner component - HeroUI wrapper
 * New component for HeroUI migration
 */
import { Spinner as HeroSpinner } from "@heroui/react"
import { cn } from "../../lib/utils"

/**
 * Spinner - HeroUI-based loading spinner component
 * 
 * @example
 * <Spinner size="lg" color="primary" />
 * <Spinner label="Loading..." />
 */
const Spinner = ({
    size = "md", // sm, md, lg
    color = "primary", // current, white, default, primary, secondary, success, warning, danger
    label,
    labelColor = "foreground",
    classNames = {},
    className,
    ...props
}) => {
    return (
        <HeroSpinner
            size={size}
            color={color}
            label={label}
            labelColor={labelColor}
            classNames={{
                base: cn("", classNames.base),
                wrapper: cn("", classNames.wrapper),
                circle1: cn("", classNames.circle1),
                circle2: cn("", classNames.circle2),
                label: cn("", classNames.label),
                ...classNames,
            }}
            className={className}
            {...props}
        />
    )
}

export { Spinner, HeroSpinner }
