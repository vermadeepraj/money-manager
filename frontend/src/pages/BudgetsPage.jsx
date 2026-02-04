import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, AlertTriangle, TrendingUp } from 'lucide-react'
import { useBudgetStore } from '../stores/budgetStore'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { FullPageLoader } from '../components/common'
import { AddBudgetModal } from '../components/budgets/AddBudgetModal'
import { cn } from '../lib/utils'
import { BUDGET_PERIODS, CURRENCY } from '../constants'
import { toast } from 'sonner'

export default function BudgetsPage() {
    const { 
        budgets, 
        isLoading, 
        error, 
        fetchBudgets, 
        deleteBudget,
        getBudgetUtilization,
        filters,
        setFilters
    } = useBudgetStore()
    
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingBudget, setEditingBudget] = useState(null)

    useEffect(() => {
        fetchBudgets()
    }, [fetchBudgets])

    const handleEdit = (budget) => {
        setEditingBudget(budget)
        setIsModalOpen(true)
    }

    const handleDelete = async (budget) => {
        if (window.confirm(`Delete budget for "${budget.categoryId?.name}"?`)) {
            const result = await deleteBudget(budget._id)
            if (result.success) {
                toast.success('Budget deleted')
            } else {
                toast.error(result.error || 'Failed to delete budget')
            }
        }
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setEditingBudget(null)
    }

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount)
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'exceeded': return 'text-expense'
            case 'warning': return 'text-amber-500'
            default: return 'text-income'
        }
    }

    const getProgressBarColor = (status) => {
        switch (status) {
            case 'exceeded': return 'bg-expense'
            case 'warning': return 'bg-amber-500'
            default: return 'bg-income'
        }
    }

    // Calculate totals
    const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0)
    const totalSpent = budgets.reduce((sum, b) => sum + (b.spent || 0), 0)
    const overBudgetCount = budgets.filter(b => b.status === 'exceeded').length
    const warningCount = budgets.filter(b => b.status === 'warning').length

    if (isLoading && budgets.length === 0) {
        return <FullPageLoader message="Loading budgets..." />
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Budgets</h1>
                    <p className="text-muted-foreground">Track your spending limits by category</p>
                </div>
                <Button onPress={() => setIsModalOpen(true)} startContent={<Plus className="w-4 h-4" />}>
                    Add Budget
                </Button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="glass-card">
                    <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">Total Budget</p>
                        <p className="text-2xl font-bold">{formatCurrency(totalBudget)}</p>
                    </CardContent>
                </Card>
                <Card className="glass-card">
                    <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">Total Spent</p>
                        <p className="text-2xl font-bold">{formatCurrency(totalSpent)}</p>
                    </CardContent>
                </Card>
                <Card className="glass-card">
                    <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">Remaining</p>
                        <p className={cn(
                            "text-2xl font-bold",
                            totalBudget - totalSpent < 0 ? 'text-expense' : 'text-income'
                        )}>
                            {formatCurrency(Math.max(0, totalBudget - totalSpent))}
                        </p>
                    </CardContent>
                </Card>
                <Card className="glass-card">
                    <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">Alerts</p>
                        <div className="flex items-center gap-2">
                            {overBudgetCount > 0 && (
                                <span className="text-expense text-sm font-medium">
                                    {overBudgetCount} exceeded
                                </span>
                            )}
                            {warningCount > 0 && (
                                <span className="text-amber-500 text-sm font-medium">
                                    {warningCount} warning
                                </span>
                            )}
                            {overBudgetCount === 0 && warningCount === 0 && (
                                <span className="text-income text-sm font-medium">All good!</span>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Period Filter */}
            <div className="flex gap-2">
                {[
                    { value: 'all', label: 'All' },
                    { value: 'weekly', label: 'Weekly' },
                    { value: 'monthly', label: 'Monthly' }
                ].map(period => (
                    <Button
                        key={period.value}
                        variant={filters.period === period.value ? 'default' : 'ghost'}
                        size="sm"
                        onPress={() => setFilters({ period: period.value })}
                    >
                        {period.label}
                    </Button>
                ))}
            </div>

            {/* Budget List */}
            {budgets.length === 0 ? (
                <Card className="glass-card">
                    <CardContent className="py-12 text-center">
                        <div className="w-16 h-16 rounded-full bg-[var(--glass-hover)] flex items-center justify-center mx-auto mb-4">
                            <TrendingUp className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-medium mb-2">No budgets yet</h3>
                        <p className="text-muted-foreground mb-4">
                            Create budgets to track your spending by category
                        </p>
                        <Button onPress={() => setIsModalOpen(true)} startContent={<Plus className="w-4 h-4" />}>
                            Create your first budget
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {budgets.map(budget => (
                        <Card key={budget._id} className="glass-card card-lift">
                            <CardContent className="p-5">
                                {/* Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{budget.categoryId?.emoji || '📊'}</span>
                                        <div>
                                            <h3 className="font-medium">{budget.categoryId?.name || 'Unknown'}</h3>
                                            <p className="text-sm text-muted-foreground capitalize">{budget.period}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => handleEdit(budget)}
                                            className="p-1.5 rounded hover:bg-[var(--glass-hover)] transition-colors"
                                        >
                                            <Pencil className="w-4 h-4 text-muted-foreground" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(budget)}
                                            className="p-1.5 rounded hover:bg-[var(--glass-hover)] transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4 text-muted-foreground" />
                                        </button>
                                    </div>
                                </div>

                                {/* Progress */}
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className={getStatusColor(budget.status)}>
                                            {formatCurrency(budget.spent || 0)} spent
                                        </span>
                                        <span className="text-muted-foreground">
                                            of {formatCurrency(budget.amount)}
                                        </span>
                                    </div>
                                    
                                    {/* Progress bar */}
                                    <div className="h-2 bg-[var(--glass-hover)] rounded-full overflow-hidden">
                                        <div 
                                            className={cn(
                                                "h-full transition-all duration-500",
                                                getProgressBarColor(budget.status)
                                            )}
                                            style={{ width: `${Math.min(budget.percentage || 0, 100)}%` }}
                                        />
                                    </div>

                                    {/* Stats */}
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">
                                            {budget.percentage?.toFixed(0) || 0}% used
                                        </span>
                                        {budget.status === 'exceeded' ? (
                                            <span className="text-expense flex items-center gap-1">
                                                <AlertTriangle className="w-3 h-3" />
                                                Over by {formatCurrency((budget.spent || 0) - budget.amount)}
                                            </span>
                                        ) : (
                                            <span className="text-muted-foreground">
                                                {formatCurrency(budget.remaining || 0)} left
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Add/Edit Modal */}
            <AddBudgetModal 
                isOpen={isModalOpen} 
                onClose={handleCloseModal}
                budgetToEdit={editingBudget}
            />
        </div>
    )
}
