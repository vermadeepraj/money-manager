import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff } from 'lucide-react'
import { useProfileStore } from '../../stores/profileStore'
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

const passwordSchema = z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
}).refine((data) => data.currentPassword !== data.newPassword, {
    message: 'New password must be different from current password',
    path: ['newPassword'],
})

export function ChangePasswordModal({ isOpen, onClose }) {
    const { changePassword } = useProfileStore()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        }
    })

    const onSubmit = async (data) => {
        setIsSubmitting(true)
        const result = await changePassword(
            data.currentPassword,
            data.newPassword,
            data.confirmPassword
        )
        setIsSubmitting(false)

        if (result.success) {
            toast.success('Password changed successfully')
            reset()
            onClose()
        } else {
            toast.error(result.error || 'Failed to change password')
        }
    }

    const handleClose = () => {
        reset()
        onClose()
    }

    return (
        <Modal isOpen={isOpen} onClose={handleClose} size="md">
            <ModalContent>
                <ModalHeader>Change Password</ModalHeader>
                <ModalBody>
                    <form id="change-password-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {/* Current Password */}
                        <Input
                            label="Current Password"
                            type={showCurrentPassword ? 'text' : 'password'}
                            placeholder="Enter your current password"
                            {...register('currentPassword')}
                            error={errors.currentPassword?.message}
                            endContent={
                                <button
                                    type="button"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    className="text-default-500 hover:text-foreground transition-colors"
                                >
                                    {showCurrentPassword ? (
                                        <EyeOff className="w-4 h-4" />
                                    ) : (
                                        <Eye className="w-4 h-4" />
                                    )}
                                </button>
                            }
                        />

                        {/* New Password */}
                        <Input
                            label="New Password"
                            type={showNewPassword ? 'text' : 'password'}
                            placeholder="Enter new password"
                            description="Must be at least 6 characters"
                            {...register('newPassword')}
                            error={errors.newPassword?.message}
                            endContent={
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="text-default-500 hover:text-foreground transition-colors"
                                >
                                    {showNewPassword ? (
                                        <EyeOff className="w-4 h-4" />
                                    ) : (
                                        <Eye className="w-4 h-4" />
                                    )}
                                </button>
                            }
                        />

                        {/* Confirm Password */}
                        <Input
                            label="Confirm New Password"
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="Confirm new password"
                            {...register('confirmPassword')}
                            error={errors.confirmPassword?.message}
                            endContent={
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="text-default-500 hover:text-foreground transition-colors"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="w-4 h-4" />
                                    ) : (
                                        <Eye className="w-4 h-4" />
                                    )}
                                </button>
                            }
                        />
                    </form>
                </ModalBody>
                <ModalFooter>
                    <Button variant="ghost" onPress={handleClose}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        form="change-password-form"
                        isLoading={isSubmitting}
                        isDisabled={isSubmitting}
                    >
                        {isSubmitting ? 'Changing...' : 'Change Password'}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
