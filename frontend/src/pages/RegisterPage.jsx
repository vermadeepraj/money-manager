import { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import {
    Loader2,
    Eye,
    EyeOff,
    Mail,
    Lock,
    User,
    ArrowLeft,
    TrendingUp,
    PiggyBank,
    Target,
    Shield,
    BarChart3,
    CreditCard,
    ArrowRight,
    Zap,
    Check,
    Star
} from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Logo, LogoIcon } from '../components/brand'

const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
})

// Password strength indicator
function getPasswordStrength(password) {
    if (!password) return { strength: 0, label: '', color: '' }
    
    let strength = 0
    if (password.length >= 6) strength++
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++

    const levels = [
        { label: 'Very Weak', color: 'bg-red-500' },
        { label: 'Weak', color: 'bg-orange-500' },
        { label: 'Fair', color: 'bg-yellow-500' },
        { label: 'Good', color: 'bg-blue-500' },
        { label: 'Strong', color: 'bg-emerald-500' },
    ]

    return { strength, ...levels[Math.min(strength, 4)] }
}

const benefits = [
    { icon: Zap, text: 'Get started in under 2 minutes' },
    { icon: Shield, text: 'Bank-level 256-bit encryption' },
    { icon: BarChart3, text: 'Smart insights & analytics' },
    { icon: Target, text: 'Personal goal tracking' },
]

const testimonial = {
    quote: "WealthWise completely transformed how I manage my finances. I've saved more in 3 months than I did all last year!",
    author: "Sarah M.",
    role: "Freelance Designer",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face"
}

export function RegisterPage() {
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const { register: registerUser, isLoading, error, clearError, user } = useAuthStore()

    // Refs for GSAP animations
    const containerRef = useRef(null)
    const leftPanelRef = useRef(null)
    const rightPanelRef = useRef(null)
    const logoRef = useRef(null)
    const floatingCardsRef = useRef(null)

    // Redirect if already logged in
    useEffect(() => {
        if (user) {
            navigate('/app/dashboard', { replace: true })
        }
    }, [user, navigate])

    // Clear errors on unmount
    useEffect(() => {
        return () => clearError()
    }, [clearError])

    // GSAP Animations
    useEffect(() => {
        const ctx = gsap.context(() => {
            // Set initial states
            gsap.set(leftPanelRef.current, { opacity: 0, x: -50 })
            gsap.set(rightPanelRef.current, { opacity: 0, x: 50 })
            gsap.set(logoRef.current, { opacity: 0, scale: 0.5, rotation: -180 })
            gsap.set('.form-element', { opacity: 0, y: 20 })
            gsap.set('.benefit-item', { opacity: 0, x: -30 })
            gsap.set('.floating-card', { opacity: 0, scale: 0.8 })
            gsap.set('.testimonial-card', { opacity: 0, y: 30 })

            // Main animation timeline
            const tl = gsap.timeline({ delay: 0.2 })

            // Panels entrance
            tl.to(leftPanelRef.current, {
                opacity: 1,
                x: 0,
                duration: 0.8,
                ease: 'power3.out'
            })
            .to(rightPanelRef.current, {
                opacity: 1,
                x: 0,
                duration: 0.8,
                ease: 'power3.out'
            }, '-=0.6')

            // Logo animation
            .to(logoRef.current, {
                opacity: 1,
                scale: 1,
                rotation: 0,
                duration: 0.6,
                ease: 'back.out(1.7)'
            }, '-=0.4')

            // Form elements stagger
            .to('.form-element', {
                opacity: 1,
                y: 0,
                duration: 0.5,
                stagger: 0.08,
                ease: 'power3.out'
            }, '-=0.3')

            // Benefits stagger
            .to('.benefit-item', {
                opacity: 1,
                x: 0,
                duration: 0.5,
                stagger: 0.1,
                ease: 'power3.out'
            }, '-=0.4')

            // Floating cards
            .to('.floating-card', {
                opacity: 1,
                scale: 1,
                duration: 0.6,
                stagger: 0.15,
                ease: 'back.out(1.7)'
            }, '-=0.3')

            // Testimonial
            .to('.testimonial-card', {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: 'power3.out'
            }, '-=0.2')

            // Continuous floating animation for cards
            const cards = floatingCardsRef.current?.querySelectorAll('.floating-card')
            if (cards) {
                cards.forEach((card, index) => {
                    gsap.to(card, {
                        y: '+=15',
                        duration: 2.5 + index * 0.5,
                        ease: 'sine.inOut',
                        yoyo: true,
                        repeat: -1,
                        delay: index * 0.3
                    })
                })
            }

            // Background orb animations
            gsap.to('.gradient-orb', {
                scale: 1.1,
                duration: 4,
                ease: 'sine.inOut',
                yoyo: true,
                repeat: -1,
                stagger: 0.5
            })

        }, containerRef)

        return () => ctx.revert()
    }, [])

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    })

    const password = watch('password')
    const passwordStrength = getPasswordStrength(password)

    const onSubmit = async (data) => {
        const result = await registerUser(data.name, data.email, data.password)
        if (result.success) {
            navigate('/app/dashboard', { replace: true })
        }
    }

    return (
        <div ref={containerRef} className="min-h-screen min-h-dvh flex">
            {/* Left Panel - Branding & Benefits */}
            <div
                ref={leftPanelRef}
                className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative bg-gradient-to-br from-emerald-600 via-emerald-700 to-blue-600 overflow-hidden"
            >
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:48px_48px]" />

                {/* Gradient Orbs */}
                <div className="gradient-orb absolute top-1/4 -left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
                <div className="gradient-orb absolute bottom-1/4 right-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl" />
                <div className="gradient-orb absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-400/10 rounded-full blur-3xl" />

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
                    {/* Logo */}
                    <div>
                        <Logo linkToHome size="lg" textGradient={false} />
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 flex flex-col justify-center py-12">
                        <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
                            Start Your Journey to{' '}
                            <span className="text-blue-200">Financial Freedom</span>
                        </h1>
                        <p className="text-lg text-white/70 mb-10 max-w-md">
                            Create your free account and take the first step towards 
                            smarter money management.
                        </p>

                        {/* Benefits List */}
                        <div className="space-y-4 mb-10">
                            {benefits.map((benefit, index) => (
                                <div
                                    key={benefit.text}
                                    className="benefit-item flex items-center gap-4"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                                        <benefit.icon className="w-5 h-5 text-blue-200" />
                                    </div>
                                    <span className="text-white/90 font-medium">{benefit.text}</span>
                                </div>
                            ))}
                        </div>

                        {/* Testimonial */}
                        <div className="testimonial-card bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 max-w-md">
                            <div className="flex gap-1 mb-3">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>
                            <p className="text-white/90 text-sm italic mb-4">
                                "{testimonial.quote}"
                            </p>
                            <div className="flex items-center gap-3">
                                <img
                                    src={testimonial.avatar}
                                    alt={testimonial.author}
                                    className="w-10 h-10 rounded-full object-cover border-2 border-white/20"
                                />
                                <div>
                                    <div className="text-white font-medium text-sm">{testimonial.author}</div>
                                    <div className="text-white/60 text-xs">{testimonial.role}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Floating Cards */}
                    <div ref={floatingCardsRef} className="absolute right-8 top-1/3 -translate-y-1/2 hidden xl:block">
                        {/* Balance Card */}
                        <div className="floating-card absolute -top-20 right-0 w-52 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-2xl">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs text-white/60">Monthly Savings</span>
                                <TrendingUp className="w-4 h-4 text-blue-200" />
                            </div>
                            <div className="text-xl font-bold text-white">$1,250.00</div>
                            <div className="text-xs text-emerald-300 mt-1">+25% this month</div>
                        </div>

                        {/* Goal Card */}
                        <div className="floating-card absolute top-24 -right-4 w-48 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-2xl">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center">
                                    <Target className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <div className="text-xs text-white/60">Emergency Fund</div>
                                    <div className="text-sm font-semibold text-white">75%</div>
                                </div>
                            </div>
                            <div className="mt-3 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full w-[75%] bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full" />
                            </div>
                        </div>
                    </div>

                    {/* Bottom Stats */}
                    <div className="flex items-center gap-8 text-white/60 text-sm">
                        <div>
                            <span className="text-white font-semibold">Free</span> Forever Plan
                        </div>
                        <div>
                            <span className="text-white font-semibold">No</span> Credit Card
                        </div>
                        <div>
                            <span className="text-white font-semibold">2 min</span> Setup
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel - Register Form */}
            <div
                ref={rightPanelRef}
                className="w-full lg:w-1/2 xl:w-[45%] flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-background relative overflow-y-auto"
            >
                {/* Background subtle gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-blue-500/5 pointer-events-none" />

                {/* Mobile Logo */}
                <Link
                    to="/"
                    className="lg:hidden absolute top-6 left-6"
                >
                    <Logo size="md" />
                </Link>

                {/* Back to Home (Desktop) */}
                <Link
                    to="/"
                    className="hidden lg:flex absolute top-8 left-8 items-center gap-2 text-muted-foreground hover:text-white transition-colors duration-300 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-medium">Back to home</span>
                </Link>

                {/* Form Container */}
                <div className="w-full max-w-md relative z-10 mt-16 lg:mt-0 py-4">
                    {/* Header */}
                    <div className="text-center lg:text-left mb-6">
                        <div
                            ref={logoRef}
                            className="lg:hidden inline-flex items-center justify-center mb-6"
                        >
                            <LogoIcon size="xl" />
                        </div>

                        <h1 className="form-element text-3xl font-bold text-white mb-2">
                            Create Account
                        </h1>
                        <p className="form-element text-muted-foreground">
                            Start your journey to financial freedom
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* Global Error */}
                        {error && (
                            <div className="form-element p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3">
                                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                {error}
                            </div>
                        )}

                        {/* Name Field */}
                        <div className="form-element space-y-2">
                            <label htmlFor="name" className="text-sm font-medium text-white/80">
                                Full Name
                            </label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                                    <User className="w-5 h-5" />
                                </div>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="John Doe"
                                    className="auth-input pl-12 h-12 bg-white/5 border-white/10 rounded-xl text-white placeholder:text-muted-foreground focus:border-emerald-500/50 focus:bg-white/10 transition-all duration-300"
                                    {...register('name')}
                                />
                            </div>
                            {errors.name && (
                                <p className="text-sm text-red-400 flex items-center gap-2">
                                    <span className="w-1 h-1 bg-red-400 rounded-full" />
                                    {errors.name.message}
                                </p>
                            )}
                        </div>

                        {/* Email Field */}
                        <div className="form-element space-y-2">
                            <label htmlFor="email" className="text-sm font-medium text-white/80">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    className="auth-input pl-12 h-12 bg-white/5 border-white/10 rounded-xl text-white placeholder:text-muted-foreground focus:border-emerald-500/50 focus:bg-white/10 transition-all duration-300"
                                    {...register('email')}
                                />
                            </div>
                            {errors.email && (
                                <p className="text-sm text-red-400 flex items-center gap-2">
                                    <span className="w-1 h-1 bg-red-400 rounded-full" />
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div className="form-element space-y-2">
                            <label htmlFor="password" className="text-sm font-medium text-white/80">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Create a strong password"
                                    className="auth-input pl-12 pr-12 h-12 bg-white/5 border-white/10 rounded-xl text-white placeholder:text-muted-foreground focus:border-emerald-500/50 focus:bg-white/10 transition-all duration-300"
                                    {...register('password')}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            
                            {/* Password Strength Indicator */}
                            {password && (
                                <div className="space-y-2">
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map((level) => (
                                            <div
                                                key={level}
                                                className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                                                    level <= passwordStrength.strength
                                                        ? passwordStrength.color
                                                        : 'bg-white/10'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Strength:{' '}
                                        <span className={`font-medium ${
                                            passwordStrength.strength >= 4 ? 'text-emerald-400' :
                                            passwordStrength.strength >= 3 ? 'text-blue-400' :
                                            passwordStrength.strength >= 2 ? 'text-yellow-400' :
                                            'text-red-400'
                                        }`}>
                                            {passwordStrength.label}
                                        </span>
                                    </p>
                                </div>
                            )}

                            {errors.password && (
                                <p className="text-sm text-red-400 flex items-center gap-2">
                                    <span className="w-1 h-1 bg-red-400 rounded-full" />
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        {/* Confirm Password Field */}
                        <div className="form-element space-y-2">
                            <label htmlFor="confirmPassword" className="text-sm font-medium text-white/80">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    placeholder="Confirm your password"
                                    className="auth-input pl-12 pr-12 h-12 bg-white/5 border-white/10 rounded-xl text-white placeholder:text-muted-foreground focus:border-emerald-500/50 focus:bg-white/10 transition-all duration-300"
                                    {...register('confirmPassword')}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-sm text-red-400 flex items-center gap-2">
                                    <span className="w-1 h-1 bg-red-400 rounded-full" />
                                    {errors.confirmPassword.message}
                                </p>
                            )}
                        </div>

                        {/* Terms & Conditions */}
                        <div className="form-element flex items-start gap-3 text-sm text-muted-foreground">
                            <div className="w-5 h-5 mt-0.5 rounded border border-white/20 bg-white/5 flex items-center justify-center flex-shrink-0">
                                <Check className="w-3 h-3 text-emerald-400" />
                            </div>
                            <p>
                                By creating an account, you agree to our{' '}
                                <button type="button" className="text-emerald-400 hover:underline">Terms</button>
                                {' '}and{' '}
                                <button type="button" className="text-emerald-400 hover:underline">Privacy Policy</button>
                            </p>
                        </div>

                        {/* Submit Button */}
                        <div className="form-element pt-2">
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-12 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Creating account...
                                    </>
                                ) : (
                                    <>
                                        Create Account
                                        <ArrowRight className="ml-2 w-5 h-5" />
                                    </>
                                )}
                            </Button>
                        </div>

                        {/* Divider */}
                        <div className="form-element relative py-3">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/10" />
                            </div>
                            <div className="relative flex justify-center">
                                <span className="bg-background px-4 text-sm text-muted-foreground">
                                    Already have an account?
                                </span>
                            </div>
                        </div>

                        {/* Sign In Link */}
                        <div className="form-element">
                            <Link to="/login">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full h-12 bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 text-white font-medium rounded-xl transition-all duration-300"
                                >
                                    Sign In Instead
                                </Button>
                            </Link>
                        </div>
                    </form>

                    {/* Mobile Benefits */}
                    <div className="lg:hidden mt-8 pt-6 border-t border-white/10">
                        <div className="flex justify-center gap-6 text-muted-foreground">
                            <div className="flex items-center gap-2 text-xs">
                                <Shield className="w-4 h-4 text-emerald-400" />
                                <span>Secure</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                                <Zap className="w-4 h-4 text-emerald-400" />
                                <span>Fast Setup</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                                <CreditCard className="w-4 h-4 text-emerald-400" />
                                <span>Free</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
