/**
 * UI Components - Barrel export file
 * Re-exports all UI components for easy imports
 */

// Core components
export { Button } from './button'
export { Input } from './input'
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from './card'
export { Skeleton } from './skeleton'
export { Badge } from './badge'
export { Progress, CircularProgress } from './progress'

// Select components
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
    HeroSelect,
    HeroSelectItem,
} from './select'

// Dropdown components
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
    Dropdown,
    DropdownTrigger,
    HeroDropdownMenu,
    DropdownItem,
    DropdownSection,
} from './dropdown-menu'

// Table components
export {
    Table,
    TableHeader,
    TableBody,
    TableFooter,
    TableHead,
    TableRow,
    TableCell,
    TableCaption,
    HeroTable,
    HeroTableHeader,
    HeroTableBody,
    TableColumn,
    HeroTableRow,
    HeroTableCell,
} from './table'

// Modal components
export {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalTitle,
    ModalDescription,
    useDisclosure,
} from './modal'

// Data table (TanStack wrapper - will be replaced in Phase 4)
export { DataTable } from './data-table'

// Tooltip components
export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider, HeroTooltip } from './tooltip'

// Switch/Toggle components
export { Switch, HeroSwitch } from './switch'

// Avatar components
export { Avatar, AvatarGroup, HeroAvatar, HeroAvatarGroup } from './avatar'

// NOTE: For Tabs and Accordion, import directly from @heroui/react
// These collection-based components don't work well with wrappers
// Example: import { Tabs, Tab, Accordion, AccordionItem } from '@heroui/react'

// Chip component
export { Chip, HeroChip } from './chip'

// Spinner component
export { Spinner, HeroSpinner } from './spinner'

// Popover components
export { Popover, PopoverTrigger, PopoverContent, HeroPopover, HeroPopoverTrigger, HeroPopoverContent } from './popover'
