/**
 * Modal components - HeroUI wrapper with glass styling
 * New component for HeroUI migration
 */
import {
    Modal as HeroModal,
    ModalContent as HeroModalContent,
    ModalHeader as HeroModalHeader,
    ModalBody as HeroModalBody,
    ModalFooter as HeroModalFooter,
    useDisclosure,
} from "@heroui/react"
import { forwardRef } from "react"
import { cn } from "../../lib/utils"

// Root Modal component
const Modal = forwardRef(({ 
    children, 
    isOpen, 
    onClose, 
    onOpenChange,
    size = "md",
    className,
    ...props 
}, ref) => (
    <HeroModal
        ref={ref}
        isOpen={isOpen}
        onClose={onClose}
        onOpenChange={onOpenChange}
        size={size}
        backdrop="blur"
        classNames={{
            base: cn("glass-modal", className),
            header: "border-b border-[var(--glass-border)]",
            footer: "border-t border-[var(--glass-border)]",
            closeButton: "hover:bg-default-100/50 text-foreground/60 hover:text-foreground",
        }}
        {...props}
    >
        {children}
    </HeroModal>
))
Modal.displayName = "Modal"

// Modal Content wrapper
const ModalContent = forwardRef(({ children, className, ...props }, ref) => (
    <HeroModalContent ref={ref} className={cn(className)} {...props}>
        {(onClose) => (
            typeof children === 'function' ? children(onClose) : children
        )}
    </HeroModalContent>
))
ModalContent.displayName = "ModalContent"

// Modal Header
const ModalHeader = forwardRef(({ children, className, ...props }, ref) => (
    <HeroModalHeader 
        ref={ref} 
        className={cn("flex flex-col gap-1 text-foreground", className)} 
        {...props}
    >
        {children}
    </HeroModalHeader>
))
ModalHeader.displayName = "ModalHeader"

// Modal Body
const ModalBody = forwardRef(({ children, className, ...props }, ref) => (
    <HeroModalBody ref={ref} className={cn("py-4", className)} {...props}>
        {children}
    </HeroModalBody>
))
ModalBody.displayName = "ModalBody"

// Modal Footer
const ModalFooter = forwardRef(({ children, className, ...props }, ref) => (
    <HeroModalFooter ref={ref} className={cn(className)} {...props}>
        {children}
    </HeroModalFooter>
))
ModalFooter.displayName = "ModalFooter"

// Modal Title (for convenience)
const ModalTitle = forwardRef(({ children, className, ...props }, ref) => (
    <h2 
        ref={ref} 
        className={cn("text-lg font-semibold text-foreground", className)} 
        {...props}
    >
        {children}
    </h2>
))
ModalTitle.displayName = "ModalTitle"

// Modal Description (for convenience)
const ModalDescription = forwardRef(({ children, className, ...props }, ref) => (
    <p 
        ref={ref} 
        className={cn("text-sm text-muted-foreground", className)} 
        {...props}
    >
        {children}
    </p>
))
ModalDescription.displayName = "ModalDescription"

export {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalTitle,
    ModalDescription,
    useDisclosure,
    // Export HeroUI components directly
    HeroModal,
    HeroModalContent,
    HeroModalHeader,
    HeroModalBody,
    HeroModalFooter,
}
