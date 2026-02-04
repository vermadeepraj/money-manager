import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCategoryStore } from '../../stores/categoryStore'
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
import { DIVISIONS, DIVISION_OPTIONS } from '../../constants'

const schema = z.object({
    name: z.string().min(1, "Name is required"),
    emoji: z.string().default('📁'),
    type: z.enum(["income", "expense"]),
    division: z.enum([DIVISIONS.PERSONAL, DIVISIONS.OFFICE]),
})

export function AddCategoryModal({ isOpen, onClose, categoryToEdit = null }) {
    const { createCategory, updateCategory } = useCategoryStore()
    const { control, register, handleSubmit, formState: { errors, isSubmitting }, reset, setValue } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            name: '',
            emoji: '📁',
            type: 'expense',
            division: DIVISIONS.PERSONAL
        }
    })

    useEffect(() => {
        if (isOpen) {
            if (categoryToEdit) {
                setValue('name', categoryToEdit.name)
                setValue('emoji', categoryToEdit.emoji)
                setValue('type', categoryToEdit.type)
                setValue('division', categoryToEdit.division || DIVISIONS.PERSONAL)
            } else {
                reset({
                    name: '',
                    emoji: '📁',
                    type: 'expense',
                    division: DIVISIONS.PERSONAL
                })
            }
        }
    }, [isOpen, categoryToEdit, reset, setValue])

    const onSubmit = async (data) => {
        let res
        if (categoryToEdit) {
            res = await updateCategory(categoryToEdit._id, data)
        } else {
            res = await createCategory(data)
        }

        if (res.success) {
            toast.success(categoryToEdit ? "Category updated" : "Category created")
            onClose()
        } else {
            toast.error(res.error || "Operation failed")
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="md">
            <ModalContent>
                <ModalHeader>
                    {categoryToEdit ? 'Edit Category' : 'New Category'}
                </ModalHeader>
                <ModalBody>
                    <form id="add-category-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <Input
                            label="Category Name"
                            placeholder="e.g. Groceries"
                            {...register('name')}
                            error={errors.name?.message}
                        />

                        <div className="flex gap-4">
                            <div className="w-24">
                                <Input
                                    label="Emoji"
                                    placeholder="📁"
                                    {...register('emoji')}
                                    classNames={{ input: "text-center text-xl" }}
                                />
                            </div>
                            
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-foreground mb-1.5">
                                    Type
                                </label>
                                <Controller
                                    name="type"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            placeholder="Select type"
                                            selectedKeys={field.value ? [field.value] : []}
                                            onSelectionChange={(keys) => {
                                                const val = Array.from(keys)[0]
                                                field.onChange(val || '')
                                            }}
                                            variant="bordered"
                                            classNames={{
                                                trigger: "glass-input",
                                                value: "text-foreground",
                                                popoverContent: "glass-dropdown",
                                            }}
                                        >
                                            <SelectItem key="expense" textValue="Expense">
                                                Expense
                                            </SelectItem>
                                            <SelectItem key="income" textValue="Income">
                                                Income
                                            </SelectItem>
                                        </Select>
                                    )}
                                />
                            </div>
                        </div>

                        {/* Division */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1.5">Division</label>
                            <div className="flex gap-4">
                                {DIVISION_OPTIONS.map(option => (
                                    <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            value={option.value}
                                            {...register('division')}
                                            className="w-4 h-4 text-primary accent-primary"
                                        />
                                        <span className="text-foreground">{option.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </form>
                </ModalBody>
                <ModalFooter>
                    <Button variant="ghost" onPress={onClose}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        form="add-category-form"
                        isLoading={isSubmitting}
                        isDisabled={isSubmitting}
                    >
                        {isSubmitting ? 'Saving...' : (categoryToEdit ? 'Update Category' : 'Create Category')}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
