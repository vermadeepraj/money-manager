import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useBudgetStore } from '../../stores/budgetStore'
import { categoriesAPI } from '../../lib/api'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from '../ui/modal'
import { Select, SelectItem } from '@heroui/react'
import { toast } from 'sonner'

const budgetSchema = z.object({
    categoryId: z.string().min(1, 'Category is required'),
    amount: z.string().min(1, 'Amount is required').refine(
        (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
        'Amount must be a positive number'
    ),
    period: z.enum(['weekly', 'monthly'])
})

export function AddBudgetModal({ isOpen, onClose, budgetToEdit = null }) {
    const { createBudget, updateBudget } = useBudgetStore()
    const [categories, setCategories] = useState([])
    const [isLoadingCategories, setIsLoadingCategories] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const {
        control,
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(budgetSchema),
        defaultValues: {
            categoryId: '',
            amount: '',
            period: 'monthly'
        }
    })

    // Load expense categories
    useEffect(() => {
        if (isOpen) {
            setIsLoadingCategories(true)
            categoriesAPI.getAll({ type: 'expense' })
                .then(res => {
                    // Filter only expense categories
                    const expenseCategories = (res.data.data.categories || [])
                        .filter(cat => cat.type === 'expense')
                    setCategories(expenseCategories)
                })
                .catch(console.error)
                .finally(() => setIsLoadingCategories(false))
        }
    }, [isOpen])

    // Populate form when editing
    useEffect(() => {
        if (isOpen && budgetToEdit) {
            setValue('categoryId', budgetToEdit.categoryId?._id || budgetToEdit.categoryId)
            setValue('amount', budgetToEdit.amount?.toString() || '')
            setValue('period', budgetToEdit.period || 'monthly')
        } else if (isOpen) {
            reset({
                categoryId: '',
                amount: '',
                period: 'monthly'
            })
        }
    }, [isOpen, budgetToEdit, setValue, reset])

    const onSubmit = async (data) => {
        setIsSubmitting(true)
        
        const budgetData = {
            categoryId: data.categoryId,
            amount: parseFloat(data.amount),
            period: data.period
        }

        let result
        if (budgetToEdit) {
            result = await updateBudget(budgetToEdit._id, budgetData)
        } else {
            result = await createBudget(budgetData)
        }

        setIsSubmitting(false)

        if (result.success) {
            toast.success(budgetToEdit ? 'Budget updated' : 'Budget created')
            onClose()
        } else {
            toast.error(result.error || 'Operation failed')
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="md">
            <ModalContent>
                <ModalHeader>
                    {budgetToEdit ? 'Edit Budget' : 'New Budget'}
                </ModalHeader>
                <ModalBody>
                    <form id="add-budget-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {/* Category Selection */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1.5">
                                Category
                            </label>
                            <Controller
                                name="categoryId"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        placeholder="Select expense category..."
                                        selectedKeys={field.value ? [field.value] : []}
                                        onSelectionChange={(keys) => {
                                            const val = Array.from(keys)[0]
                                            field.onChange(val || '')
                                        }}
                                        isDisabled={isLoadingCategories || !!budgetToEdit}
                                        isInvalid={!!errors.categoryId}
                                        errorMessage={errors.categoryId?.message}
                                        variant="bordered"
                                        classNames={{
                                            trigger: "glass-input",
                                            value: "text-foreground",
                                            popoverContent: "glass-dropdown",
                                        }}
                                    >
                                        {categories.map(cat => (
                                            <SelectItem key={cat._id} textValue={cat.name}>
                                                <span className="mr-2">{cat.emoji}</span>
                                                {cat.name}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                )}
                            />
                            {budgetToEdit && (
                                <p className="text-xs text-muted-foreground mt-1">
                                    Category cannot be changed when editing
                                </p>
                            )}
                        </div>

                        {/* Amount */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1.5">Budget Amount</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10">₹</span>
                                <Input
                                    type="number"
                                    step="100"
                                    min="0"
                                    placeholder="10000"
                                    classNames={{ input: "pl-6" }}
                                    {...register('amount')}
                                    error={errors.amount?.message}
                                />
                            </div>
                        </div>

                        {/* Period */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1.5">
                                Period
                            </label>
                            <Controller
                                name="period"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        selectedKeys={field.value ? [field.value] : []}
                                        onSelectionChange={(keys) => {
                                            const val = Array.from(keys)[0]
                                            field.onChange(val || 'monthly')
                                        }}
                                        variant="bordered"
                                        classNames={{
                                            trigger: "glass-input",
                                            value: "text-foreground",
                                            popoverContent: "glass-dropdown",
                                        }}
                                    >
                                        <SelectItem key="weekly" textValue="Weekly">
                                            Weekly
                                        </SelectItem>
                                        <SelectItem key="monthly" textValue="Monthly">
                                            Monthly
                                        </SelectItem>
                                    </Select>
                                )}
                            />
                        </div>
                    </form>
                </ModalBody>
                <ModalFooter>
                    <Button variant="ghost" onPress={onClose}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        form="add-budget-form"
                        isLoading={isSubmitting || isLoadingCategories}
                        isDisabled={isSubmitting || isLoadingCategories}
                    >
                        {isSubmitting ? 'Saving...' : (budgetToEdit ? 'Update Budget' : 'Create Budget')}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
