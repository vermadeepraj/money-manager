/**
 * Select components - HeroUI wrapper
 * Maintains backwards compatibility with shadcn/ui Select API
 */
import { Select as HeroSelect, SelectItem as HeroSelectItem, SelectSection } from "@heroui/react"
import { forwardRef, createContext, useContext } from "react"
import { cn } from "../../lib/utils"

// Context to pass value and onChange between Select and SelectItem
const SelectContext = createContext({})

// Root Select component - manages state
const Select = forwardRef(({ children, value, onValueChange, defaultValue, ...props }, ref) => {
    return (
        <SelectContext.Provider value={{ value, onValueChange, defaultValue }}>
            {children}
        </SelectContext.Provider>
    )
})
Select.displayName = "Select"

// SelectGroup - wrapper for grouping items
const SelectGroup = ({ children, ...props }) => (
    <SelectSection {...props}>{children}</SelectSection>
)
SelectGroup.displayName = "SelectGroup"

// SelectValue - placeholder display (handled by HeroUI internally)
const SelectValue = ({ placeholder }) => null // HeroUI handles this internally
SelectValue.displayName = "SelectValue"

// SelectTrigger - the main select trigger component
const SelectTrigger = forwardRef(({ className, children, ...props }, ref) => {
    const { value, onValueChange, defaultValue } = useContext(SelectContext)
    
    // This is a passthrough - actual HeroUI Select is rendered elsewhere
    return (
        <div ref={ref} className={cn("w-full", className)} {...props}>
            {children}
        </div>
    )
})
SelectTrigger.displayName = "SelectTrigger"

// SelectContent - wraps the dropdown content
const SelectContent = forwardRef(({ className, children, ...props }, ref) => {
    return <>{children}</>
})
SelectContent.displayName = "SelectContent"

// SelectLabel - label for a group
const SelectLabel = forwardRef(({ className, children, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("py-1.5 pl-2 pr-2 text-sm font-semibold text-muted-foreground", className)}
        {...props}
    >
        {children}
    </div>
))
SelectLabel.displayName = "SelectLabel"

// SelectItem - individual selectable item
const SelectItem = forwardRef(({ className, children, value, ...props }, ref) => (
    <HeroSelectItem
        ref={ref}
        key={value}
        value={value}
        className={cn(className)}
        {...props}
    >
        {children}
    </HeroSelectItem>
))
SelectItem.displayName = "SelectItem"

// SelectSeparator - divider between items
const SelectSeparator = forwardRef(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("-mx-1 my-1 h-px bg-divider", className)}
        {...props}
    />
))
SelectSeparator.displayName = "SelectSeparator"

// HeroUI-native Select component for direct usage
const NativeSelect = forwardRef(({ 
    className, 
    label, 
    placeholder, 
    children, 
    value, 
    onChange, 
    onValueChange,
    selectedKeys,
    onSelectionChange,
    error,
    ...props 
}, ref) => {
    // Handle both controlled patterns
    const handleSelectionChange = (keys) => {
        const selectedValue = Array.from(keys)[0]
        if (onSelectionChange) onSelectionChange(keys)
        if (onValueChange) onValueChange(selectedValue)
        if (onChange) onChange({ target: { value: selectedValue } })
    }

    return (
        <HeroSelect
            ref={ref}
            label={label}
            labelPlacement="outside"
            placeholder={placeholder}
            selectedKeys={selectedKeys || (value ? new Set([value]) : undefined)}
            onSelectionChange={handleSelectionChange}
            isInvalid={!!error}
            errorMessage={error}
            variant="bordered"
            classNames={{
                base: cn("w-full", className),
                trigger: cn(
                    "bg-content1 border-border hover:border-default-400",
                    "data-[focus=true]:border-primary",
                    error && "border-danger"
                ),
                value: "text-foreground",
                popoverContent: "bg-content1 border border-border",
            }}
            {...props}
        >
            {children}
        </HeroSelect>
    )
})
NativeSelect.displayName = "NativeSelect"

export {
    Select,
    SelectGroup,
    SelectValue,
    SelectTrigger,
    SelectContent,
    SelectLabel,
    SelectItem,
    SelectSeparator,
    NativeSelect,
    // Also export HeroUI components directly for easier migration
    HeroSelect,
    HeroSelectItem,
}
