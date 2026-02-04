/**
 * Switch components - HeroUI wrapper
 * New component for HeroUI migration
 */
import { Switch as HeroSwitch } from "@heroui/react"
import { cn } from "../../lib/utils"

/**
 * Switch - HeroUI-based toggle switch component
 * 
 * @example
 * <Switch 
 *   isSelected={isDarkMode}
 *   onValueChange={setIsDarkMode}
 * >
 *   Dark Mode
 * </Switch>
 */
const Switch = ({
    children,
    isSelected,
    defaultSelected,
    onValueChange,
    value,
    name,
    size = "md", // sm, md, lg
    color = "primary", // default, primary, secondary, success, warning, danger
    isDisabled = false,
    isReadOnly = false,
    startContent,
    endContent,
    thumbIcon,
    classNames = {},
    className,
    ...props
}) => {
    return (
        <HeroSwitch
            isSelected={isSelected}
            defaultSelected={defaultSelected}
            onValueChange={onValueChange}
            value={value}
            name={name}
            size={size}
            color={color}
            isDisabled={isDisabled}
            isReadOnly={isReadOnly}
            startContent={startContent}
            endContent={endContent}
            thumbIcon={thumbIcon}
            classNames={{
                base: cn("", classNames.base),
                wrapper: cn(
                    "bg-default-200 group-data-[selected=true]:bg-accent",
                    classNames.wrapper
                ),
                thumb: cn("", classNames.thumb),
                label: cn("text-foreground", classNames.label),
                ...classNames,
            }}
            className={className}
            {...props}
        >
            {children}
        </HeroSwitch>
    )
}

export { Switch, HeroSwitch }
