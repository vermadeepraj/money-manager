import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Wallet,
    TrendingUp,
    Plus,
    CreditCard,
    DollarSign,
    Activity
} from 'lucide-react'
import { Chip, Tabs, Tab, Select, SelectItem } from '@heroui/react'
import { useUIStore } from '../stores/uiStore'
import { useTransactionStore } from '../stores/transactionStore'
import { useAuthStore } from '../stores/authStore'
import { formatCurrency, getGreeting } from '../lib/utils'
import { Card, CardContent } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Skeleton } from '../components/ui/skeleton'
import { cn } from '../lib/utils'
import { IncomeExpenseChart } from '../components/dashboard/IncomeExpenseChart'
import { RecentActivity } from '../components/dashboard/RecentActivity'

function SummaryCard({ title, value, icon: Icon, iconColor, trend, trendLabel, isLoading }) {
    const getTrendColor = () => {
        if (trend === 0 || trend === undefined) return 'default'
        return trend > 0 ? 'success' : 'danger'
    }

    return (
        <Card className="glass-card card-lift relative overflow-hidden group">
            <CardContent className="p-6">
                <div className="relative z-10 flex items-start justify-between">
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">{title}</p>

                        {isLoading ? (
                            <Skeleton className="h-9 w-32 bg-[var(--glass-hover)]" />
                        ) : (
                            <h3 className="text-3xl font-bold tabular-nums tracking-tight">
                                {title === "Savings Rate" ? `${value}%` : formatCurrency(value)}
                            </h3>
                        )}

                        {trend !== undefined && (
                            <div className="flex items-center gap-2 mt-1">
                                {isLoading ? (
                                    <Skeleton className="h-5 w-24 bg-[var(--glass-hover)]" />
                                ) : (
                                    <>
                                        <Chip
                                            size="sm"
                                            variant="flat"
                                            color={getTrendColor()}
                                            startContent={
                                                <TrendingUp
                                                    className={cn(
                                                        "w-3 h-3",
                                                        trend < 0 && "rotate-180"
                                                    )}
                                                />
                                            }
                                        >
                                            {Math.abs(trend)}%
                                        </Chip>
                                        <span className="text-xs text-muted-foreground">
                                            {trendLabel || "vs last period"}
                                        </span>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    <div className={cn(
                        "p-3 rounded-xl transition-colors duration-300",
                        "bg-[var(--glass-hover)] border border-[var(--glass-border)] group-hover:bg-[var(--glass-input-bg)]",
                        iconColor
                    )}>
                        <Icon className="w-6 h-6" />
                    </div>
                </div>

                {/* Decorative gradient blob */}
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-accent/10 rounded-full blur-2xl group-hover:bg-accent/20 transition-all duration-500" />
            </CardContent>
        </Card>
    )
}

function PeriodSelector() {
    const { activePeriod, setPeriod } = useUIStore()

    return (
        <Tabs
            selectedKey={activePeriod}
            onSelectionChange={setPeriod}
            size="sm"
            variant="solid"
            classNames={{
                base: "",
                tabList: "gap-1 p-1 glass-card rounded-xl",
                cursor: "bg-primary rounded-lg",
                tab: "px-4 py-1.5 text-sm font-medium text-muted-foreground data-[selected=true]:text-white rounded-lg",
                tabContent: "group-data-[selected=true]:text-white",
            }}
        >
            <Tab key="week" title="Week" />
            <Tab key="month" title="Month" />
            <Tab key="year" title="Year" />
        </Tabs>
    )
}

function DivisionSelector() {
    const { activeDivision, setDivision } = useUIStore()

    return (
        <Tabs
            selectedKey={activeDivision}
            onSelectionChange={setDivision}
            size="sm"
            variant="solid"
            classNames={{
                base: "",
                tabList: "gap-1 p-1 glass-card rounded-xl",
                cursor: "bg-primary rounded-lg",
                tab: "px-4 py-1.5 text-sm font-medium text-muted-foreground data-[selected=true]:text-white rounded-lg",
                tabContent: "group-data-[selected=true]:text-white",
            }}
        >
            <Tab key="personal" title="Personal" />
            <Tab key="office" title="Office" />
        </Tabs>
    )
}

export function DashboardPage() {
    const navigate = useNavigate()
    const { user } = useAuthStore()
    const { activePeriod, activeDivision, openModal } = useUIStore()
    const { summary, transactions, trends, fetchSummary, fetchTransactions, fetchTrends, isLoading } = useTransactionStore()
    const [chartType, setChartType] = useState('bar')

    useEffect(() => {
        fetchSummary(activePeriod, activeDivision)
        fetchTransactions(activePeriod, activeDivision)
        fetchTrends(activePeriod)
    }, [fetchSummary, fetchTransactions, fetchTrends, activePeriod, activeDivision])

    // Derived savings rate
    const savingsRate = summary.income > 0
        ? Math.round(((summary.income - summary.expense) / summary.income) * 100)
        : 0

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        {getGreeting()},{' '}
                        <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                            {user?.name?.split(' ')[0]}
                        </span>
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Here's your financial overview for this {activePeriod}.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 items-end sm:items-center">
                    <DivisionSelector />
                    <PeriodSelector />
                    <Button
                        onPress={() => openModal('addTransaction')}
                        className="shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
                        startContent={<Plus className="w-4 h-4" />}
                    >
                        Add Transaction
                    </Button>
                </div>
            </div>

            {/* Summary Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <SummaryCard
                    title="Total Balance"
                    value={summary.balance || 0}
                    icon={Wallet}
                    iconColor="text-blue-400"
                    trend={0}
                    isLoading={isLoading}
                />
                <SummaryCard
                    title="Total Income"
                    value={summary.income || 0}
                    icon={DollarSign}
                    iconColor="text-income"
                    trend={summary.trends?.income || 0}
                    isLoading={isLoading}
                />
                <SummaryCard
                    title="Total Expense"
                    value={summary.expense || 0}
                    icon={CreditCard}
                    iconColor="text-expense"
                    trend={summary.trends?.expense || 0}
                    isLoading={isLoading}
                />
                <SummaryCard
                    title="Savings Rate"
                    value={savingsRate}
                    icon={Activity}
                    iconColor="text-amber-400"
                    trend={0}
                    isLoading={isLoading}
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="glass-panel h-[400px]">
                    <CardContent className="p-6 h-full flex flex-col">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <h3 className="text-lg font-semibold">Income vs Expense</h3>
                                <div className="w-32">
                                    <Select
                                        size="sm"
                                        placeholder="Chart Type"
                                        selectedKeys={[chartType]}
                                        onChange={(e) => setChartType(e.target.value)}
                                        aria-label="Chart Type"
                                        classNames={{
                                            trigger: "h-8 min-h-0 bg-default-100",
                                            value: "text-xs",
                                        }}
                                    >
                                        <SelectItem key="bar" value="bar">Bar Chart</SelectItem>
                                        <SelectItem key="line" value="line">Line Chart</SelectItem>
                                        <SelectItem key="area" value="area">Area Chart</SelectItem>
                                        <SelectItem key="bubble" value="bubble">Bubble Chart</SelectItem>
                                    </Select>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs"
                                onPress={() => navigate('/app/transactions')}
                            >
                                View Report
                            </Button>
                        </div>
                        <div className="flex-1">
                            <IncomeExpenseChart chartType={chartType} />
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass-panel h-[400px]">
                    <CardContent className="p-6 h-full flex flex-col">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold">Recent Activity</h3>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs"
                                onPress={() => navigate('/app/transactions')}
                            >
                                View All
                            </Button>
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <RecentActivity transactions={transactions} isLoading={isLoading} />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
