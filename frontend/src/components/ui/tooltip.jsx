/**
 * Tooltip components - HeroUI wrapper
 * New component for HeroUI migration
 */
import { Tooltip as HeroTooltip } from "@heroui/react"
import { cn } from "../../lib/utils"

/**
 * Tooltip - HeroUI-based tooltip component
 * 
 * @example
 * <Tooltip content="Edit item">
 *   <Button isIconOnly>
 *     <Edit2 className="w-4 h-4" />
 *   </Button>
 * </Tooltip>
 */
const Tooltip = ({
    children,
    content,
    placement = "top", // top, bottom, left, right, etc.
    delay = 0,
    closeDelay = 0,
    offset = 7,
    showArrow = true,
    color = "default", // default, primary, secondary, success, warning, danger
    size = "md",
    radius = "md",
    isDisabled = false,
    classNames = {},
    className,
    ...props
}) => {
    return (
        <HeroTooltip
            content={content}
            placement={placement}
            delay={delay}
            closeDelay={closeDelay}
            offset={offset}
            showArrow={showArrow}
            color={color}
            size={size}
            radius={radius}
            isDisabled={isDisabled}
            classNames={{
                base: cn("", classNames.base),
                content: cn(
                    "bg-[var(--bg-secondary)] text-foreground border border-white/10",
                    classNames.content
                ),
                ...classNames,
            }}
            className={className}
            {...props}
        >
            {children}
        </HeroTooltip>
    )
}

/**
 * TooltipTrigger - Just wraps children, HeroUI handles trigger automatically
 */
const TooltipTrigger = ({ children, asChild, ...props }) => {
    return children
}

/**
 * TooltipContent - For API compatibility, content is passed directly to Tooltip
 */
const TooltipContent = ({ children, ...props }) => {
    return children
}

/**
 * TooltipProvider - Not needed for HeroUI, pass through
 */
const TooltipProvider = ({ children, ...props }) => {
    return children
}

export { 
    Tooltip, 
    TooltipTrigger, 
    TooltipContent, 
    TooltipProvider,
    HeroTooltip 
}
