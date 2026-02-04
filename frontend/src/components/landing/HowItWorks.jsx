import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
    UserPlus,
    CreditCard,
    LineChart,
    Trophy
} from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const steps = [
    {
        icon: UserPlus,
        step: '01',
        title: 'Create Your Account',
        description: 'Sign up in seconds with just your email. No credit card required to get started.',
        color: 'from-blue-500 to-blue-600'
    },
    {
        icon: CreditCard,
        step: '02',
        title: 'Add Your Accounts',
        description: 'Connect your bank accounts, cash wallets, and cards to see all your money in one place.',
        color: 'from-emerald-500 to-emerald-600'
    },
    {
        icon: LineChart,
        step: '03',
        title: 'Track Your Spending',
        description: 'Automatically categorize transactions and see exactly where your money goes each month.',
        color: 'from-purple-500 to-purple-600'
    },
    {
        icon: Trophy,
        step: '04',
        title: 'Reach Your Goals',
        description: 'Set savings goals, create budgets, and watch your wealth grow with smart insights.',
        color: 'from-orange-500 to-orange-600'
    }
]

export function HowItWorks() {
    const sectionRef = useRef(null)
    const stepsRef = useRef([])
    const lineRef = useRef(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Animate section title
            gsap.from('.how-it-works-title', {
                scrollTrigger: {
                    trigger: '.how-it-works-title',
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                opacity: 0,
                y: 50,
                duration: 0.8,
                ease: 'power3.out'
            })

            // Animate the connecting line
            gsap.from(lineRef.current, {
                scrollTrigger: {
                    trigger: lineRef.current,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                scaleX: 0,
                transformOrigin: 'left center',
                duration: 1.5,
                ease: 'power3.out'
            })

            // Animate step cards with stagger
            stepsRef.current.forEach((step, index) => {
                gsap.from(step, {
                    scrollTrigger: {
                        trigger: step,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse'
                    },
                    opacity: 0,
                    y: 80,
                    scale: 0.9,
                    duration: 0.7,
                    delay: index * 0.15,
                    ease: 'power3.out'
                })
            })
        }, sectionRef)

        return () => ctx.revert()
    }, [])

    return (
        <section
            id="how-it-works"
            ref={sectionRef}
            className="relative py-24 lg:py-32 overflow-hidden"
        >
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="how-it-works-title text-center max-w-3xl mx-auto mb-20">
                    <span className="inline-block px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-sm font-medium text-emerald-400 mb-4">
                        How It Works
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                        Start Your Journey to{' '}
                        <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                            Financial Freedom
                        </span>
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        Four simple steps to take control of your finances and build lasting wealth.
                    </p>
                </div>

                {/* Steps Container */}
                <div className="relative">
                    {/* Connecting Line (Desktop) */}
                    <div
                        ref={lineRef}
                        className="hidden lg:block absolute top-24 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-blue-500 via-emerald-500 to-orange-500 opacity-30"
                    />

                    {/* Steps Grid */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
                        {steps.map((step, index) => (
                            <div
                                key={step.step}
                                ref={el => stepsRef.current[index] = el}
                                className="relative group"
                            >
                                {/* Step Card */}
                                <div className="relative bg-card/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 lg:p-8 text-center hover:bg-card/80 hover:border-white/20 transition-all duration-300 hover:shadow-xl">
                                    {/* Step Number Badge */}
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-background border border-white/20 rounded-full flex items-center justify-center text-xs font-bold text-white">
                                        {step.step}
                                    </div>

                                    {/* Icon */}
                                    <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                        <step.icon className="w-8 h-8 text-white" />
                                    </div>

                                    {/* Content */}
                                    <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-emerald-400 transition-colors">
                                        {step.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>

                                {/* Arrow Connector (Mobile/Tablet) */}
                                {index < steps.length - 1 && (
                                    <div className="lg:hidden flex justify-center my-4">
                                        <div className="w-0.5 h-8 bg-gradient-to-b from-white/20 to-transparent" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
