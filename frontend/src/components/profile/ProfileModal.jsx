import { useEffect, useState, useRef } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Camera, Trash2, Upload } from 'lucide-react'
import { useProfileStore } from '../../stores/profileStore'
import { useAuthStore } from '../../stores/authStore'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from '../ui/modal'
import { Select, SelectItem, Avatar, Spinner } from '@heroui/react'
import { CURRENCY_OPTIONS, DIVISION_OPTIONS } from '../../constants'
import { toast } from 'sonner'

const API_URL = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:5000'

const profileSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name cannot exceed 50 characters'),
    currency: z.string().min(1, 'Currency is required'),
    defaultDivision: z.enum(['personal', 'office']),
})

export function ProfileModal({ isOpen, onClose }) {
    const { user } = useAuthStore()
    const { 
        profile, 
        fetchProfile, 
        updateProfile, 
        uploadPhoto, 
        deletePhoto,
        isLoading,
        isUploading 
    } = useProfileStore()
    
    const [isSubmitting, setIsSubmitting] = useState(false)
    const fileInputRef = useRef(null)

    const {
        control,
        register,
        handleSubmit,
        reset,
        formState: { errors, isDirty }
    } = useForm({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: '',
            currency: 'INR',
            defaultDivision: 'personal'
        }
    })

    // Fetch profile when modal opens
    useEffect(() => {
        if (isOpen) {
            fetchProfile()
        }
    }, [isOpen, fetchProfile])

    // Update form when profile loads
    useEffect(() => {
        if (profile) {
            reset({
                name: profile.name || '',
                currency: profile.currency || 'INR',
                defaultDivision: profile.defaultDivision || 'personal'
            })
        }
    }, [profile, reset])

    const onSubmit = async (data) => {
        setIsSubmitting(true)
        const result = await updateProfile(data)
        setIsSubmitting(false)

        if (result.success) {
            toast.success('Profile updated successfully')
            onClose()
        } else {
            toast.error(result.error || 'Failed to update profile')
        }
    }

    const handlePhotoUpload = async (e) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
        if (!validTypes.includes(file.type)) {
            toast.error('Please select a valid image file (JPEG, PNG, GIF, or WebP)')
            return
        }

        // Validate file size (2MB)
        if (file.size > 2 * 1024 * 1024) {
            toast.error('Image must be less than 2MB')
            return
        }

        const result = await uploadPhoto(file)
        if (result.success) {
            toast.success('Profile photo updated')
        } else {
            toast.error(result.error || 'Failed to upload photo')
        }

        // Clear the input
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const handlePhotoDelete = async () => {
        const result = await deletePhoto()
        if (result.success) {
            toast.success('Profile photo removed')
        } else {
            toast.error(result.error || 'Failed to remove photo')
        }
    }

    const getProfileImageUrl = () => {
        const pic = profile?.profilePicture || user?.profilePicture
        if (pic) {
            if (pic.startsWith('http')) return pic
            return `${API_URL}${pic}`
        }
        return null
    }

    const profileImageUrl = getProfileImageUrl()

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg" scrollBehavior="inside">
            <ModalContent>
                <ModalHeader>Edit Profile</ModalHeader>
                <ModalBody>
                    <form id="profile-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Profile Photo Section */}
                        <div className="flex flex-col items-center space-y-4">
                            <div className="relative">
                                <Avatar
                                    src={profileImageUrl}
                                    name={profile?.name || user?.name || 'U'}
                                    className="w-24 h-24 text-2xl"
                                    showFallback
                                    isBordered
                                    classNames={{
                                        base: "ring-accent",
                                    }}
                                />
                                
                                {/* Upload Overlay */}
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isUploading}
                                    className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg hover:bg-primary/80 transition-colors disabled:opacity-50"
                                >
                                    {isUploading ? (
                                        <Spinner size="sm" color="white" />
                                    ) : (
                                        <Camera className="w-4 h-4 text-white" />
                                    )}
                                </button>
                            </div>

                            {/* Hidden File Input */}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                                onChange={handlePhotoUpload}
                                className="hidden"
                            />

                            {/* Photo Actions */}
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onPress={() => fileInputRef.current?.click()}
                                    isDisabled={isUploading}
                                    startContent={<Upload className="w-4 h-4" />}
                                >
                                    {profileImageUrl ? 'Change Photo' : 'Upload Photo'}
                                </Button>
                                
                                {profileImageUrl && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onPress={handlePhotoDelete}
                                        isDisabled={isUploading}
                                        className="text-danger hover:bg-danger/10"
                                        startContent={<Trash2 className="w-4 h-4" />}
                                    >
                                        Remove
                                    </Button>
                                )}
                            </div>
                            
                            <p className="text-xs text-default-500">
                                JPG, PNG, GIF or WebP. Max 2MB.
                            </p>
                        </div>

                        {/* Name */}
                        <Input
                            label="Display Name"
                            type="text"
                            placeholder="Your name"
                            {...register('name')}
                            error={errors.name?.message}
                        />

                        {/* Email (Read-only) */}
                        <Input
                            label="Email"
                            type="email"
                            value={profile?.email || user?.email || ''}
                            isDisabled
                            description="Email change coming soon"
                        />

                        {/* Currency Preference */}
                        <div className="w-full">
                            <label className="block text-sm font-medium text-foreground mb-1.5">
                                Currency
                            </label>
                            <Controller
                                name="currency"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        placeholder="Select currency"
                                        selectedKeys={field.value ? [field.value] : []}
                                        onSelectionChange={(keys) => {
                                            const val = Array.from(keys)[0]
                                            field.onChange(val || 'INR')
                                        }}
                                        isInvalid={!!errors.currency}
                                        errorMessage={errors.currency?.message}
                                        variant="bordered"
                                        classNames={{
                                            trigger: "glass-input",
                                            value: "text-foreground",
                                            popoverContent: "glass-dropdown",
                                        }}
                                    >
                                        {CURRENCY_OPTIONS.map(option => (
                                            <SelectItem key={option.value} textValue={option.label}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                )}
                            />
                        </div>

                        {/* Default Division */}
                        <div className="w-full">
                            <label className="block text-sm font-medium text-foreground mb-1.5">
                                Default Division
                            </label>
                            <Controller
                                name="defaultDivision"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        placeholder="Select default division"
                                        selectedKeys={field.value ? [field.value] : []}
                                        onSelectionChange={(keys) => {
                                            const val = Array.from(keys)[0]
                                            field.onChange(val || 'personal')
                                        }}
                                        variant="bordered"
                                        classNames={{
                                            trigger: "glass-input",
                                            value: "text-foreground",
                                            popoverContent: "glass-dropdown",
                                        }}
                                    >
                                        {DIVISION_OPTIONS.map(option => (
                                            <SelectItem key={option.value} textValue={option.label}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                )}
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                                This will be pre-selected when creating new transactions
                            </p>
                        </div>
                    </form>
                </ModalBody>
                <ModalFooter>
                    <Button variant="ghost" onPress={onClose}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        form="profile-form"
                        isLoading={isSubmitting || isLoading}
                        isDisabled={isSubmitting || isLoading || !isDirty}
                    >
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
