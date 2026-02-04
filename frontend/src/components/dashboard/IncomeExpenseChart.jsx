import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    CartesianGrid,
    LineChart,
    Line,
    AreaChart,
    Area,
    ScatterChart,
    Scatter,
    ZAxis
} from 'recharts';
import { useTransactionStore } from '../../stores/transactionStore';
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';

const formatCurrencyCompact = (value) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        notation: 'compact',
        maximumFractionDigits: 1
    }).format(value);
};

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        // For Scatter/Bubble chart, the payload structure might be slightly different
        // but typically it's normalized by Recharts
        const dateLabel = payload[0]?.payload?.date || label;

        return (
            <div className="glass-card p-3 shadow-xl">
                <p className="text-foreground text-sm font-medium mb-2">
                    {dateLabel ? format(new Date(dateLabel), 'MMM d, yyyy') : ''}
                </p>
                {payload.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs">
                        <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: entry.color || entry.fill }}
                        />
                        <span className="text-muted-foreground capitalize">{entry.name}:</span>
                        <span className="text-foreground font-medium">
                            {formatCurrencyCompact(entry.value)}
                        </span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

export function IncomeExpenseChart({ chartType = 'bar' }) {
    const { trends } = useTransactionStore();

    if (!trends || trends.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center h-full text-muted-foreground opacity-50">
                <p>No chart data available</p>
                <p className="text-xs">Add transactions to see trends</p>
            </div>
        );
    }

    // Common axis components to reuse
    const commonAxisProps = {
        stroke: "currentColor",
        className: "text-muted-foreground",
        fontSize: 12,
        tickLine: false,
        axisLine: false,
    };

    const renderChart = () => {
        const commonGrid = <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" vertical={false} />;
        const commonXAxis = (
            <XAxis
                dataKey="date"
                {...commonAxisProps}
                tickFormatter={(str) => format(new Date(str), 'MMM d')}
                dy={10}
            />
        );
        const commonYAxis = (
            <YAxis
                {...commonAxisProps}
                tickFormatter={formatCurrencyCompact}
                width={45}
            />
        );
        const commonTooltip = <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--glass-hover)' }} />;
        const commonLegend = <Legend wrapperStyle={{ paddingTop: '20px' }} />;

        switch (chartType) {
            case 'line':
                return (
                    <LineChart data={trends} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                        {commonGrid}
                        {commonXAxis}
                        {commonYAxis}
                        {commonTooltip}
                        {commonLegend}
                        <Line type="monotone" dataKey="income" name="Income" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                        <Line type="monotone" dataKey="expense" name="Expense" stroke="#F97316" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    </LineChart>
                );
            case 'area':
                return (
                    <AreaChart data={trends} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#F97316" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        {commonGrid}
                        {commonXAxis}
                        {commonYAxis}
                        {commonTooltip}
                        {commonLegend}
                        <Area type="monotone" dataKey="income" name="Income" stroke="#3B82F6" fillOpacity={1} fill="url(#colorIncome)" />
                        <Area type="monotone" dataKey="expense" name="Expense" stroke="#F97316" fillOpacity={1} fill="url(#colorExpense)" />
                    </AreaChart>
                );
            case 'bubble':
                // For bubble chart, we need to transform data slightly if we want true bubbles
                // But simple approach: Plot income and expense as two scatter series
                // Note: XAxis needs to be 'category' or number for Scatter. Here trends.date is string. 
                // We'll trust Recharts to handle categorical XAxis if type="category" is set or if allowDuplicatedCategory={false}
                return (
                    <ScatterChart margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                        {commonGrid}
                        <XAxis
                            dataKey="date"
                            {...commonAxisProps}
                            tickFormatter={(str) => format(new Date(str), 'MMM d')}
                            dy={10}
                            allowDuplicatedCategory={false}
                        />
                        {commonYAxis}
                        <ZAxis type="number" range={[50, 400]} />
                        {commonTooltip}
                        {commonLegend}
                        <Scatter name="Income" data={trends} fill="#3B82F6" line={false} shape="circle" dataKey="income" />
                        <Scatter name="Expense" data={trends} fill="#F97316" line={false} shape="circle" dataKey="expense" />
                    </ScatterChart>
                );
            case 'bar':
            default:
                return (
                    <BarChart data={trends} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                        {commonGrid}
                        {commonXAxis}
                        {commonYAxis}
                        {commonTooltip}
                        {commonLegend}
                        <Bar dataKey="income" name="Income" fill="#3B82F6" radius={[4, 4, 0, 0]} maxBarSize={40} />
                        <Bar dataKey="expense" name="Expense" fill="#F97316" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    </BarChart>
                );
        }
    };

    return (
        <div className="flex-1 w-full h-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
                {renderChart()}
            </ResponsiveContainer>
        </div>
    );
}
