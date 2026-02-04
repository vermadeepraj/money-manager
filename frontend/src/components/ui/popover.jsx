/**
 * Popover component - HeroUI wrapper
 * New component for HeroUI migration
 */
import { 
    Popover as HeroPopover, 
    PopoverTrigger as HeroPopoverTrigger, 
    PopoverContent as HeroPopoverContent 
} from "@heroui/react"
import { cn } from "../../lib/utils"

/**
 * Popover - HeroUI-based popover component
 * 
 * @example
 * <Popover>
 *   <PopoverTrigger>
 *     <Button>Open Popover</Button>
 *   </PopoverTrigger>
 *   <PopoverContent>
 *     <div className="p-4">Popover content</div>
 *   </PopoverContent>
 * </Popover>
 */
const Popover = ({
    children,
    placement = "bottom", // top, bottom, left, right, etc.
    offset = 7,
    showArrow = true,
    backdrop = "transparent", // transparent, opaque, blur
    isOpen,
    defaultOpen = false,
    onOpenChange,
    shouldCloseOnBlur = true,
    shouldCloseOnInteractOutside,
    shouldBlockScroll = false,
    triggerScaleOnOpen = true,
    classNames = {},
    className,
    ...props
}) => {
    return (
        <HeroPopover
            placement={placement}
            offset={offset}
            showArrow={showArrow}
            backdrop={backdrop}
            isOpen={isOpen}
            defaultOpen={defaultOpen}
            onOpenChange={onOpenChange}
            shouldCloseOnBlur={shouldCloseOnBlur}
            shouldCloseOnInteractOutside={shouldCloseOnInteractOutside}
            shouldBlockScroll={shouldBlockScroll}
            triggerScaleOnOpen={triggerScaleOnOpen}
            classNames={{
                base: cn("", classNames.base),
                trigger: cn("", classNames.trigger),
                backdrop: cn("", classNames.backdrop),
                content: cn(
                    "bg-[var(--bg-secondary)] border border-white/10",
                    classNames.content
                ),
                arrow: cn("", classNames.arrow),
                ...classNames,
            }}
            className={className}
            {...props}
        >
            {children}
        </HeroPopover>
    )
}

/**
 * PopoverTrigger - Trigger element for the popover
 */
const PopoverTrigger = ({ children, ...props }) => {
    return (
        <HeroPopoverTrigger {...props}>
            {children}
        </HeroPopoverTrigger>
    )
}

/**
 * PopoverContent - Content of the popover
 */
const PopoverContent = ({ children, className, ...props }) => {
    return (
        <HeroPopoverContent className={className} {...props}>
            {children}
        </HeroPopoverContent>
    )
}

export { 
    Popover, 
    PopoverTrigger, 
    PopoverContent,
    HeroPopover, 
    HeroPopoverTrigger, 
    HeroPopoverContent 
}
