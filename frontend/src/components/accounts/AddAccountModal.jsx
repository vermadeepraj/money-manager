import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAccountStore } from '../../stores/accountStore'
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
import { ACCOUNT_TYPES, ACCOUNT_TYPE_OPTIONS } from '../../constants'

const schema = z.object({
    name: z.string().min(1, "Name is required"),
    type: z.enum([ACCOUNT_TYPES.BANK, ACCOUNT_TYPES.CASH, ACCOUNT_TYPES.WALLET]),
    balance: z.preprocess((val) => Number(val), z.number().min(0, "Balance must be 0 or positive"))
})

export function AddAccountModal({ isOpen, onClose, accountToEdit = null }) {
    const { createAccount, updateAccount } = useAccountStore()
    const { control, register, handleSubmit, formState: { errors, isSubmitting }, reset, setValue } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            name: '',
            type: ACCOUNT_TYPES.BANK,
            balance: 0
        }
    })

    useEffect(() => {
        if (isOpen) {
            if (accountToEdit) {
                setValue('name', accountToEdit.name)
                setValue('type', accountToEdit.type)
                setValue('balance', accountToEdit.balance)
            } else {
                reset({
                    name: '',
                    type: ACCOUNT_TYPES.BANK,
                    balance: 0
                })
            }
        }
    }, [isOpen, accountToEdit, reset, setValue])

    const onSubmit = async (data) => {
        let res
        if (accountToEdit) {
            res = await updateAccount(accountToEdit._id, data)
        } else {
            res = await createAccount(data)
        }

        if (res.success) {
            toast.success(accountToEdit ? "Account updated" : "Account created")
            onClose()
        } else {
            toast.error(res.error || "Operation failed")
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="md">
            <ModalContent>
                <ModalHeader>
                    {accountToEdit ? 'Edit Account' : 'New Account'}
                </ModalHeader>
                <ModalBody>
                    <form id="add-account-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <Input
                            label="Account Name"
                            placeholder="e.g. Chase Checking"
                            {...register('name')}
                            error={errors.name?.message}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <div>
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
                                            {ACCOUNT_TYPE_OPTIONS.map(option => (
                                                <SelectItem key={option.value} textValue={option.label}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </Select>
                                    )}
                                />
                            </div>

                            <Input
                                label={accountToEdit ? 'Current Balance' : 'Initial Balance'}
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                {...register('balance', { valueAsNumber: true })}
                                error={errors.balance?.message}
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
                        form="add-account-form"
                        isLoading={isSubmitting}
                        isDisabled={isSubmitting}
                    >
                        {isSubmitting ? 'Saving...' : (accountToEdit ? 'Update Account' : 'Create Account')}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
