/**
 * Avatar components - HeroUI wrapper
 * New component for HeroUI migration
 */
import { Avatar as HeroAvatar, AvatarGroup as HeroAvatarGroup } from "@heroui/react"
import { cn } from "../../lib/utils"

/**
 * Avatar - HeroUI-based avatar component
 * 
 * @example
 * <Avatar 
 *   src="/user-photo.jpg" 
 *   name="John Doe"
 *   size="lg"
 * />
 */
const Avatar = ({
    src,
    name,
    alt,
    icon,
    size = "md", // sm, md, lg
    radius = "full", // none, sm, md, lg, full
    color = "default", // default, primary, secondary, success, warning, danger
    isBordered = false,
    isDisabled = false,
    showFallback = true,
    fallback,
    classNames = {},
    className,
    ...props
}) => {
    return (
        <HeroAvatar
            src={src}
            name={name}
            alt={alt || name}
            icon={icon}
            size={size}
            radius={radius}
            color={color}
            isBordered={isBordered}
            isDisabled={isDisabled}
            showFallback={showFallback}
            fallback={fallback}
            classNames={{
                base: cn("", classNames.base),
                img: cn("", classNames.img),
                fallback: cn("", classNames.fallback),
                name: cn("", classNames.name),
                icon: cn("", classNames.icon),
                ...classNames,
            }}
            className={className}
            {...props}
        />
    )
}

/**
 * AvatarGroup - Group multiple avatars together
 * 
 * @example
 * <AvatarGroup max={3}>
 *   <Avatar src="/user1.jpg" name="User 1" />
 *   <Avatar src="/user2.jpg" name="User 2" />
 *   <Avatar src="/user3.jpg" name="User 3" />
 * </AvatarGroup>
 */
const AvatarGroup = ({
    children,
    max = 5,
    total,
    size = "md",
    color = "default",
    radius = "full",
    isBordered = false,
    isGrid = false,
    isDisabled = false,
    renderCount,
    classNames = {},
    className,
    ...props
}) => {
    return (
        <HeroAvatarGroup
            max={max}
            total={total}
            size={size}
            color={color}
            radius={radius}
            isBordered={isBordered}
            isGrid={isGrid}
            isDisabled={isDisabled}
            renderCount={renderCount}
            classNames={{
                base: cn("", classNames.base),
                count: cn("", classNames.count),
                ...classNames,
            }}
            className={className}
            {...props}
        >
            {children}
        </HeroAvatarGroup>
    )
}

export { Avatar, AvatarGroup, HeroAvatar, HeroAvatarGroup }
