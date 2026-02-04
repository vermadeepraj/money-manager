import { format } from 'date-fns';
import { MoreHorizontal, ArrowUpDown, Pencil, Trash } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';
import { Button } from '../ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '../ui/dropdown-menu';
import { Badge } from '../ui/badge';

export const columns = [
    {
        accessorKey: "date",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => format(new Date(row.getValue("date")), "MMM d, yyyy"),
    },
    {
        accessorKey: "categoryId",
        header: "Category",
        cell: ({ row }) => {
            const category = row.getValue("categoryId");
            return (
                <div className="flex items-center gap-2">
                    <span className="text-lg">{category?.emoji || '💰'}</span>
                    <span>{category?.name || 'Uncategorized'}</span>
                </div>
            )
        }
    },
    {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => {
            return <div className="max-w-[200px] truncate" title={row.getValue("description")}>{row.getValue("description")}</div>
        }
    },
    {
        accessorKey: "amount",
        header: ({ column }) => {
            return (
                <div className="text-right">
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Amount
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            )
        },
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("amount"));
            const type = row.original.type;
            const formatted = formatCurrency(amount);

            return <div className={`text-right font-medium ${type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                {type === 'income' ? '+' : '-'} {formatted}
            </div>
        },
    },
    {
        accessorKey: "division",
        header: "Division",
        cell: ({ row }) => {
            const division = row.getValue("division");
            return (
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${division === 'office' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-blue-500/10 text-blue-400'
                    }`}>
                    {division}
                </span>
            )
        }
    },
    {
        accessorKey: "accountId",
        header: "Account",
        cell: ({ row }) => row.getValue("accountId")?.name || 'N/A'
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const transaction = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(transaction._id)}>
                            Copy ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => console.log('Edit', transaction)}>
                            <Pencil className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => console.log('Delete', transaction)} className="text-danger">
                            <Trash className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
