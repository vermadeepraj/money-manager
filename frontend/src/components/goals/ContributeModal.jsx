import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { TrendingUp } from 'lucide-react'
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
import { Progress } from '@heroui/react'
import { toast } from 'sonner'

const contributeSchema = z.object({
    amount: z.string().min(1, 'Amount is required').refine(
        (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
        'Amount must be a positive number'
    )
})

export function ContributeModal({ isOpen, onClose, goal }) {
    const { contributeToGoal } = useGoalStore()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(contributeSchema),
        defaultValues: {
            amount: ''
        }
    })

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount)
    }

    const remaining = goal ? Math.max(0, goal.targetAmount - (goal.currentAmount || 0)) : 0
    const progress = goal ? Math.min(100, ((goal.currentAmount || 0) / goal.targetAmount) * 100) : 0

    const onSubmit = async (data) => {
        if (!goal) return
        
        setIsSubmitting(true)
        const result = await contributeToGoal(goal._id, parseFloat(data.amount))
        setIsSubmitting(false)

        if (result.success) {
            const newAmount = (goal.currentAmount || 0) + parseFloat(data.amount)
            if (newAmount >= goal.targetAmount) {
                toast.success('Congratulations! Goal achieved!')
            } else {
                toast.success(`Added ${formatCurrency(parseFloat(data.amount))} to ${goal.name}`)
            }
            reset()
            onClose()
        } else {
            toast.error(result.error || 'Failed to add money')
        }
    }

    const handleQuickAdd = (amount) => {
        setValue('amount', amount.toString())
    }

    if (!goal) return null

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="md">
            <ModalContent>
                <ModalHeader>
                    <div>
                        <h2 className="text-xl font-semibold">Add Money</h2>
                        <p className="text-sm text-default-500">{goal.name}</p>
                    </div>
                </ModalHeader>
                <ModalBody>
                    <form id="contribute-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {/* Current Progress */}
                        <div className="p-4 bg-white/5 rounded-lg space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-default-500">Current Progress</span>
                                <span className="text-foreground">{progress.toFixed(0)}%</span>
                            </div>
                            <Progress 
                                value={progress} 
                                color="secondary"
                                size="sm"
                                classNames={{
                                    track: "bg-white/10",
                                }}
                            />
                            <div className="flex justify-between text-sm">
                                <span className="text-violet-400">{formatCurrency(goal.currentAmount || 0)}</span>
                                <span className="text-default-500">of {formatCurrency(goal.targetAmount)}</span>
                            </div>
                            <div className="text-center text-sm text-default-500">
                                {formatCurrency(remaining)} remaining to reach your goal
                            </div>
                        </div>

                        {/* Amount Input */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-default-500">Amount to Add</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-default-500 z-10">₹</span>
                                <Input
                                    type="number"
                                    step="100"
                                    min="1"
                                    placeholder="5000"
                                    classNames={{ input: "pl-6 text-lg" }}
                                    {...register('amount')}
                                    error={errors.amount?.message}
                                />
                            </div>
                        </div>

                        {/* Quick Add Buttons */}
                        <div className="space-y-2">
                            <label className="text-sm text-default-500">Quick Add</label>
                            <div className="grid grid-cols-4 gap-2">
                                {[1000, 2500, 5000, 10000].map(amount => (
                                    <Button
                                        key={amount}
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onPress={() => handleQuickAdd(amount)}
                                    >
                                        {formatCurrency(amount).replace('₹', '₹')}
                                    </Button>
                                ))}
                            </div>
                            {remaining > 0 && remaining <= 50000 && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="w-full mt-2 text-emerald-500 border-emerald-500/30 hover:bg-emerald-500/10"
                                    onPress={() => handleQuickAdd(remaining)}
                                >
                                    Complete Goal ({formatCurrency(remaining)})
                                </Button>
                            )}
                        </div>
                    </form>
                </ModalBody>
                <ModalFooter>
                    <Button variant="ghost" onPress={onClose}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        form="contribute-form"
                        isLoading={isSubmitting}
                        isDisabled={isSubmitting}
                        startContent={!isSubmitting && <TrendingUp className="w-4 h-4" />}
                    >
                        {isSubmitting ? 'Adding...' : 'Add Money'}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
