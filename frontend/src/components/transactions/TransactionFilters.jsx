import { useState, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { useTransactionStore } from '../../stores/transactionStore'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Select, SelectItem } from '@heroui/react'
import { categoriesAPI } from '../../lib/api'
import { TRANSACTION_TYPE_OPTIONS, API_CONFIG } from '../../constants'

export function TransactionFilters() {
    const { filters, setFilters, resetFilters } = useTransactionStore()
    const [categories, setCategories] = useState([])

    // Local state for search to avoid excessive re-renders/fetches
    const [searchTerm, setSearchTerm] = useState(filters.search || '')

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const res = await categoriesAPI.getAll()
                setCategories(res.data.data.categories)
            } catch (err) {
                console.error("Failed to load categories", err)
            }
        }
        loadCategories()
    }, [])

    // Debounce search update to store
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (searchTerm !== filters.search) {
                setFilters({ search: searchTerm })
            }
        }, API_CONFIG.DEBOUNCE_MS)
        return () => clearTimeout(timeout)
    }, [searchTerm, filters.search, setFilters])

    const hasActiveFilters = filters.search || filters.type !== 'all' || filters.categoryId !== 'all'

    return (
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
                <Input
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    startContent={<Search className="h-4 w-4 text-muted-foreground" />}
                />
            </div>

            <div className="flex flex-wrap gap-2">
                <Select
                    aria-label="Transaction type filter"
                    placeholder="Type"
                    selectedKeys={filters.type ? [filters.type] : ['all']}
                    onSelectionChange={(keys) => {
                        const val = Array.from(keys)[0] || 'all'
                        setFilters({ type: val })
                    }}
                    className="w-[130px]"
                    variant="bordered"
                    size="sm"
                    classNames={{
                        trigger: "glass-input h-10",
                        value: "text-foreground",
                        popoverContent: "glass-dropdown",
                        listbox: "text-foreground",
                    }}
                >
                    {TRANSACTION_TYPE_OPTIONS.map(option => (
                        <SelectItem key={option.value} textValue={option.label}>
                            {option.label}
                        </SelectItem>
                    ))}
                </Select>

                <Select
                    aria-label="Category filter"
                    placeholder="Category"
                    selectedKeys={filters.categoryId ? [filters.categoryId] : ['all']}
                    onSelectionChange={(keys) => {
                        const val = Array.from(keys)[0] || 'all'
                        setFilters({ categoryId: val })
                    }}
                    className="w-[180px]"
                    variant="bordered"
                    size="sm"
                    classNames={{
                        trigger: "glass-input h-10",
                        value: "text-foreground",
                        popoverContent: "glass-dropdown",
                        listbox: "text-foreground",
                    }}
                >
                    <SelectItem key="all" textValue="All Categories">
                        All Categories
                    </SelectItem>
                    {categories.map((cat) => (
                        <SelectItem key={cat._id} textValue={cat.name}>
                            <span className="mr-2">{cat.emoji}</span>
                            {cat.name}
                        </SelectItem>
                    ))}
                </Select>

                {hasActiveFilters && (
                    <Button
                        variant="ghost"
                        onPress={() => {
                            setSearchTerm('')
                            resetFilters()
                        }}
                        className="px-2 lg:px-4"
                        startContent={<X className="h-4 w-4" />}
                    >
                        <span className="hidden lg:inline">Reset</span>
                    </Button>
                )}
            </div>
        </div>
    )
}
