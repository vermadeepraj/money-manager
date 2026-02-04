/**
 * Dropdown Menu components - HeroUI wrapper
 * Maintains backwards compatibility with shadcn/ui DropdownMenu API
 */
import { 
    Dropdown, 
    DropdownTrigger, 
    DropdownMenu as HeroDropdownMenu, 
    DropdownItem,
    DropdownSection
} from "@heroui/react"
import { forwardRef } from "react"
import { cn } from "../../lib/utils"

// Root component
const DropdownMenu = ({ children, ...props }) => (
    <Dropdown {...props}>{children}</Dropdown>
)
DropdownMenu.displayName = "DropdownMenu"

// Trigger component
const DropdownMenuTrigger = forwardRef(({ children, asChild, ...props }, ref) => (
    <DropdownTrigger ref={ref} {...props}>
        {children}
    </DropdownTrigger>
))
DropdownMenuTrigger.displayName = "DropdownMenuTrigger"

// Content component
const DropdownMenuContent = forwardRef(({ className, children, sideOffset, align, ...props }, ref) => (
    <HeroDropdownMenu
        ref={ref}
        aria-label="Menu"
        className={cn("min-w-[8rem]", className)}
        classNames={{
            base: "p-1 bg-background border-none shadow-lg rounded-xl",
            list: "gap-0",
        }}
        itemClasses={{
            base: cn(
                "rounded-lg px-3 py-2 text-sm",
                "data-[hover=true]:bg-default-100 dark:data-[hover=true]:bg-white/5",
                "data-[hover=true]:text-foreground",
                "transition-colors"
            ),
        }}
        {...props}
    >
        {children}
    </HeroDropdownMenu>
))
DropdownMenuContent.displayName = "DropdownMenuContent"

// Menu Item
const DropdownMenuItem = forwardRef(({ className, inset, children, onSelect, ...props }, ref) => (
    <DropdownItem
        ref={ref}
        className={cn(inset && "pl-8", className)}
        onPress={onSelect}
        {...props}
    >
        {children}
    </DropdownItem>
))
DropdownMenuItem.displayName = "DropdownMenuItem"

// Group component
const DropdownMenuGroup = ({ children, ...props }) => (
    <DropdownSection {...props}>{children}</DropdownSection>
)
DropdownMenuGroup.displayName = "DropdownMenuGroup"

// Label component
const DropdownMenuLabel = forwardRef(({ className, inset, children, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("px-2 py-1.5 text-sm font-semibold text-foreground", inset && "pl-8", className)}
        {...props}
    >
        {children}
    </div>
))
DropdownMenuLabel.displayName = "DropdownMenuLabel"

// Separator component
const DropdownMenuSeparator = forwardRef(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("-mx-1 my-1 h-px bg-divider", className)}
        {...props}
    />
))
DropdownMenuSeparator.displayName = "DropdownMenuSeparator"

// Shortcut component (keyboard shortcut display)
const DropdownMenuShortcut = ({ className, ...props }) => (
    <span
        className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
        {...props}
    />
)
DropdownMenuShortcut.displayName = "DropdownMenuShortcut"

// Portal - not needed in HeroUI, just pass through
const DropdownMenuPortal = ({ children }) => <>{children}</>
DropdownMenuPortal.displayName = "DropdownMenuPortal"

// Sub menu components - simplified versions
const DropdownMenuSub = ({ children }) => <>{children}</>
DropdownMenuSub.displayName = "DropdownMenuSub"

const DropdownMenuSubTrigger = forwardRef(({ className, inset, children, ...props }, ref) => (
    <DropdownItem
        ref={ref}
        className={cn(inset && "pl-8", className)}
        {...props}
    >
        {children}
    </DropdownItem>
))
DropdownMenuSubTrigger.displayName = "DropdownMenuSubTrigger"

const DropdownMenuSubContent = forwardRef(({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn(className)} {...props}>{children}</div>
))
DropdownMenuSubContent.displayName = "DropdownMenuSubContent"

// Checkbox item - simplified
const DropdownMenuCheckboxItem = forwardRef(({ className, children, checked, ...props }, ref) => (
    <DropdownItem
        ref={ref}
        className={cn(className)}
        {...props}
    >
        {children}
    </DropdownItem>
))
DropdownMenuCheckboxItem.displayName = "DropdownMenuCheckboxItem"

// Radio group and item - simplified
const DropdownMenuRadioGroup = ({ children, ...props }) => (
    <DropdownSection {...props}>{children}</DropdownSection>
)
DropdownMenuRadioGroup.displayName = "DropdownMenuRadioGroup"

const DropdownMenuRadioItem = forwardRef(({ className, children, ...props }, ref) => (
    <DropdownItem
        ref={ref}
        className={cn(className)}
        {...props}
    >
        {children}
    </DropdownItem>
))
DropdownMenuRadioItem.displayName = "DropdownMenuRadioItem"

export {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuCheckboxItem,
    DropdownMenuRadioItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuGroup,
    DropdownMenuPortal,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuRadioGroup,
    // Also export HeroUI components directly
    Dropdown,
    DropdownTrigger,
    HeroDropdownMenu,
    DropdownItem,
    DropdownSection,
}
