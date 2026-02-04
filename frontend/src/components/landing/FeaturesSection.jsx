import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
    LayoutDashboard,
    Receipt,
    PiggyBank,
    Target,
    Wallet,
    TrendingUp
} from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const features = [
    {
        icon: LayoutDashboard,
        title: 'Smart Dashboard',
        description: 'Get a complete overview of your finances at a glance with beautiful charts and insights.',
        color: 'from-blue-500 to-blue-600'
    },
    {
        icon: Receipt,
        title: 'Transaction Tracking',
        description: 'Track every income and expense with smart categorization and powerful filters.',
        color: 'from-emerald-500 to-emerald-600'
    },
    {
        icon: PiggyBank,
        title: 'Budget Management',
        description: 'Set spending limits for categories and stay on track with real-time alerts.',
        color: 'from-purple-500 to-purple-600'
    },
    {
        icon: Target,
        title: 'Savings Goals',
        description: 'Save towards your dreams with progress tracking and milestone celebrations.',
        color: 'from-orange-500 to-orange-600'
    },
    {
        icon: Wallet,
        title: 'Multiple Accounts',
        description: 'Manage bank accounts, cash, and digital wallets all in one place.',
        color: 'from-pink-500 to-pink-600'
    },
    {
        icon: TrendingUp,
        title: 'Smart Insights',
        description: 'AI-powered insights help you understand spending patterns and save more.',
        color: 'from-cyan-500 to-cyan-600'
    }
]

export function FeaturesSection() {
    const sectionRef = useRef(null)
    const cardsRef = useRef([])

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Animate section title
            gsap.from('.features-title', {
                scrollTrigger: {
                    trigger: '.features-title',
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                opacity: 0,
                y: 50,
                duration: 0.8,
                ease: 'power3.out'
            })

            // Animate feature cards
            cardsRef.current.forEach((card, index) => {
                gsap.from(card, {
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse'
                    },
                    opacity: 0,
                    y: 60,
                    duration: 0.6,
                    delay: index * 0.1,
                    ease: 'power3.out'
                })
            })
        }, sectionRef)

        return () => ctx.revert()
    }, [])

    return (
        <section
            id="features"
            ref={sectionRef}
            className="relative py-24 lg:py-32"
        >
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="features-title text-center max-w-3xl mx-auto mb-16">
                    <span className="inline-block px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-sm font-medium text-blue-400 mb-4">
                        Features
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                        Everything You Need to{' '}
                        <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                            Master Your Money
                        </span>
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        Powerful tools designed to help you track spending, save more, and reach your financial goals faster.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={feature.title}
                            ref={el => cardsRef.current[index] = el}
                            className="group relative bg-card/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 lg:p-8 hover:bg-card/80 hover:border-white/20 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5"
                        >
                            {/* Icon */}
                            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                <feature.icon className="w-7 h-7 text-white" />
                            </div>

                            {/* Content */}
                            <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-blue-400 transition-colors">
                                {feature.title}
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {feature.description}
                            </p>

                            {/* Hover Glow Effect */}
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/0 to-emerald-500/0 group-hover:from-blue-500/5 group-hover:to-emerald-500/5 transition-all duration-300 pointer-events-none" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
