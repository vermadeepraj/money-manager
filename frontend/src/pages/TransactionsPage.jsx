import { useEffect } from 'react'
import { useTransactionStore } from '../stores/transactionStore'
import { useUIStore } from '../stores/uiStore'
import { TransactionTable } from '../components/transactions/TransactionTable'
import { TransactionFilters } from '../components/transactions/TransactionFilters'
import { EditTransactionModal } from '../components/transactions/EditTransactionModal'
import { Button } from '../components/ui/button'
import { Plus } from 'lucide-react'
import { MODALS } from '../constants'

export default function TransactionsPage() {
    const { activeDivision, openModal } = useUIStore()
    const {
        transactions,
        pagination,
        filters,
        fetchTransactions,
        setPage,
        isLoading
    } = useTransactionStore()

    // Fetch on mount or when dependencies change
    useEffect(() => {
        fetchTransactions('all', activeDivision)
    }, [fetchTransactions, activeDivision, filters, pagination.page])

    const handlePageChange = (page) => {
        setPage(page)
    }

    const handleEdit = (transaction) => {
        openModal(MODALS.EDIT_TRANSACTION, transaction)
    }

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
                    <p className="text-default-500">
                        Manage and view your financial history
                    </p>
                </div>
                <Button
                    onPress={() => openModal('addTransaction')}
                    className="shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
                    startContent={<Plus className="w-4 h-4" />}
                >
                    Add Transaction
                </Button>
            </div>

            <div className="space-y-4">
                <TransactionFilters />

                <TransactionTable
                    transactions={transactions}
                    isLoading={isLoading}
                    pagination={pagination}
                    onPageChange={handlePageChange}
                    onEdit={handleEdit}
                />
            </div>

            {/* Edit Transaction Modal */}
            <EditTransactionModal />
        </div>
    )
}
