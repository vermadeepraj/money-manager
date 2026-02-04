import { useMemo, useCallback, useState } from 'react'
import { format } from 'date-fns'
import { MoreHorizontal, Pencil, Trash, ArrowUpDown, Copy, Undo2 } from 'lucide-react'
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    DropdownSection,
    Chip,
    Spinner,
    Pagination,
} from '@heroui/react'
import { Button } from '../ui/button'
import { formatCurrency } from '../../lib/utils'
import { useTransactionStore } from '../../stores/transactionStore'
import { toast } from 'sonner'

const columns = [
    { key: 'date', label: 'Date', sortable: true },
    { key: 'category', label: 'Category' },
    { key: 'description', label: 'Description' },
    { key: 'amount', label: 'Amount', sortable: true },
    { key: 'division', label: 'Division' },
    { key: 'account', label: 'Account' },
    { key: 'actions', label: '' },
]

export function TransactionTable({ 
    transactions, 
    isLoading, 
    pagination,
    onPageChange,
    onEdit 
}) {
    const { deleteTransaction, restoreTransaction } = useTransactionStore()
    const [sortDescriptor, setSortDescriptor] = useState({
        column: 'date',
        direction: 'descending',
    })

    // Sort transactions
    const sortedTransactions = useMemo(() => {
        if (!transactions?.length) return []
        
        return [...transactions].sort((a, b) => {
            let first, second
            
            switch (sortDescriptor.column) {
                case 'date':
                    first = new Date(a.date).getTime()
                    second = new Date(b.date).getTime()
                    break
                case 'amount':
                    first = a.amount
                    second = b.amount
                    break
                default:
                    return 0
            }
            
            const cmp = first < second ? -1 : first > second ? 1 : 0
            return sortDescriptor.direction === 'descending' ? -cmp : cmp
        })
    }, [transactions, sortDescriptor])

    const handleDelete = useCallback(async (transaction) => {
        const result = await deleteTransaction(transaction._id)
        
        if (result.success) {
            toast.success('Transaction deleted', {
                action: {
                    label: 'Undo',
                    onClick: async () => {
                        const restoreResult = await restoreTransaction(transaction._id)
                        if (restoreResult.success) {
                            toast.success('Transaction restored')
                        } else {
                            toast.error('Failed to restore transaction')
                        }
                    },
                },
                duration: 30000, // 30 second undo window
            })
        } else {
            toast.error(result.error || 'Failed to delete transaction')
        }
    }, [deleteTransaction, restoreTransaction])

    const handleCopyId = useCallback((id) => {
        navigator.clipboard.writeText(id)
        toast.success('Transaction ID copied')
    }, [])

    const renderCell = useCallback((transaction, columnKey) => {
        switch (columnKey) {
            case 'date':
                return (
                    <span className="text-sm">
                        {format(new Date(transaction.date), 'MMM d, yyyy')}
                    </span>
                )
            
            case 'category':
                const category = transaction.categoryId
                return (
                    <div className="flex items-center gap-2">
                        <span className="text-lg">{category?.emoji || '💰'}</span>
                        <span className="text-sm">{category?.name || 'Uncategorized'}</span>
                    </div>
                )
            
            case 'description':
                return (
                    <div 
                        className="max-w-[200px] truncate text-sm text-default-600" 
                        title={transaction.description}
                    >
                        {transaction.description || '-'}
                    </div>
                )
            
            case 'amount':
                const isIncome = transaction.type === 'income'
                return (
                    <div className={`text-right font-medium ${isIncome ? 'text-income' : 'text-expense'}`}>
                        {isIncome ? '+' : '-'} {formatCurrency(transaction.amount)}
                    </div>
                )
            
            case 'division':
                return (
                    <Chip
                        size="sm"
                        variant="flat"
                        color={transaction.division === 'office' ? 'secondary' : 'primary'}
                        classNames={{
                            base: "capitalize",
                        }}
                    >
                        {transaction.division}
                    </Chip>
                )
            
            case 'account':
                return (
                    <span className="text-sm text-default-600">
                        {transaction.accountId?.name || 'N/A'}
                    </span>
                )
            
            case 'actions':
                return (
                    <div className="flex justify-end">
                        <Dropdown>
                            <DropdownTrigger>
                                <Button 
                                    variant="ghost" 
                                    size="sm"
                                    isIconOnly
                                    className="h-8 w-8"
                                >
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu 
                                aria-label="Transaction actions"
                                classNames={{
                                    base: "min-w-[160px] p-1 bg-background border-none shadow-lg rounded-xl",
                                    list: "gap-0",
                                }}
                                itemClasses={{
                                    base: "rounded-lg px-3 py-2 text-foreground data-[hover=true]:bg-default-100 dark:data-[hover=true]:bg-white/5",
                                }}
                                onAction={(key) => {
                                    switch (key) {
                                        case 'copy':
                                            handleCopyId(transaction._id)
                                            break
                                        case 'edit':
                                            onEdit?.(transaction)
                                            break
                                        case 'delete':
                                            handleDelete(transaction)
                                            break
                                    }
                                }}
                            >
                                <DropdownSection title="Actions">
                                    <DropdownItem 
                                        key="copy"
                                        startContent={<Copy className="h-4 w-4" />}
                                    >
                                        Copy ID
                                    </DropdownItem>
                                    <DropdownItem 
                                        key="edit"
                                        startContent={<Pencil className="h-4 w-4" />}
                                    >
                                        Edit
                                    </DropdownItem>
                                </DropdownSection>
                                <DropdownSection>
                                    <DropdownItem 
                                        key="delete"
                                        className="text-danger"
                                        color="danger"
                                        startContent={<Trash className="h-4 w-4" />}
                                    >
                                        Delete
                                    </DropdownItem>
                                </DropdownSection>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                )
            
            default:
                return null
        }
    }, [handleCopyId, handleDelete, onEdit])

    const topContent = useMemo(() => {
        return (
            <div className="flex justify-between items-center px-2 py-2">
                <span className="text-default-400 text-sm">
                    {pagination.total} transactions
                </span>
            </div>
        )
    }, [pagination.total])

    const bottomContent = useMemo(() => {
        if (pagination.totalPages <= 1) return null
        
        return (
            <div className="flex justify-center py-4">
                <Pagination
                    isCompact
                    showControls
                    showShadow
                    color="primary"
                    page={pagination.page}
                    total={pagination.totalPages}
                    onChange={onPageChange}
                    classNames={{
                        wrapper: "gap-0 overflow-visible",
                        item: "bg-transparent",
                        cursor: "bg-primary",
                    }}
                />
            </div>
        )
    }, [pagination.page, pagination.totalPages, onPageChange])

    return (
        <Table
            aria-label="Transactions table"
            sortDescriptor={sortDescriptor}
            onSortChange={setSortDescriptor}
            topContent={topContent}
            bottomContent={bottomContent}
            classNames={{
                wrapper: "glass-card",
                th: "bg-[var(--glass-hover)] text-foreground/70 font-semibold",
                td: "py-3",
                tr: "hover:bg-[var(--glass-hover)] transition-colors border-b border-[var(--glass-border)] last:border-b-0",
            }}
        >
            <TableHeader columns={columns}>
                {(column) => (
                    <TableColumn 
                        key={column.key}
                        allowsSorting={column.sortable}
                        align={column.key === 'amount' || column.key === 'actions' ? 'end' : 'start'}
                    >
                        {column.label}
                    </TableColumn>
                )}
            </TableHeader>
            <TableBody 
                items={sortedTransactions}
                isLoading={isLoading}
                loadingContent={<Spinner color="primary" label="Loading transactions..." />}
                emptyContent={
                    <div className="py-12 text-center text-default-500">
                        No transactions found
                    </div>
                }
            >
                {(transaction) => (
                    <TableRow key={transaction._id}>
                        {(columnKey) => (
                            <TableCell>{renderCell(transaction, columnKey)}</TableCell>
                        )}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    )
}
