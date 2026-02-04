import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const screenshots = [
    {
        id: 1,
        title: 'Dashboard Overview',
        description: 'See your complete financial picture at a glance',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop',
        alt: 'WealthWise Dashboard showing financial overview'
    },
    {
        id: 2,
        title: 'Transaction History',
        description: 'Track every transaction with smart categorization',
        image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&h=800&fit=crop',
        alt: 'Transaction history with filters and categories'
    },
    {
        id: 3,
        title: 'Budget Management',
        description: 'Set and monitor budgets for each category',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop',
        alt: 'Budget tracking interface'
    },
    {
        id: 4,
        title: 'Savings Goals',
        description: 'Visualize progress towards your financial goals',
        image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=1200&h=800&fit=crop',
        alt: 'Savings goals with progress bars'
    },
    {
        id: 5,
        title: 'Analytics & Insights',
        description: 'Understand your spending patterns with detailed charts',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop',
        alt: 'Analytics dashboard with charts'
    }
]

export function Screenshots() {
    const sectionRef = useRef(null)
    const [activeIndex, setActiveIndex] = useState(0)
    const [isAnimating, setIsAnimating] = useState(false)

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.screenshots-title', {
                scrollTrigger: {
                    trigger: '.screenshots-title',
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                opacity: 0,
                y: 50,
                duration: 0.8,
                ease: 'power3.out'
            })

            gsap.from('.screenshots-gallery', {
                scrollTrigger: {
                    trigger: '.screenshots-gallery',
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                opacity: 0,
                y: 60,
                duration: 0.8,
                ease: 'power3.out'
            })
        }, sectionRef)

        return () => ctx.revert()
    }, [])

    const goToSlide = (index) => {
        if (isAnimating || index === activeIndex) return
        setIsAnimating(true)
        setActiveIndex(index)
        setTimeout(() => setIsAnimating(false), 500)
    }

    const nextSlide = () => {
        goToSlide((activeIndex + 1) % screenshots.length)
    }

    const prevSlide = () => {
        goToSlide((activeIndex - 1 + screenshots.length) % screenshots.length)
    }

    return (
        <section
            id="screenshots"
            ref={sectionRef}
            className="relative py-24 lg:py-32 overflow-hidden"
        >
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="screenshots-title text-center max-w-3xl mx-auto mb-16">
                    <span className="inline-block px-4 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-full text-sm font-medium text-purple-400 mb-4">
                        App Preview
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                        See WealthWise{' '}
                        <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                            in Action
                        </span>
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        A beautiful, intuitive interface designed to make managing money actually enjoyable.
                    </p>
                </div>

                {/* Gallery */}
                <div className="screenshots-gallery relative">
                    {/* Main Display */}
                    <div className="relative bg-card/30 backdrop-blur-sm border border-white/10 rounded-3xl p-3 lg:p-4 mb-8">
                        {/* Browser Frame */}
                        <div className="bg-card/50 rounded-2xl overflow-hidden">
                            {/* Browser Bar */}
                            <div className="flex items-center gap-2 px-4 py-3 bg-black/30 border-b border-white/10">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                                </div>
                                <div className="flex-1 flex justify-center">
                                    <div className="px-4 py-1 bg-white/5 rounded-lg text-xs text-muted-foreground">
                                        app.wealthwise.com
                                    </div>
                                </div>
                                <Maximize2 className="w-4 h-4 text-muted-foreground" />
                            </div>

                            {/* Screenshot Display */}
                            <div className="relative aspect-video overflow-hidden">
                                {screenshots.map((screenshot, index) => (
                                    <div
                                        key={screenshot.id}
                                        className={`absolute inset-0 transition-all duration-500 ${
                                            index === activeIndex
                                                ? 'opacity-100 scale-100'
                                                : 'opacity-0 scale-105'
                                        }`}
                                    >
                                        <img
                                            src={screenshot.image}
                                            alt={screenshot.alt}
                                            className="w-full h-full object-cover"
                                        />
                                        {/* Overlay Gradient */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                        
                                        {/* Caption */}
                                        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
                                            <h3 className="text-xl lg:text-2xl font-semibold text-white mb-2">
                                                {screenshot.title}
                                            </h3>
                                            <p className="text-white/70">
                                                {screenshot.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Navigation Arrows */}
                        <button
                            onClick={prevSlide}
                            className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                            aria-label="Previous screenshot"
                        >
                            <ChevronLeft className="w-6 h-6 text-white" />
                        </button>
                        <button
                            onClick={nextSlide}
                            className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                            aria-label="Next screenshot"
                        >
                            <ChevronRight className="w-6 h-6 text-white" />
                        </button>
                    </div>

                    {/* Thumbnail Navigation */}
                    <div className="flex justify-center gap-3">
                        {screenshots.map((screenshot, index) => (
                            <button
                                key={screenshot.id}
                                onClick={() => goToSlide(index)}
                                className={`group relative w-20 h-14 lg:w-24 lg:h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                                    index === activeIndex
                                        ? 'border-purple-500 scale-105'
                                        : 'border-white/10 hover:border-white/30'
                                }`}
                                aria-label={`Go to ${screenshot.title}`}
                            >
                                <img
                                    src={screenshot.image}
                                    alt=""
                                    className="w-full h-full object-cover"
                                />
                                <div className={`absolute inset-0 transition-opacity duration-300 ${
                                    index === activeIndex ? 'bg-purple-500/20' : 'bg-black/40 group-hover:bg-black/20'
                                }`} />
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
