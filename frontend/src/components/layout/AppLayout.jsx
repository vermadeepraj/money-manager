import { Outlet, NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Receipt,
    FolderOpen,
    PiggyBank,
    Wallet,
    Target,
    Menu,
    ChevronLeft,
    Moon,
    Sun,
} from 'lucide-react';
import { Select, SelectItem } from '@heroui/react';
import { useUIStore } from '../../stores/uiStore';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { ProfileDropdown } from '../profile';
import { Logo } from '../brand';

const navItems = [
    { path: '/app/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/app/transactions', icon: Receipt, label: 'Transactions' },
    { path: '/app/categories', icon: FolderOpen, label: 'Categories' },
    { path: '/app/budgets', icon: PiggyBank, label: 'Budgets' },
    { path: '/app/accounts', icon: Wallet, label: 'Accounts' },
    { path: '/app/goals', icon: Target, label: 'Goals' },
];

export function AppLayout() {
    const {
        theme, toggleTheme,
        sidebarCollapsed, toggleSidebarCollapse,
        sidebarOpen, setSidebarOpen,
        activeDivision, setDivision
    } = useUIStore();

    return (
        <div className="flex min-h-screen">
            {/* Sidebar Overlay (Mobile) */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed lg:static inset-y-0 left-0 z-50",
                    "flex flex-col glass-sidebar transition-all duration-300 ease-out",
                    sidebarCollapsed ? "w-20" : "w-64",
                    sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                )}
            >
                {/* Logo */}
                <div className={cn(
                    "flex items-center h-20 px-6 border-b border-[var(--glass-border)]",
                    sidebarCollapsed && "justify-center px-0"
                )}>
                    {!sidebarCollapsed ? (
                        <Logo linkToHome size="md" />
                    ) : (
                        <Logo linkToHome size="sm" variant="icon" />
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-6 px-3 space-y-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                cn(
                                    "flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                                    isActive
                                        ? "bg-primary/15 text-primary shadow-[0_0_15px_rgba(99,102,241,0.15)]"
                                        : "text-muted-foreground hover:text-foreground hover:bg-[var(--glass-hover)]",
                                    sidebarCollapsed && "justify-center px-0"
                                )
                            }
                            title={sidebarCollapsed ? item.label : undefined}
                            onClick={() => setSidebarOpen(false)} // Close on mobile select
                        >
                            <item.icon className="w-5 h-5 transition-colors" />
                            {!sidebarCollapsed && <span>{item.label}</span>}
                        </NavLink>
                    ))}
                </nav>

                {/* Bottom Actions - Theme Toggle Only */}
                <div className={cn(
                    "p-4 border-t border-[var(--glass-border)]",
                    sidebarCollapsed && "flex flex-col items-center"
                )}>
                    <Button
                        variant="ghost"
                        size={sidebarCollapsed ? "icon" : "default"}
                        onClick={toggleTheme}
                        className={cn(
                            "w-full justify-start text-muted-foreground hover:text-foreground hover:bg-[var(--glass-hover)]",
                            sidebarCollapsed && "w-10 justify-center"
                        )}
                    >
                        {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        {!sidebarCollapsed && <span className="ml-3 font-normal">{theme === 'dark' ? 'Light' : 'Dark'} Mode</span>}
                    </Button>
                </div>

                {/* Collapse Toggle (Desktop) */}
                <button
                    onClick={toggleSidebarCollapse}
                    className="hidden lg:flex absolute -right-3 top-24 w-6 h-6 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-full items-center justify-center hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors shadow-lg"
                >
                    <ChevronLeft className={cn("w-3 h-3 transition-transform duration-300", sidebarCollapsed && "rotate-180")} />
                </button>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen transition-all duration-300">
                {/* Top Header - Glass effect */}
                <header className="h-20 flex items-center justify-between px-8 border-b border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-xl sticky top-0 z-30">
                    {/* Mobile Menu Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden -ml-2 text-muted-foreground"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu className="w-6 h-6" />
                    </Button>

                    {/* Page Title (derived from path for mobile simplicity or breadcrumb) */}
                    <div className="hidden sm:block">
                        {/* Could put breadcrumbs here */}
                    </div>

                    {/* Division Switcher */}
                    <div className="flex items-center gap-4 ml-auto mr-4">
                        <Select
                            selectedKeys={[activeDivision]}
                            onSelectionChange={(keys) => {
                                const val = Array.from(keys)[0];
                                if (val) setDivision(val);
                            }}
                            className="w-32"
                            size="sm"
                            variant="flat"
                            classNames={{
                                trigger: "bg-white/5 border border-white/10 hover:bg-white/10 transition-colors",
                                value: "text-small font-medium",
                            }}
                        >
                            <SelectItem key="personal" startContent={<span className="text-lg">👤</span>}>
                                Personal
                            </SelectItem>
                            <SelectItem key="office" startContent={<span className="text-lg">🏢</span>}>
                                Office
                            </SelectItem>
                        </Select>
                    </div>

                    {/* User Profile Dropdown */}
                    <div>
                        <ProfileDropdown />
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-6 lg:p-8 overflow-auto animate-in fade-in">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
