/**
 * Card components - HeroUI wrapper
 * Maintains backwards compatibility with shadcn/ui Card API
 */
import { Card as HeroCard, CardHeader as HeroCardHeader, CardBody, CardFooter as HeroCardFooter } from "@heroui/react"
import { forwardRef } from "react"
import { cn } from "../../lib/utils"

const Card = forwardRef(({ className, children, ...props }, ref) => (
    <HeroCard
        ref={ref}
        className={cn(
            "card-3d",
            className
        )}
        {...props}
    >
        {children}
    </HeroCard>
))
Card.displayName = "Card"

const CardHeader = forwardRef(({ className, children, ...props }, ref) => (
    <HeroCardHeader
        ref={ref}
        className={cn("flex flex-col gap-1.5 p-6", className)}
        {...props}
    >
        {children}
    </HeroCardHeader>
))
CardHeader.displayName = "CardHeader"

const CardTitle = forwardRef(({ className, children, ...props }, ref) => (
    <h3
        ref={ref}
        className={cn("text-lg font-semibold leading-none tracking-tight text-foreground", className)}
        {...props}
    >
        {children}
    </h3>
))
CardTitle.displayName = "CardTitle"

const CardDescription = forwardRef(({ className, children, ...props }, ref) => (
    <p
        ref={ref}
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
    >
        {children}
    </p>
))
CardDescription.displayName = "CardDescription"

const CardContent = forwardRef(({ className, children, ...props }, ref) => (
    <CardBody
        ref={ref}
        className={cn("p-6 pt-0", className)}
        {...props}
    >
        {children}
    </CardBody>
))
CardContent.displayName = "CardContent"

const CardFooter = forwardRef(({ className, children, ...props }, ref) => (
    <HeroCardFooter
        ref={ref}
        className={cn("flex items-center p-6 pt-0", className)}
        {...props}
    >
        {children}
    </HeroCardFooter>
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
