/**
 * Chip component - HeroUI wrapper
 * New component for HeroUI migration
 */
import { Chip as HeroChip } from "@heroui/react"
import { cn } from "../../lib/utils"

/**
 * Chip - HeroUI-based chip/tag component
 * 
 * @example
 * <Chip color="success" variant="flat">Active</Chip>
 * <Chip color="warning" startContent={<AlertIcon />}>Warning</Chip>
 */
const Chip = ({
    children,
    color = "default", // default, primary, secondary, success, warning, danger
    variant = "solid", // solid, bordered, light, flat, faded, shadow, dot
    size = "md", // sm, md, lg
    radius = "full", // none, sm, md, lg, full
    isDisabled = false,
    startContent,
    endContent,
    avatar,
    onClose,
    classNames = {},
    className,
    ...props
}) => {
    return (
        <HeroChip
            color={color}
            variant={variant}
            size={size}
            radius={radius}
            isDisabled={isDisabled}
            startContent={startContent}
            endContent={endContent}
            avatar={avatar}
            onClose={onClose}
            classNames={{
                base: cn("", classNames.base),
                content: cn("", classNames.content),
                dot: cn("", classNames.dot),
                avatar: cn("", classNames.avatar),
                closeButton: cn("", classNames.closeButton),
                ...classNames,
            }}
            className={className}
            {...props}
        >
            {children}
        </HeroChip>
    )
}

export { Chip, HeroChip }
