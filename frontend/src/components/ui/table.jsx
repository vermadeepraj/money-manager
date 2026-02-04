/**
 * Table components - HeroUI wrapper
 * Maintains backwards compatibility with shadcn/ui Table API
 * 
 * Note: For the full HeroUI Table with sorting/pagination, 
 * import directly from @heroui/react
 */
import { 
    Table as HeroTable, 
    TableHeader as HeroTableHeader, 
    TableBody as HeroTableBody, 
    TableColumn, 
    TableRow as HeroTableRow, 
    TableCell as HeroTableCell 
} from "@heroui/react"
import { forwardRef } from "react"
import { cn } from "../../lib/utils"

// Simple HTML table wrappers for backwards compatibility
// These maintain the shadcn/ui API for gradual migration

const Table = forwardRef(({ className, children, ...props }, ref) => (
    <div className="relative w-full overflow-auto">
        <table
            ref={ref}
            className={cn("w-full caption-bottom text-sm", className)}
            {...props}
        >
            {children}
        </table>
    </div>
))
Table.displayName = "Table"

const TableHeader = forwardRef(({ className, children, ...props }, ref) => (
    <thead 
        ref={ref} 
        className={cn("[&_tr]:border-b border-border", className)} 
        {...props}
    >
        {children}
    </thead>
))
TableHeader.displayName = "TableHeader"

const TableBody = forwardRef(({ className, children, ...props }, ref) => (
    <tbody
        ref={ref}
        className={cn("[&_tr:last-child]:border-0", className)}
        {...props}
    >
        {children}
    </tbody>
))
TableBody.displayName = "TableBody"

const TableFooter = forwardRef(({ className, children, ...props }, ref) => (
    <tfoot
        ref={ref}
        className={cn("border-t border-border bg-muted/50 font-medium [&>tr]:last:border-b-0", className)}
        {...props}
    >
        {children}
    </tfoot>
))
TableFooter.displayName = "TableFooter"

const TableRow = forwardRef(({ className, children, ...props }, ref) => (
    <tr
        ref={ref}
        className={cn(
            "border-b border-border transition-colors hover:bg-default-100 data-[state=selected]:bg-accent/10",
            className
        )}
        {...props}
    >
        {children}
    </tr>
))
TableRow.displayName = "TableRow"

const TableHead = forwardRef(({ className, children, ...props }, ref) => (
    <th
        ref={ref}
        className={cn(
            "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
            className
        )}
        {...props}
    >
        {children}
    </th>
))
TableHead.displayName = "TableHead"

const TableCell = forwardRef(({ className, children, ...props }, ref) => (
    <td
        ref={ref}
        className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
        {...props}
    >
        {children}
    </td>
))
TableCell.displayName = "TableCell"

const TableCaption = forwardRef(({ className, children, ...props }, ref) => (
    <caption
        ref={ref}
        className={cn("mt-4 text-sm text-muted-foreground", className)}
        {...props}
    >
        {children}
    </caption>
))
TableCaption.displayName = "TableCaption"

export {
    Table,
    TableHeader,
    TableBody,
    TableFooter,
    TableHead,
    TableRow,
    TableCell,
    TableCaption,
    // Export HeroUI table components for direct usage
    HeroTable,
    HeroTableHeader,
    HeroTableBody,
    TableColumn,
    HeroTableRow,
    HeroTableCell,
}
