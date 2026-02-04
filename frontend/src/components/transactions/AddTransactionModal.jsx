import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
import { useUIStore } from '../../stores/uiStore'
import { useTransactionStore } from '../../stores/transactionStore'
import { categoriesAPI, accountsAPI } from '../../lib/api'
import { cn } from '../../lib/utils'
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
import { 
    TRANSACTION_TYPES, 
    DIVISIONS, 
    DIVISION_OPTIONS,
    MODALS,
    CURRENCY 
} from '../../constants'

const transactionSchema = z.object({
    type: z.enum([TRANSACTION_TYPES.INCOME, TRANSACTION_TYPES.EXPENSE]),
    amount: z.string().min(1, 'Amount is required').refine(
        (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
        'Amount must be a positive number'
    ),
    categoryId: z.string().min(1, 'Category is required'),
    accountId: z.string().min(1, 'Account is required'),
    description: z.string().optional(),
    date: z.string().min(1, 'Date is required'),
    division: z.enum([DIVISIONS.PERSONAL, DIVISIONS.OFFICE]),
})

export function AddTransactionModal() {
    const { activeModal, closeModal } = useUIStore()
    const { createTransaction } = useTransactionStore()
    const [categories, setCategories] = useState([])
    const [accounts, setAccounts] = useState([])
    const [isLoadingData, setIsLoadingData] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const isOpen = activeModal === MODALS.ADD_TRANSACTION

    const {
        register,
        control,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(transactionSchema),
        defaultValues: {
            type: TRANSACTION_TYPES.EXPENSE,
            amount: '',
            categoryId: '',
            accountId: '',
            description: '',
            date: new Date().toISOString().split('T')[0],
            division: DIVISIONS.PERSONAL,
        },
    })

    const watchType = watch('type')

    // Fetch categories and accounts when modal opens
    useEffect(() => {
        if (isOpen) {
            setIsLoadingData(true);
            Promise.all([
                categoriesAPI.getAll(),
                accountsAPI.getAll()
            ]).then(([catRes, accRes]) => {
                setCategories(catRes.data.data.categories || []);
                setAccounts(accRes.data.data.accounts || []);
            }).catch(console.error)
                .finally(() => setIsLoadingData(false));
        }
    }, [isOpen]);

    // Filter categories by type
    const filteredCategories = categories.filter(cat => cat.type === watchType);

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        const transactionData = {
            type: data.type,
            amount: parseFloat(data.amount),
            categoryId: data.categoryId,
            accountId: data.accountId,
            description: data.description || '',
            date: new Date(data.date).toISOString(),
            division: data.division,
        };

        const result = await createTransaction(transactionData);
        setIsSubmitting(false);
        if (result.success) {
            toast.success('Transaction added successfully')
            reset();
            closeModal();
        } else {
            toast.error(result.error || 'Failed to add transaction')
        }
    };

    const handleClose = () => {
        reset();
        closeModal();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} size="lg">
            <ModalContent>
                <ModalHeader>Add Transaction</ModalHeader>
                <ModalBody>
                    <form id="add-transaction-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {/* Type Toggle */}
                        <div className="flex p-1 rounded-lg glass-input">
                            <label className={cn(
                                "flex-1 text-center py-2 rounded-md cursor-pointer transition-all font-medium",
                                watchType === TRANSACTION_TYPES.INCOME
                                    ? "bg-income text-white"
                                    : "text-muted-foreground hover:text-foreground"
                            )}>
                                <input
                                    type="radio"
                                    value={TRANSACTION_TYPES.INCOME}
                                    {...register('type')}
                                    className="sr-only"
                                />
                                Income
                            </label>
                            <label className={cn(
                                "flex-1 text-center py-2 rounded-md cursor-pointer transition-all font-medium",
                                watchType === TRANSACTION_TYPES.EXPENSE
                                    ? "bg-expense text-white"
                                    : "text-muted-foreground hover:text-foreground"
                            )}>
                                <input
                                    type="radio"
                                    value={TRANSACTION_TYPES.EXPENSE}
                                    {...register('type')}
                                    className="sr-only"
                                />
                                Expense
                            </label>
                        </div>

                        {/* Amount */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1.5">Amount</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10">{CURRENCY.SYMBOL}</span>
                                <Input
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    classNames={{ input: "pl-6" }}
                                    {...register('amount')}
                                    error={errors.amount?.message}
                                />
                            </div>
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1.5">Category</label>
                            <Controller
                                name="categoryId"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        placeholder="Select category..."
                                        selectedKeys={field.value ? [field.value] : []}
                                        onSelectionChange={(keys) => {
                                            const val = Array.from(keys)[0]
                                            field.onChange(val || '')
                                        }}
                                        isDisabled={isLoadingData}
                                        isInvalid={!!errors.categoryId}
                                        errorMessage={errors.categoryId?.message}
                                        variant="bordered"
                                        classNames={{
                                            trigger: "glass-input",
                                            value: "text-foreground",
                                            popoverContent: "glass-dropdown",
                                            listbox: "text-foreground",
                                        }}
                                    >
                                        {filteredCategories.map(cat => (
                                            <SelectItem key={cat._id} textValue={cat.name}>
                                                <span className="mr-2">{cat.emoji}</span>
                                                {cat.name}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                )}
                            />
                        </div>

                        {/* Account */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1.5">Account</label>
                            <Controller
                                name="accountId"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        placeholder="Select account..."
                                        selectedKeys={field.value ? [field.value] : []}
                                        onSelectionChange={(keys) => {
                                            const val = Array.from(keys)[0]
                                            field.onChange(val || '')
                                        }}
                                        isDisabled={isLoadingData}
                                        isInvalid={!!errors.accountId}
                                        errorMessage={errors.accountId?.message}
                                        variant="bordered"
                                        classNames={{
                                            trigger: "glass-input",
                                            value: "text-foreground",
                                            popoverContent: "glass-dropdown",
                                            listbox: "text-foreground",
                                        }}
                                    >
                                        {accounts.map(acc => (
                                            <SelectItem key={acc._id} textValue={acc.name}>
                                                {acc.name}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                )}
                            />
                        </div>

                        {/* Description */}
                        <Input
                            label="Description"
                            placeholder="What was this for?"
                            {...register('description')}
                        />

                        {/* Date */}
                        <Input
                            type="date"
                            label="Date"
                            {...register('date')}
                            error={errors.date?.message}
                        />

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
                    <Button
                        variant="ghost"
                        onPress={handleClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        form="add-transaction-form"
                        isLoading={isSubmitting || isLoadingData}
                        isDisabled={isSubmitting || isLoadingData}
                    >
                        {isSubmitting ? 'Saving...' : 'Save Transaction'}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
