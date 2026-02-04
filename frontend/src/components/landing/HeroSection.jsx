import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ArrowRight, TrendingUp, PiggyBank, Wallet, Target } from 'lucide-react'
import { Button } from '../ui/button'

export function HeroSection() {
    const heroRef = useRef(null)
    const titleRef = useRef(null)
    const subtitleRef = useRef(null)
    const ctaRef = useRef(null)
    const floatingCardsRef = useRef(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Initial states
            gsap.set([titleRef.current, subtitleRef.current, ctaRef.current], {
                opacity: 0,
                y: 50
            })

            // Timeline for text animations
            const tl = gsap.timeline({ delay: 0.3 })

            tl.to(titleRef.current, {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: 'power3.out'
            })
            .to(subtitleRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: 'power3.out'
            }, '-=0.5')
            .to(ctaRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: 'power3.out'
            }, '-=0.4')

            // Floating cards animation
            const cards = floatingCardsRef.current?.querySelectorAll('.floating-card')
            if (cards) {
                cards.forEach((card, index) => {
                    gsap.set(card, { opacity: 0, scale: 0.8 })
                    
                    gsap.to(card, {
                        opacity: 1,
                        scale: 1,
                        duration: 0.8,
                        delay: 0.5 + index * 0.15,
                        ease: 'back.out(1.7)'
                    })

                    // Continuous floating animation
                    gsap.to(card, {
                        y: '+=20',
                        duration: 2 + index * 0.5,
                        ease: 'sine.inOut',
                        yoyo: true,
                        repeat: -1,
                        delay: index * 0.3
                    })
                })
            }

            // Background gradient orbs animation
            const orbs = heroRef.current?.querySelectorAll('.gradient-orb')
            if (orbs) {
                orbs.forEach((orb, index) => {
                    gsap.to(orb, {
                        x: `+=${30 + index * 20}`,
                        y: `+=${20 + index * 15}`,
                        duration: 4 + index,
                        ease: 'sine.inOut',
                        yoyo: true,
                        repeat: -1
                    })
                })
            }
        }, heroRef)

        return () => ctx.revert()
    }, [])

    return (
        <section
            ref={heroRef}
            className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
        >
            {/* Background Gradient Orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="gradient-orb absolute top-1/4 -left-32 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
                <div className="gradient-orb absolute bottom-1/4 -right-32 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl" />
                <div className="gradient-orb absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl" />
            </div>

            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Text Content */}
                    <div className="text-center lg:text-left">
                        <h1
                            ref={titleRef}
                            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight"
                        >
                            <span className="bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent">
                                Take Control of
                            </span>
                            <br />
                            <span className="bg-gradient-to-r from-blue-400 via-emerald-400 to-blue-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                                Your Finances
                            </span>
                        </h1>

                        <p
                            ref={subtitleRef}
                            className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0"
                        >
                            Track, budget, and grow your wealth with WealthWise. 
                            The smart money management app that helps you achieve your financial goals.
                        </p>

                        <div
                            ref={ctaRef}
                            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                        >
                            <Link to="/register">
                                <Button
                                    size="lg"
                                    className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 text-lg px-8"
                                >
                                    Get Started Free
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                            <a href="#how-it-works">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="w-full sm:w-auto border-white/20 hover:bg-white/5 text-lg px-8"
                                >
                                    Learn More
                                </Button>
                            </a>
                        </div>

                        {/* Stats */}
                        <div className="mt-12 grid grid-cols-3 gap-8 max-w-md mx-auto lg:mx-0">
                            <div>
                                <div className="text-2xl sm:text-3xl font-bold text-white">10K+</div>
                                <div className="text-sm text-muted-foreground">Active Users</div>
                            </div>
                            <div>
                                <div className="text-2xl sm:text-3xl font-bold text-white">$2M+</div>
                                <div className="text-sm text-muted-foreground">Tracked</div>
                            </div>
                            <div>
                                <div className="text-2xl sm:text-3xl font-bold text-white">4.9</div>
                                <div className="text-sm text-muted-foreground">User Rating</div>
                            </div>
                        </div>
                    </div>

                    {/* Floating Cards */}
                    <div ref={floatingCardsRef} className="relative h-[400px] lg:h-[500px] hidden lg:block">
                        {/* Main Dashboard Card */}
                        <div className="floating-card absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 bg-card/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm text-muted-foreground">Total Balance</span>
                                <TrendingUp className="w-5 h-5 text-emerald-400" />
                            </div>
                            <div className="text-3xl font-bold text-white">$24,562.00</div>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="text-xs px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-full">
                                    +12.5%
                                </span>
                                <span className="text-xs text-muted-foreground">vs last month</span>
                            </div>
                            <div className="mt-4 h-16 bg-gradient-to-r from-blue-500/20 to-emerald-500/20 rounded-lg flex items-end px-2 pb-2">
                                <div className="flex-1 h-8 bg-blue-500/50 rounded" />
                                <div className="flex-1 h-12 bg-emerald-500/50 rounded ml-1" />
                                <div className="flex-1 h-6 bg-blue-500/50 rounded ml-1" />
                                <div className="flex-1 h-10 bg-emerald-500/50 rounded ml-1" />
                                <div className="flex-1 h-14 bg-blue-500/50 rounded ml-1" />
                            </div>
                        </div>

                        {/* Savings Goal Card */}
                        <div className="floating-card absolute top-10 right-0 w-56 bg-card/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                    <Target className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-white">Vacation Fund</div>
                                    <div className="text-xs text-muted-foreground">$2,400 / $5,000</div>
                                </div>
                            </div>
                            <div className="mt-3 h-2 bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full w-[48%] bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
                            </div>
                        </div>

                        {/* Budget Card */}
                        <div className="floating-card absolute bottom-10 left-0 w-52 bg-card/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                                    <PiggyBank className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-white">Monthly Budget</div>
                                    <div className="text-xs text-emerald-400">On Track</div>
                                </div>
                            </div>
                            <div className="mt-3 text-lg font-semibold text-white">$1,250 left</div>
                        </div>

                        {/* Wallet Card */}
                        <div className="floating-card absolute bottom-32 right-10 w-48 bg-card/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                                    <Wallet className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <div className="text-xs text-muted-foreground">Cash</div>
                                    <div className="text-sm font-semibold text-white">$850.00</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center pt-2">
                    <div className="w-1.5 h-3 bg-white/40 rounded-full animate-pulse" />
                </div>
            </div>
        </section>
    )
}
