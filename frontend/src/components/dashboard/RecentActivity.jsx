import { format } from 'date-fns';
import { formatCurrency } from '../../lib/utils';
import { Skeleton } from '../ui/skeleton';

export function RecentActivity({ transactions, isLoading }) {
    if (isLoading) {
        return (
            <div className="flex-1 space-y-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-[var(--glass-hover)] transition-colors cursor-pointer group">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-[var(--glass-hover)] flex items-center justify-center text-xl" />
                            <div>
                                <div className="h-4 w-32 bg-[var(--glass-hover)] rounded animate-pulse mb-2" />
                                <div className="h-3 w-20 bg-[var(--glass-hover)] rounded animate-pulse" />
                            </div>
                        </div>
                        <div className="h-4 w-16 bg-[var(--glass-hover)] rounded animate-pulse" />
                    </div>
                ))}
            </div>
        );
    }

    if (transactions.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground opacity-50">
                <p>No recent activity</p>
            </div>
        );
    }

    return (
        <div className="flex-1 space-y-1 overflow-y-auto pr-2 custom-scrollbar">
            {transactions.slice(0, 5).map((t) => (
                <div key={t._id} className="flex items-center justify-between p-3 rounded-xl hover:bg-[var(--glass-hover)] transition-all duration-200 cursor-pointer group border border-transparent hover:border-[var(--glass-border)]">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-xl group-hover:scale-110 transition-transform duration-300">
                            {/* Fallback if category or emoji is missing */}
                            {t.categoryId?.emoji || '💰'}
                        </div>
                        <div>
                            <p className="font-medium text-sm text-foreground group-hover:text-primary transition-colors truncate max-w-[150px]">
                                {t.description || t.categoryId?.name || 'Unknown Transaction'}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {format(new Date(t.date), 'MMM d, yyyy')}
                            </p>
                        </div>
                    </div>
                    <div className={`font-semibold text-sm ${t.type === 'income' ? 'text-income' : 'text-expense'}`}>
                        {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount)}
                    </div>
                </div>
            ))}
        </div>
    );
}
