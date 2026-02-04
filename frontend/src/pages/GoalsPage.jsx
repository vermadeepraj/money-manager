import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Target, Calendar, TrendingUp, CheckCircle2, AlertCircle } from 'lucide-react'
import { useGoalStore } from '../stores/goalStore'
import { Card, CardContent } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { FullPageLoader } from '../components/common'
import { AddGoalModal } from '../components/goals/AddGoalModal'
import { ContributeModal } from '../components/goals/ContributeModal'
import { cn } from '../lib/utils'
import { toast } from 'sonner'

export default function GoalsPage() {
    const { 
        goals, 
        isLoading, 
        fetchGoals, 
        deleteGoal,
        getGoalProgress,
        isGoalCompleted,
        getDaysRemaining,
        isGoalOverdue
    } = useGoalStore()
    
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingGoal, setEditingGoal] = useState(null)
    const [contributingGoal, setContributingGoal] = useState(null)
    const [filter, setFilter] = useState('all') // all, active, completed

    useEffect(() => {
        fetchGoals()
    }, [fetchGoals])

    const handleEdit = (goal) => {
        setEditingGoal(goal)
        setIsModalOpen(true)
    }

    const handleDelete = async (goal) => {
        if (window.confirm(`Delete goal "${goal.name}"?`)) {
            const result = await deleteGoal(goal._id)
            if (result.success) {
                toast.success('Goal deleted')
            } else {
                toast.error(result.error || 'Failed to delete goal')
            }
        }
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setEditingGoal(null)
    }

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount)
    }

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        })
    }

    // Filter goals
    const filteredGoals = goals.filter(goal => {
        if (filter === 'active') return !isGoalCompleted(goal)
        if (filter === 'completed') return isGoalCompleted(goal)
        return true
    })

    // Stats
    const totalGoals = goals.length
    const completedGoals = goals.filter(g => isGoalCompleted(g)).length
    const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0)
    const totalSaved = goals.reduce((sum, g) => sum + (g.currentAmount || 0), 0)

    if (isLoading && goals.length === 0) {
        return <FullPageLoader message="Loading goals..." />
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Savings Goals</h1>
                    <p className="text-muted-foreground">Track your progress towards financial goals</p>
                </div>
                <Button onPress={() => setIsModalOpen(true)} startContent={<Plus className="w-4 h-4" />}>
                    Add Goal
                </Button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="glass-card">
                    <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">Total Goals</p>
                        <p className="text-2xl font-bold">{totalGoals}</p>
                    </CardContent>
                </Card>
                <Card className="glass-card">
                    <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">Completed</p>
                        <p className="text-2xl font-bold text-income">{completedGoals}</p>
                    </CardContent>
                </Card>
                <Card className="glass-card">
                    <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">Total Target</p>
                        <p className="text-2xl font-bold">{formatCurrency(totalTarget)}</p>
                    </CardContent>
                </Card>
                <Card className="glass-card">
                    <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">Total Saved</p>
                        <p className="text-2xl font-bold text-income">{formatCurrency(totalSaved)}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2">
                {[
                    { value: 'all', label: 'All Goals' },
                    { value: 'active', label: 'Active' },
                    { value: 'completed', label: 'Completed' }
                ].map(tab => (
                    <Button
                        key={tab.value}
                        variant={filter === tab.value ? 'default' : 'ghost'}
                        size="sm"
                        onPress={() => setFilter(tab.value)}
                    >
                        {tab.label}
                    </Button>
                ))}
            </div>

            {/* Goals List */}
            {filteredGoals.length === 0 ? (
                <Card className="glass-card">
                    <CardContent className="py-12 text-center">
                        <div className="w-16 h-16 rounded-full bg-[var(--glass-hover)] flex items-center justify-center mx-auto mb-4">
                            <Target className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-medium mb-2">
                            {filter === 'all' ? 'No goals yet' : `No ${filter} goals`}
                        </h3>
                        <p className="text-muted-foreground mb-4">
                            {filter === 'all' 
                                ? 'Create savings goals to track your financial progress'
                                : `You don't have any ${filter} goals at the moment`
                            }
                        </p>
                        {filter === 'all' && (
                            <Button onPress={() => setIsModalOpen(true)} startContent={<Plus className="w-4 h-4" />}>
                                Create your first goal
                            </Button>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredGoals.map(goal => {
                        const progress = getGoalProgress(goal)
                        const completed = isGoalCompleted(goal)
                        const overdue = isGoalOverdue(goal)
                        const daysLeft = getDaysRemaining(goal)
                        const remaining = Math.max(0, goal.targetAmount - (goal.currentAmount || 0))

                        return (
                            <Card 
                                key={goal._id} 
                                className={cn(
                                    "glass-card card-lift",
                                    completed && "border-income/30"
                                )}
                            >
                                <CardContent className="p-5">
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                "w-10 h-10 rounded-full flex items-center justify-center",
                                                completed ? "bg-income/20" : "bg-violet-500/20"
                                            )}>
                                                {completed ? (
                                                    <CheckCircle2 className="w-5 h-5 text-income" />
                                                ) : (
                                                    <Target className="w-5 h-5 text-violet-500" />
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="font-medium">{goal.name}</h3>
                                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                    <Calendar className="w-3 h-3" />
                                                    <span>{formatDate(goal.targetDate)}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-1">
                                            <button
                                                onClick={() => handleEdit(goal)}
                                                className="p-1.5 rounded hover:bg-[var(--glass-hover)] transition-colors"
                                            >
                                                <Pencil className="w-4 h-4 text-muted-foreground" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(goal)}
                                                className="p-1.5 rounded hover:bg-[var(--glass-hover)] transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4 text-muted-foreground" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Progress */}
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span className={completed ? 'text-income' : 'text-foreground'}>
                                                {formatCurrency(goal.currentAmount || 0)}
                                            </span>
                                            <span className="text-muted-foreground">
                                                of {formatCurrency(goal.targetAmount)}
                                            </span>
                                        </div>
                                        
                                        {/* Progress bar */}
                                        <div className="h-2 bg-[var(--glass-hover)] rounded-full overflow-hidden">
                                            <div 
                                                className={cn(
                                                    "h-full transition-all duration-500",
                                                    completed ? "bg-income" : "bg-violet-500"
                                                )}
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>

                                        {/* Stats */}
                                        <div className="flex justify-between items-center text-sm">
                                            <span className={cn(
                                                completed ? 'text-income' : 'text-muted-foreground'
                                            )}>
                                                {progress.toFixed(0)}% complete
                                            </span>
                                            {!completed && (
                                                <span className={cn(
                                                    overdue ? 'text-expense' : 'text-muted-foreground',
                                                    "flex items-center gap-1"
                                                )}>
                                                    {overdue ? (
                                                        <>
                                                            <AlertCircle className="w-3 h-3" />
                                                            Overdue
                                                        </>
                                                    ) : (
                                                        `${daysLeft} days left`
                                                    )}
                                                </span>
                                            )}
                                        </div>

                                        {/* Add Money Button */}
                                        {!completed && (
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                className="w-full mt-2"
                                                onPress={() => setContributingGoal(goal)}
                                                startContent={<TrendingUp className="w-4 h-4" />}
                                            >
                                                Add Money ({formatCurrency(remaining)} left)
                                            </Button>
                                        )}

                                        {completed && (
                                            <div className="text-center py-2 text-income text-sm font-medium">
                                                Goal Achieved!
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            )}

            {/* Add/Edit Modal */}
            <AddGoalModal 
                isOpen={isModalOpen} 
                onClose={handleCloseModal}
                goalToEdit={editingGoal}
            />

            {/* Contribute Modal */}
            <ContributeModal
                isOpen={!!contributingGoal}
                onClose={() => setContributingGoal(null)}
                goal={contributingGoal}
            />
        </div>
    )
}
