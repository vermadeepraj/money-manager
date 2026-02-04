import { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { gsap } from 'gsap'
import {
    Loader2,
    Eye,
    EyeOff,
    Mail,
    Lock,
    ArrowLeft,
    TrendingUp,
    PiggyBank,
    Target,
    Shield,
    BarChart3,
    CreditCard,
    ArrowRight
} from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Logo, LogoIcon } from '../components/brand'

const loginSchema = z.object({
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
})

const features = [
    { icon: BarChart3, text: 'Smart Analytics & Insights' },
    { icon: Shield, text: 'Bank-level Security' },
    { icon: Target, text: 'Goal Tracking' },
    { icon: CreditCard, text: 'Multi-account Support' },
]

export function LoginPage() {
    const navigate = useNavigate()
    const location = useLocation()
    const [showPassword, setShowPassword] = useState(false)
    const { login, isLoading, error, clearError, user } = useAuthStore()

    // Refs for GSAP animations
    const containerRef = useRef(null)
    const leftPanelRef = useRef(null)
    const rightPanelRef = useRef(null)
    const logoRef = useRef(null)
    const floatingCardsRef = useRef(null)

    const from = location.state?.from?.pathname || '/app/dashboard'

    // Redirect if already logged in
    useEffect(() => {
        if (user) {
            navigate(from, { replace: true })
        }
    }, [user, navigate, from])

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
            gsap.set('.feature-item', { opacity: 0, x: -30 })
            gsap.set('.floating-card', { opacity: 0, scale: 0.8 })

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
                stagger: 0.1,
                ease: 'power3.out'
            }, '-=0.3')

            // Features stagger
            .to('.feature-item', {
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
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    })

    const onSubmit = async (data) => {
        const result = await login(data.email, data.password)
        if (result.success) {
            navigate(from, { replace: true })
        }
    }

    return (
        <div ref={containerRef} className="min-h-screen min-h-dvh flex">
            {/* Left Panel - Branding & Features */}
            <div
                ref={leftPanelRef}
                className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative bg-gradient-to-br from-blue-600 via-blue-700 to-emerald-600 overflow-hidden"
            >
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:48px_48px]" />

                {/* Gradient Orbs */}
                <div className="gradient-orb absolute top-1/4 -left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
                <div className="gradient-orb absolute bottom-1/4 right-0 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl" />
                <div className="gradient-orb absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-3xl" />

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
                    {/* Logo */}
                    <div>
                        <Logo linkToHome size="lg" textGradient={false} />
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 flex flex-col justify-center py-12">
                        <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
                            Take Control of Your{' '}
                            <span className="text-emerald-300">Financial Future</span>
                        </h1>
                        <p className="text-lg text-white/70 mb-10 max-w-md">
                            Join thousands of users who trust WealthWise to track spending, 
                            manage budgets, and achieve their financial goals.
                        </p>

                        {/* Features List */}
                        <div className="space-y-4">
                            {features.map((feature, index) => (
                                <div
                                    key={feature.text}
                                    className="feature-item flex items-center gap-4"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                                        <feature.icon className="w-5 h-5 text-emerald-300" />
                                    </div>
                                    <span className="text-white/90 font-medium">{feature.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Floating Cards */}
                    <div ref={floatingCardsRef} className="absolute right-8 top-1/2 -translate-y-1/2 hidden xl:block">
                        {/* Balance Card */}
                        <div className="floating-card absolute -top-32 right-0 w-56 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-2xl">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs text-white/60">Total Balance</span>
                                <TrendingUp className="w-4 h-4 text-emerald-300" />
                            </div>
                            <div className="text-2xl font-bold text-white">$24,562.00</div>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="text-xs px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-full">
                                    +12.5%
                                </span>
                            </div>
                        </div>

                        {/* Savings Card */}
                        <div className="floating-card absolute top-20 -right-4 w-48 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-2xl">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                                    <Target className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <div className="text-xs text-white/60">Vacation Fund</div>
                                    <div className="text-sm font-semibold text-white">48%</div>
                                </div>
                            </div>
                            <div className="mt-3 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full w-[48%] bg-gradient-to-r from-purple-400 to-pink-400 rounded-full" />
                            </div>
                        </div>

                        {/* Budget Card */}
                        <div className="floating-card absolute top-48 right-8 w-44 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-2xl">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center">
                                    <PiggyBank className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <div className="text-xs text-white/60">Budget</div>
                                    <div className="text-sm font-semibold text-emerald-300">On Track</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Stats */}
                    <div className="flex items-center gap-8 text-white/60 text-sm">
                        <div>
                            <span className="text-white font-semibold">10K+</span> Users
                        </div>
                        <div>
                            <span className="text-white font-semibold">$2M+</span> Tracked
                        </div>
                        <div>
                            <span className="text-white font-semibold">4.9</span> Rating
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel - Login Form */}
            <div
                ref={rightPanelRef}
                className="w-full lg:w-1/2 xl:w-[45%] flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-background relative"
            >
                {/* Background subtle gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-emerald-500/5 pointer-events-none" />

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
                <div className="w-full max-w-md relative z-10 mt-16 lg:mt-0">
                    {/* Header */}
                    <div className="text-center lg:text-left mb-8">
                        <div
                            ref={logoRef}
                            className="lg:hidden inline-flex items-center justify-center mb-6"
                        >
                            <LogoIcon size="xl" />
                        </div>

                        <h1 className="form-element text-3xl font-bold text-white mb-2">
                            Welcome Back
                        </h1>
                        <p className="form-element text-muted-foreground">
                            Sign in to continue to your dashboard
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {/* Global Error */}
                        {error && (
                            <div className="form-element p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3">
                                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                {error}
                            </div>
                        )}

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
                                    className="auth-input pl-12 h-12 bg-white/5 border-white/10 rounded-xl text-white placeholder:text-muted-foreground focus:border-blue-500/50 focus:bg-white/10 transition-all duration-300"
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
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="text-sm font-medium text-white/80">
                                    Password
                                </label>
                                <button
                                    type="button"
                                    className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                                >
                                    Forgot password?
                                </button>
                            </div>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter your password"
                                    className="auth-input pl-12 pr-12 h-12 bg-white/5 border-white/10 rounded-xl text-white placeholder:text-muted-foreground focus:border-blue-500/50 focus:bg-white/10 transition-all duration-300"
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
                            {errors.password && (
                                <p className="text-sm text-red-400 flex items-center gap-2">
                                    <span className="w-1 h-1 bg-red-400 rounded-full" />
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="form-element pt-2">
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-12 bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        Sign In
                                        <ArrowRight className="ml-2 w-5 h-5" />
                                    </>
                                )}
                            </Button>
                        </div>

                        {/* Divider */}
                        <div className="form-element relative py-4">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/10" />
                            </div>
                            <div className="relative flex justify-center">
                                <span className="bg-background px-4 text-sm text-muted-foreground">
                                    New to WealthWise?
                                </span>
                            </div>
                        </div>

                        {/* Sign Up Link */}
                        <div className="form-element">
                            <Link to="/register">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full h-12 bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 text-white font-medium rounded-xl transition-all duration-300"
                                >
                                    Create an Account
                                </Button>
                            </Link>
                        </div>
                    </form>

                    {/* Mobile Features */}
                    <div className="lg:hidden mt-10 pt-8 border-t border-white/10">
                        <p className="text-sm text-muted-foreground text-center mb-4">
                            Trusted by <span className="text-white font-medium">10,000+</span> users
                        </p>
                        <div className="flex justify-center gap-6 text-muted-foreground">
                            <Shield className="w-5 h-5" />
                            <BarChart3 className="w-5 h-5" />
                            <Target className="w-5 h-5" />
                            <CreditCard className="w-5 h-5" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
