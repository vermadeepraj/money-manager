/**
 * Button component - HeroUI wrapper
 * Maintains backwards compatibility with shadcn/ui Button API
 */
import { Button as HeroButton } from "@heroui/react"
import { forwardRef } from "react"
import { cn } from "../../lib/utils"

// Map shadcn variants to HeroUI variants/colors
const variantMap = {
    default: { color: "primary", variant: "solid" },
    destructive: { color: "danger", variant: "solid" },
    outline: { color: "default", variant: "bordered" },
    secondary: { color: "default", variant: "flat" },
    ghost: { color: "default", variant: "light" },
    link: { color: "primary", variant: "light" },
}

// Map shadcn sizes to HeroUI sizes
const sizeMap = {
    default: "md",
    sm: "sm",
    lg: "lg",
    icon: "md",
}

const Button = forwardRef(
    ({ className, variant = "default", size = "default", children, ...props }, ref) => {
        const heroVariant = variantMap[variant] || variantMap.default
        const heroSize = sizeMap[size] || "md"
        const isIcon = size === "icon"

        return (
            <HeroButton
                ref={ref}
                color={heroVariant.color}
                variant={heroVariant.variant}
                size={heroSize}
                isIconOnly={isIcon}
                className={cn(
                    // 3D effect base class
                    "btn-3d",
                    // Custom styling to match existing theme
                    variant === "default" && "bg-accent hover:bg-accent-hover",
                    variant === "ghost" && "btn-flat bg-transparent hover:bg-default-100",
                    variant === "outline" && "border-border-subtle bg-transparent hover:bg-default-100",
                    variant === "link" && "btn-flat bg-transparent",
                    className
                )}
                {...props}
            >
                {children}
            </HeroButton>
        )
    }
)

Button.displayName = "Button"

export { Button }
