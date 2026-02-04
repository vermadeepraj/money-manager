import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Star, Quote } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const testimonials = [
    {
        id: 1,
        name: 'Sarah Mitchell',
        role: 'Freelance Designer',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
        quote: "WealthWise completely transformed how I manage my freelance income. I can finally see where every dollar goes and have saved more in 3 months than I did all last year!",
        rating: 5,
        highlight: 'saved more in 3 months'
    },
    {
        id: 2,
        name: 'Michael Chen',
        role: 'Software Engineer',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        quote: "The budgeting features are incredible. I set up my categories once and now everything is automatic. It's like having a personal finance assistant.",
        rating: 5,
        highlight: 'personal finance assistant'
    },
    {
        id: 3,
        name: 'Emily Rodriguez',
        role: 'Small Business Owner',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        quote: "Managing both personal and business finances in one app with separate divisions is a game-changer. The insights have helped me make smarter decisions.",
        rating: 5,
        highlight: 'game-changer'
    }
]

export function Testimonials() {
    const sectionRef = useRef(null)
    const cardsRef = useRef([])

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.testimonials-title', {
                scrollTrigger: {
                    trigger: '.testimonials-title',
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                opacity: 0,
                y: 50,
                duration: 0.8,
                ease: 'power3.out'
            })

            cardsRef.current.forEach((card, index) => {
                gsap.from(card, {
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse'
                    },
                    opacity: 0,
                    y: 60,
                    rotateY: -10,
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
            id="testimonials"
            ref={sectionRef}
            className="relative py-24 lg:py-32 overflow-hidden"
        >
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-500/5 to-transparent pointer-events-none" />
            
            {/* Decorative Quote Icons */}
            <div className="absolute top-20 left-10 opacity-5">
                <Quote className="w-32 h-32 text-orange-500" />
            </div>
            <div className="absolute bottom-20 right-10 opacity-5 rotate-180">
                <Quote className="w-32 h-32 text-orange-500" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="testimonials-title text-center max-w-3xl mx-auto mb-16">
                    <span className="inline-block px-4 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-full text-sm font-medium text-orange-400 mb-4">
                        Testimonials
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                        Loved by{' '}
                        <span className="bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
                            Thousands
                        </span>
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        See what our users have to say about their journey to financial freedom with WealthWise.
                    </p>
                </div>

                {/* Testimonials Grid */}
                <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={testimonial.id}
                            ref={el => cardsRef.current[index] = el}
                            className="group relative bg-card/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 lg:p-8 hover:bg-card/80 hover:border-white/20 transition-all duration-300 hover:shadow-xl"
                        >
                            {/* Quote Icon */}
                            <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                                <Quote className="w-5 h-5 text-white" />
                            </div>

                            {/* Rating */}
                            <div className="flex gap-1 mb-4">
                                {Array.from({ length: testimonial.rating }).map((_, i) => (
                                    <Star
                                        key={i}
                                        className="w-5 h-5 fill-yellow-400 text-yellow-400"
                                    />
                                ))}
                            </div>

                            {/* Quote */}
                            <p className="text-muted-foreground leading-relaxed mb-6">
                                "{testimonial.quote.split(testimonial.highlight).map((part, i, arr) => (
                                    <span key={i}>
                                        {part}
                                        {i < arr.length - 1 && (
                                            <span className="text-orange-400 font-medium">
                                                {testimonial.highlight}
                                            </span>
                                        )}
                                    </span>
                                ))}"
                            </p>

                            {/* Author */}
                            <div className="flex items-center gap-4">
                                <img
                                    src={testimonial.avatar}
                                    alt={testimonial.name}
                                    className="w-12 h-12 rounded-full object-cover border-2 border-white/20"
                                />
                                <div>
                                    <h4 className="font-semibold text-white">
                                        {testimonial.name}
                                    </h4>
                                    <p className="text-sm text-muted-foreground">
                                        {testimonial.role}
                                    </p>
                                </div>
                            </div>

                            {/* Hover Glow */}
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-500/0 to-yellow-500/0 group-hover:from-orange-500/5 group-hover:to-yellow-500/5 transition-all duration-300 pointer-events-none" />
                        </div>
                    ))}
                </div>

                {/* Trust Indicators */}
                <div className="mt-16 text-center">
                    <p className="text-muted-foreground mb-6">Trusted by users worldwide</p>
                    <div className="flex flex-wrap justify-center gap-8 lg:gap-16 opacity-60">
                        <div className="text-2xl font-bold text-white">
                            <span className="text-blue-400">10,000+</span> Users
                        </div>
                        <div className="text-2xl font-bold text-white">
                            <span className="text-emerald-400">$2M+</span> Tracked
                        </div>
                        <div className="text-2xl font-bold text-white">
                            <span className="text-orange-400">4.9</span> Rating
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
