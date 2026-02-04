import { useEffect, useState } from 'react'
import { Plus, Trash2, Edit2, FolderOpen } from 'lucide-react'
import { Tabs, Tab } from '@heroui/react'
import { useCategoryStore } from '../stores/categoryStore'
import { Card, CardContent } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Skeleton } from '../components/ui/skeleton'
import { Tooltip } from '../components/ui/tooltip'
import { AddCategoryModal } from '../components/categories/AddCategoryModal'
import { cn } from '../lib/utils'
import { toast } from 'sonner'

export default function CategoriesPage() {
    const { categories, fetchCategories, deleteCategory, isLoading } = useCategoryStore()
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [activeTab, setActiveTab] = useState('expense')
    const [categoryToEdit, setCategoryToEdit] = useState(null)

    useEffect(() => {
        fetchCategories()
    }, [fetchCategories])

    const handleEdit = (category) => {
        setCategoryToEdit(category)
        setIsAddModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsAddModalOpen(false)
        setCategoryToEdit(null)
    }

    const handleDelete = async (id, name) => {
        if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
            const res = await deleteCategory(id)
            if (res.success) {
                toast.success("Category deleted")
            } else {
                toast.error("Failed to delete category")
            }
        }
    }

    const filteredCategories = categories.filter(c => c.type === activeTab)
    const expenseCount = categories.filter(c => c.type === 'expense').length
    const incomeCount = categories.filter(c => c.type === 'income').length

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
                    <p className="text-muted-foreground">
                        Organize your financial tracking
                    </p>
                </div>
                <Button
                    onPress={() => {
                        setCategoryToEdit(null)
                        setIsAddModalOpen(true)
                    }}
                    className="shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
                    startContent={<Plus className="w-4 h-4" />}
                >
                    Add Category
                </Button>
            </div>

            {/* Tabs */}
            <Tabs 
                selectedKey={activeTab} 
                onSelectionChange={setActiveTab}
                variant="solid"
                color="primary"
                classNames={{
                    base: "w-fit",
                    tabList: "gap-2 p-1 glass-card rounded-xl",
                    cursor: "bg-primary rounded-lg",
                    tab: "px-6 py-2 font-medium text-muted-foreground data-[selected=true]:text-white rounded-lg",
                    tabContent: "group-data-[selected=true]:text-white",
                }}
            >
                <Tab 
                    key="expense" 
                    title={
                        <div className="flex items-center gap-2">
                            <span>Expense</span>
                            <span className="px-2 py-0.5 text-xs rounded-full bg-[var(--glass-hover)]">
                                {expenseCount}
                            </span>
                        </div>
                    }
                />
                <Tab 
                    key="income" 
                    title={
                        <div className="flex items-center gap-2">
                            <span>Income</span>
                            <span className="px-2 py-0.5 text-xs rounded-full bg-[var(--glass-hover)]">
                                {incomeCount}
                            </span>
                        </div>
                    }
                />
            </Tabs>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {isLoading ? (
                    // Loading Skeletons
                    Array.from({ length: 8 }).map((_, i) => (
                        <Card key={i} className="glass-card">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <Skeleton className="w-12 h-12 rounded-xl" />
                                    <div className="flex gap-2">
                                        <Skeleton className="w-7 h-7 rounded-full" />
                                        <Skeleton className="w-7 h-7 rounded-full" />
                                    </div>
                                </div>
                                <Skeleton className="h-6 w-24 mt-4" />
                                <Skeleton className="h-4 w-16 mt-2" />
                            </CardContent>
                        </Card>
                    ))
                ) : filteredCategories.length > 0 ? (
                    filteredCategories.map((category) => (
                        <Card
                            key={category._id}
                            className="group glass-card card-lift"
                        >
                            <CardContent className="p-6 relative overflow-hidden">
                                <div className="flex items-start justify-between">
                                    <span className="text-4xl">{category.emoji || '📁'}</span>
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                        <Tooltip content="Edit category">
                                            <button
                                                onClick={() => handleEdit(category)}
                                                className="p-2 rounded-full hover:bg-[var(--glass-hover)] text-muted-foreground hover:text-foreground transition-colors"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                        </Tooltip>
                                        <Tooltip content="Delete category">
                                            <button
                                                onClick={() => handleDelete(category._id, category.name)}
                                                className="p-2 rounded-full hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </Tooltip>
                                    </div>
                                </div>
                                <h3 className="mt-4 font-semibold text-lg">{category.name}</h3>
                                <p className="text-xs text-muted-foreground mt-1 capitalize">{category.type}</p>

                                {/* Decorative background blob */}
                                <div className={cn(
                                    "absolute -right-4 -bottom-4 w-20 h-20 rounded-full blur-2xl transition-all",
                                    category.type === 'expense' 
                                        ? "bg-expense/5 group-hover:bg-expense/10"
                                        : "bg-income/5 group-hover:bg-income/10"
                                )} />
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Card className="col-span-full glass-card">
                        <CardContent className="py-12 text-center">
                            <div className="w-16 h-16 rounded-full bg-[var(--glass-hover)] flex items-center justify-center mx-auto mb-4">
                                <FolderOpen className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-medium mb-2">No {activeTab} categories found</h3>
                            <p className="text-muted-foreground mb-4">
                                Create categories to organize your transactions
                            </p>
                            <Button 
                                onPress={() => {
                                    setCategoryToEdit(null)
                                    setIsAddModalOpen(true)
                                }}
                                startContent={<Plus className="w-4 h-4" />}
                            >
                                Create your first category
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>

            <AddCategoryModal
                isOpen={isAddModalOpen}
                onClose={handleCloseModal}
                categoryToEdit={categoryToEdit}
            />
        </div>
    )
}
