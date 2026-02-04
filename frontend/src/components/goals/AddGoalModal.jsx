import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useGoalStore } from '../../stores/goalStore'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from '../ui/modal'
import { toast } from 'sonner'

const goalSchema = z.object({
    name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
    targetAmount: z.string().min(1, 'Target amount is required').refine(
        (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
        'Target must be a positive number'
    ),
    currentAmount: z.string().optional().refine(
        (val) => !val || (!isNaN(parseFloat(val)) && parseFloat(val) >= 0),
        'Current amount must be 0 or positive'
    ),
    targetDate: z.string().min(1, 'Target date is required')
})

export function AddGoalModal({ isOpen, onClose, goalToEdit = null }) {
    const { createGoal, updateGoal } = useGoalStore()

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: zodResolver(goalSchema),
        defaultValues: {
            name: '',
            targetAmount: '',
            currentAmount: '0',
            targetDate: ''
        }
    })

    // Populate form when editing
    useEffect(() => {
        if (isOpen && goalToEdit) {
            setValue('name', goalToEdit.name || '')
            setValue('targetAmount', goalToEdit.targetAmount?.toString() || '')
            setValue('currentAmount', goalToEdit.currentAmount?.toString() || '0')
            // Format date for input
            const date = new Date(goalToEdit.targetDate)
            setValue('targetDate', date.toISOString().split('T')[0])
        } else if (isOpen) {
            // Set default date to 3 months from now
            const defaultDate = new Date()
            defaultDate.setMonth(defaultDate.getMonth() + 3)
            reset({
                name: '',
                targetAmount: '',
                currentAmount: '0',
                targetDate: defaultDate.toISOString().split('T')[0]
            })
        }
    }, [isOpen, goalToEdit, setValue, reset])

    const onSubmit = async (data) => {
        const goalData = {
            name: data.name,
            targetAmount: parseFloat(data.targetAmount),
            currentAmount: parseFloat(data.currentAmount) || 0,
            targetDate: new Date(data.targetDate).toISOString()
        }

        let result
        if (goalToEdit) {
            result = await updateGoal(goalToEdit._id, goalData)
        } else {
            result = await createGoal(goalData)
        }

        if (result.success) {
            toast.success(goalToEdit ? 'Goal updated' : 'Goal created')
            onClose()
        } else {
            toast.error(result.error || 'Operation failed')
        }
    }

    // Get min date (today)
    const minDate = new Date().toISOString().split('T')[0]

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="md">
            <ModalContent>
                <ModalHeader>
                    {goalToEdit ? 'Edit Goal' : 'New Savings Goal'}
                </ModalHeader>
                <ModalBody>
                    <form id="add-goal-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {/* Goal Name */}
                        <Input
                            label="Goal Name"
                            placeholder="e.g., Emergency Fund, Vacation, New Car"
                            {...register('name')}
                            error={errors.name?.message}
                        />

                        {/* Target Amount */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1.5">Target Amount</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10">₹</span>
                                <Input
                                    type="number"
                                    step="100"
                                    min="1"
                                    placeholder="100000"
                                    classNames={{ input: "pl-6" }}
                                    {...register('targetAmount')}
                                    error={errors.targetAmount?.message}
                                />
                            </div>
                        </div>

                        {/* Current Amount */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1.5">
                                {goalToEdit ? 'Current Amount' : 'Starting Amount (optional)'}
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10">₹</span>
                                <Input
                                    type="number"
                                    step="100"
                                    min="0"
                                    placeholder="0"
                                    classNames={{ input: "pl-6" }}
                                    {...register('currentAmount')}
                                    error={errors.currentAmount?.message}
                                />
                            </div>
                        </div>

                        {/* Target Date */}
                        <Input
                            type="date"
                            label="Target Date"
                            min={minDate}
                            {...register('targetDate')}
                            error={errors.targetDate?.message}
                        />
                    </form>
                </ModalBody>
                <ModalFooter>
                    <Button variant="ghost" onPress={onClose}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        form="add-goal-form"
                        isLoading={isSubmitting}
                        isDisabled={isSubmitting}
                    >
                        {isSubmitting ? 'Saving...' : (goalToEdit ? 'Update Goal' : 'Create Goal')}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
