/**
 * Input component - HeroUI wrapper with glass styling
 * Uses custom label rendering to avoid HeroUI's floating label issues
 */
import { Input as HeroInput } from "@heroui/react"
import { forwardRef } from "react"
import { cn } from "../../lib/utils"

const Input = forwardRef(({ 
    className, 
    type, 
    error, 
    label, 
    description,
    classNames: customClassNames, 
    ...props 
}, ref) => {
    // Check if this is an auth-style input (used in Login/Register pages)
    const isAuthInput = className?.includes('auth-input')
    
    return (
        <div className="w-full">
            {/* Custom Label - rendered outside HeroUI */}
            {label && (
                <label className="block text-sm font-medium text-foreground mb-1.5">
                    {label}
                </label>
            )}
            
            <HeroInput
                ref={ref}
                type={type}
                isInvalid={!!error}
                errorMessage={error}
                variant="bordered"
                classNames={{
                    base: cn("w-full", !isAuthInput && className),
                    mainWrapper: "h-full",
                    input: cn(
                        "text-foreground placeholder:text-muted-foreground/60",
                        "bg-transparent",
                        "!border-none !shadow-none !outline-none",
                        customClassNames?.input
                    ),
                    inputWrapper: cn(
                        isAuthInput ? className : "",
                        "!h-10 !min-h-10",
                        error && "!border-danger",
                        customClassNames?.inputWrapper
                    ),
                    innerWrapper: "h-full",
                    helperWrapper: "pt-1",
                }}
                {...props}
            />
            
            {/* Description text */}
            {description && !error && (
                <p className="text-xs text-muted-foreground mt-1">{description}</p>
            )}
        </div>
    )
})

Input.displayName = "Input"

export { Input }
