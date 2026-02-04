import { useEffect, useState } from 'react'
import { Plus, Trash2, Edit2, Landmark, Banknote, Wallet, CreditCard } from 'lucide-react'
import { useAccountStore } from '../stores/accountStore'
import { Card, CardContent } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Skeleton } from '../components/ui/skeleton'
import { Tooltip } from '../components/ui/tooltip'
import { AddAccountModal } from '../components/accounts/AddAccountModal'
import { cn, formatCurrency } from '../lib/utils'
import { toast } from 'sonner'

export default function AccountsPage() {
    const { accounts, fetchAccounts, deleteAccount, isLoading } = useAccountStore()
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [accountToEdit, setAccountToEdit] = useState(null)

    useEffect(() => {
        fetchAccounts()
    }, [fetchAccounts])

    const handleEdit = (account) => {
        setAccountToEdit(account)
        setIsAddModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsAddModalOpen(false)
        setAccountToEdit(null)
    }

    const handleDelete = async (id, name) => {
        if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
            const res = await deleteAccount(id)
            if (res.success) {
                toast.success("Account deleted")
            } else {
                toast.error("Failed to delete account")
            }
        }
    }

    const getIcon = (type) => {
        switch (type) {
            case 'bank': return Landmark
            case 'cash': return Banknote
            case 'wallet': return Wallet
            default: return CreditCard
        }
    }

    const getIconColor = (type) => {
        switch (type) {
            case 'bank': return 'text-blue-400 bg-blue-500/10 group-hover:bg-blue-500/20'
            case 'cash': return 'text-emerald-400 bg-emerald-500/10 group-hover:bg-emerald-500/20'
            case 'wallet': return 'text-violet-400 bg-violet-500/10 group-hover:bg-violet-500/20'
            default: return 'text-amber-400 bg-amber-500/10 group-hover:bg-amber-500/20'
        }
    }

    // Calculate total balance
    const totalBalance = accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0)

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Accounts</h1>
                    <p className="text-muted-foreground">
                        Manage your bank accounts and wallets
                    </p>
                </div>
                <Button
                    onPress={() => {
                        setAccountToEdit(null)
                        setIsAddModalOpen(true)
                    }}
                    className="shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
                    startContent={<Plus className="w-4 h-4" />}
                >
                    Add Account
                </Button>
            </div>

            {/* Summary Card */}
            <Card className="glass-card bg-gradient-to-br from-primary/10 to-violet-500/10">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Total Balance</p>
                            <p className="text-3xl font-bold mt-1">{formatCurrency(totalBalance)}</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-[var(--glass-hover)]">
                            <Wallet className="w-8 h-8 text-primary" />
                        </div>
                    </div>
                    <div className="mt-4 flex gap-4 text-sm">
                        <span className="text-muted-foreground">
                            <span className="text-foreground font-medium">{accounts.length}</span> accounts
                        </span>
                    </div>
                </CardContent>
            </Card>

            {/* Accounts Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    // Loading Skeletons
                    Array.from({ length: 3 }).map((_, i) => (
                        <Card key={i} className="glass-card">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <Skeleton className="w-12 h-12 rounded-xl" />
                                    <div className="flex gap-2">
                                        <Skeleton className="w-8 h-8 rounded-full" />
                                        <Skeleton className="w-8 h-8 rounded-full" />
                                    </div>
                                </div>
                                <Skeleton className="h-4 w-16 mb-2" />
                                <Skeleton className="h-6 w-32 mb-4" />
                                <Skeleton className="h-8 w-24" />
                            </CardContent>
                        </Card>
                    ))
                ) : accounts.length > 0 ? (
                    accounts.map((account) => {
                        const Icon = getIcon(account.type)
                        const iconColor = getIconColor(account.type)
                        return (
                            <Card
                                key={account._id}
                                className="group glass-card card-lift"
                            >
                                <CardContent className="p-6 relative overflow-hidden">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={cn("p-3 rounded-xl transition-colors", iconColor)}>
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                            <Tooltip content="Edit account">
                                                <button
                                                    onClick={() => handleEdit(account)}
                                                    className="p-2 rounded-full hover:bg-[var(--glass-hover)] text-muted-foreground hover:text-foreground transition-colors"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                            </Tooltip>
                                            <Tooltip content="Delete account">
                                                <button
                                                    onClick={() => handleDelete(account._id, account.name)}
                                                    className="p-2 rounded-full hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </Tooltip>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-sm text-muted-foreground capitalize">{account.type}</p>
                                        <h3 className="font-semibold text-lg">{account.name}</h3>
                                        <p className="text-2xl font-bold mt-2 text-foreground tabular-nums">
                                            {formatCurrency(account.balance)}
                                        </p>
                                    </div>

                                    {/* Decorative background blob */}
                                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-[var(--glass-hover)] rounded-full blur-2xl group-hover:bg-[var(--glass-input-bg)] transition-all" />
                                </CardContent>
                            </Card>
                        )
                    })
                ) : (
                    <Card className="col-span-full glass-card">
                        <CardContent className="py-12 text-center">
                            <div className="w-16 h-16 rounded-full bg-[var(--glass-hover)] flex items-center justify-center mx-auto mb-4">
                                <Wallet className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-medium mb-2">No accounts found</h3>
                            <p className="text-muted-foreground mb-4">
                                Add your first account to start tracking your finances
                            </p>
                            <Button 
                                onPress={() => {
                                    setAccountToEdit(null)
                                    setIsAddModalOpen(true)
                                }}
                                startContent={<Plus className="w-4 h-4" />}
                            >
                                Create your first account
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>

            <AddAccountModal
                isOpen={isAddModalOpen}
                onClose={handleCloseModal}
                accountToEdit={accountToEdit}
            />
        </div>
    )
}
