/**
 * Badge component - HeroUI Chip wrapper
 * Maintains backwards compatibility with shadcn/ui Badge API
 */
import { Chip } from "@heroui/react"
import { cn } from "../../lib/utils"

// Map shadcn variants to HeroUI Chip colors
const variantMap = {
    default: { color: "primary", variant: "solid" },
    secondary: { color: "default", variant: "flat" },
    destructive: { color: "danger", variant: "solid" },
    outline: { color: "default", variant: "bordered" },
    success: { color: "success", variant: "solid" },
    warning: { color: "warning", variant: "solid" },
}

function Badge({ className, variant = "default", children, ...props }) {
    const chipVariant = variantMap[variant] || variantMap.default

    return (
        <Chip
            color={chipVariant.color}
            variant={chipVariant.variant}
            size="sm"
            className={cn(className)}
            {...props}
        >
            {children}
        </Chip>
    )
}

export { Badge }
