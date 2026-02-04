import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    User,
    Lock,
    LogOut,
    ChevronDown,
} from 'lucide-react'
import {
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    DropdownSection,
    Avatar,
} from '@heroui/react'
import { useAuthStore } from '../../stores/authStore'
import { ProfileModal } from './ProfileModal'
import { ChangePasswordModal } from './ChangePasswordModal'

const API_URL = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:5000'

export function ProfileDropdown() {
    const navigate = useNavigate()
    const { user, logout } = useAuthStore()
    const [isProfileOpen, setIsProfileOpen] = useState(false)
    const [isPasswordOpen, setIsPasswordOpen] = useState(false)

    const handleLogout = async () => {
        await logout()
        navigate('/login')
    }

    const getProfileImageUrl = () => {
        if (user?.profilePicture) {
            // If it starts with http, use as-is, otherwise prepend API URL
            if (user.profilePicture.startsWith('http')) {
                return user.profilePicture
            }
            return `${API_URL}${user.profilePicture}`
        }
        return null
    }

    const profileImageUrl = getProfileImageUrl()

    const handleAction = (key) => {
        switch (key) {
            case 'profile':
                setIsProfileOpen(true)
                break
            case 'password':
                setIsPasswordOpen(true)
                break
            case 'logout':
                handleLogout()
                break
        }
    }

    return (
        <>
            <Dropdown placement="bottom-end">
                <DropdownTrigger>
                    <button className="flex items-center gap-3 p-2 -m-2 rounded-xl hover:bg-default-100 dark:hover:bg-white/5 transition-colors outline-none">
                        {/* Avatar */}
                        <Avatar
                            src={profileImageUrl}
                            name={user?.name?.[0]?.toUpperCase() || 'U'}
                            size="sm"
                            className="ring-2 ring-background"
                            classNames={{
                                base: "bg-gradient-to-br from-blue-500 to-indigo-600",
                                name: "text-white font-bold",
                            }}
                        />
                        
                        {/* User Info (hidden on mobile) */}
                        <div className="text-left hidden sm:block">
                            <p className="text-sm font-medium leading-none text-foreground">
                                {user?.name}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                {user?.email}
                            </p>
                        </div>
                        
                        <ChevronDown className="w-4 h-4 text-muted-foreground hidden sm:block" />
                    </button>
                </DropdownTrigger>

                <DropdownMenu
                    aria-label="User menu"
                    onAction={handleAction}
                    classNames={{
                        base: "min-w-[220px] p-1 bg-background border-none shadow-lg rounded-xl",
                        list: "gap-0",
                    }}
                    itemClasses={{
                        base: [
                            "rounded-lg",
                            "text-foreground",
                            "transition-colors",
                            "data-[hover=true]:bg-default-100",
                            "dark:data-[hover=true]:bg-white/5",
                            "px-3 py-2",
                        ],
                    }}
                >
                    <DropdownSection showDivider>
                        <DropdownItem
                            key="user-info"
                            isReadOnly
                            className="h-14 gap-2 opacity-100"
                            textValue={user?.name}
                        >
                            <div className="flex flex-col">
                                <p className="text-sm font-medium">{user?.name}</p>
                                <p className="text-xs text-muted-foreground">{user?.email}</p>
                            </div>
                        </DropdownItem>
                    </DropdownSection>

                    <DropdownSection showDivider>
                        <DropdownItem
                            key="profile"
                            startContent={<User className="w-4 h-4" />}
                        >
                            Profile
                        </DropdownItem>
                        <DropdownItem
                            key="password"
                            startContent={<Lock className="w-4 h-4" />}
                        >
                            Change Password
                        </DropdownItem>
                    </DropdownSection>

                    <DropdownSection>
                        <DropdownItem
                            key="logout"
                            className="text-danger"
                            color="danger"
                            startContent={<LogOut className="w-4 h-4" />}
                        >
                            Logout
                        </DropdownItem>
                    </DropdownSection>
                </DropdownMenu>
            </Dropdown>

            {/* Modals */}
            <ProfileModal 
                isOpen={isProfileOpen} 
                onClose={() => setIsProfileOpen(false)} 
            />
            <ChangePasswordModal 
                isOpen={isPasswordOpen} 
                onClose={() => setIsPasswordOpen(false)} 
            />
        </>
    )
}
