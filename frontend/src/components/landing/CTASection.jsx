import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight, Sparkles, Shield, Zap } from 'lucide-react'
import { Button } from '../ui/button'

gsap.registerPlugin(ScrollTrigger)

const benefits = [
    { icon: Zap, text: 'Get started in minutes' },
    { icon: Shield, text: 'Bank-level security' },
    { icon: Sparkles, text: 'Free forever plan' }
]

export function CTASection() {
    const sectionRef = useRef(null)
    const navigate = useNavigate()

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.cta-content', {
                scrollTrigger: {
                    trigger: '.cta-content',
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                opacity: 0,
                y: 60,
                duration: 0.8,
                ease: 'power3.out'
            })

            // Animate background orbs
            gsap.to('.cta-orb-1', {
                x: 50,
                y: -30,
                duration: 8,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
            })

            gsap.to('.cta-orb-2', {
                x: -40,
                y: 40,
                duration: 10,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
            })
        }, sectionRef)

        return () => ctx.revert()
    }, [])

    return (
        <section
            ref={sectionRef}
            className="relative py-24 lg:py-32 overflow-hidden"
        >
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/10 to-emerald-500/10 pointer-events-none" />

            {/* Animated Orbs */}
            <div className="cta-orb-1 absolute top-1/4 -left-32 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="cta-orb-2 absolute bottom-1/4 -right-32 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* CTA Card */}
                <div className="cta-content relative bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 lg:p-16 text-center overflow-hidden">
                    {/* Inner Glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-emerald-500/10 pointer-events-none" />

                    {/* Content */}
                    <div className="relative z-10">
                        <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-blue-500/20 to-emerald-500/20 border border-white/10 rounded-full text-sm font-medium text-white mb-6">
                            Start Your Free Account Today
                        </span>

                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                            Ready to Take Control of{' '}
                            <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                                Your Finances?
                            </span>
                        </h2>

                        <p className="text-lg lg:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                            Join thousands of users who have transformed their financial lives with WealthWise. 
                            Start tracking, budgeting, and growing your wealth today.
                        </p>

                        {/* Benefits */}
                        <div className="flex flex-wrap justify-center gap-6 mb-10">
                            {benefits.map((benefit) => (
                                <div
                                    key={benefit.text}
                                    className="flex items-center gap-2 text-muted-foreground"
                                >
                                    <benefit.icon className="w-5 h-5 text-emerald-400" />
                                    <span>{benefit.text}</span>
                                </div>
                            ))}
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                onPress={() => navigate('/register')}
                                size="lg"
                                className="bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white font-semibold shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30"
                                endContent={<ArrowRight className="w-5 h-5" />}
                            >
                                Create Free Account
                            </Button>
                            <Button
                                onPress={() => navigate('/login')}
                                size="lg"
                                variant="outline"
                                className="border-white/20 text-white font-semibold"
                            >
                                Sign In
                            </Button>
                        </div>

                        {/* Trust Note */}
                        <p className="mt-8 text-sm text-muted-foreground">
                            No credit card required. Free plan available forever.
                        </p>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-4 right-4 w-20 h-20 border border-white/5 rounded-full" />
                    <div className="absolute bottom-4 left-4 w-32 h-32 border border-white/5 rounded-full" />
                </div>
            </div>
        </section>
    )
}
