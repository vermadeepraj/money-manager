import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ChevronDown, HelpCircle } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const faqs = [
    {
        id: 1,
        question: 'Is WealthWise free to use?',
        answer: 'Yes! WealthWise offers a generous free tier that includes unlimited transaction tracking, basic budgeting, and up to 3 savings goals. Premium features are available for power users who want advanced analytics and unlimited everything.'
    },
    {
        id: 2,
        question: 'How secure is my financial data?',
        answer: 'Your security is our top priority. We use bank-level 256-bit encryption, secure JWT authentication, and never store sensitive banking credentials. All data is encrypted both in transit and at rest.'
    },
    {
        id: 3,
        question: 'Can I track both personal and business finances?',
        answer: 'Absolutely! WealthWise features a unique "division" system that lets you separate personal and business (office) finances while keeping everything in one account. Switch between divisions anytime with a single click.'
    },
    {
        id: 4,
        question: 'What happens if I make a mistake in a transaction?',
        answer: 'No worries! You can edit any transaction within 12 hours of creation. We also offer a 30-second undo feature for accidental deletions. Your financial history stays accurate and under your control.'
    },
    {
        id: 5,
        question: 'Does WealthWise work on mobile devices?',
        answer: 'Yes! WealthWise is fully responsive and works beautifully on smartphones, tablets, and desktops. Access your finances anywhere, anytime, from any device with a web browser.'
    },
    {
        id: 6,
        question: 'Can I export my financial data?',
        answer: 'Of course! You can export your transactions, budgets, and reports in various formats including CSV and PDF. Your data belongs to you, and you can take it anywhere.'
    }
]

function FAQItem({ faq, isOpen, onToggle }) {
    return (
        <div className="border border-white/10 rounded-xl overflow-hidden bg-card/30 hover:bg-card/50 transition-colors duration-300">
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between p-5 lg:p-6 text-left"
                aria-expanded={isOpen}
            >
                <span className="font-medium text-white pr-4">
                    {faq.question}
                </span>
                <ChevronDown
                    className={`w-5 h-5 text-muted-foreground transition-transform duration-300 flex-shrink-0 ${
                        isOpen ? 'rotate-180' : ''
                    }`}
                />
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? 'max-h-96' : 'max-h-0'
                }`}
            >
                <div className="px-5 lg:px-6 pb-5 lg:pb-6 text-muted-foreground leading-relaxed">
                    {faq.answer}
                </div>
            </div>
        </div>
    )
}

export function FAQ() {
    const sectionRef = useRef(null)
    const faqsRef = useRef([])
    const [openIndex, setOpenIndex] = useState(0)

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.faq-title', {
                scrollTrigger: {
                    trigger: '.faq-title',
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                opacity: 0,
                y: 50,
                duration: 0.8,
                ease: 'power3.out'
            })

            faqsRef.current.forEach((faq, index) => {
                if (faq) {
                    gsap.from(faq, {
                        scrollTrigger: {
                            trigger: faq,
                            start: 'top 90%',
                            toggleActions: 'play none none reverse'
                        },
                        opacity: 0,
                        x: index % 2 === 0 ? -30 : 30,
                        duration: 0.6,
                        delay: index * 0.1,
                        ease: 'power3.out'
                    })
                }
            })
        }, sectionRef)

        return () => ctx.revert()
    }, [])

    return (
        <section
            id="faq"
            ref={sectionRef}
            className="relative py-24 lg:py-32 overflow-hidden"
        >
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent pointer-events-none" />

            <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="faq-title text-center max-w-3xl mx-auto mb-16">
                    <span className="inline-block px-4 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-sm font-medium text-cyan-400 mb-4">
                        FAQ
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                        Frequently Asked{' '}
                        <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                            Questions
                        </span>
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        Got questions? We've got answers. If you can't find what you're looking for, reach out to our support team.
                    </p>
                </div>

                {/* FAQ List */}
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={faq.id}
                            ref={el => faqsRef.current[index] = el}
                        >
                            <FAQItem
                                faq={faq}
                                isOpen={openIndex === index}
                                onToggle={() => setOpenIndex(openIndex === index ? -1 : index)}
                            />
                        </div>
                    ))}
                </div>

                {/* Contact CTA */}
                <div className="mt-12 text-center">
                    <p className="text-muted-foreground mb-4">
                        Still have questions?
                    </p>
                    <a
                        href="mailto:support@wealthwise.com"
                        className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                    >
                        <HelpCircle className="w-5 h-5" />
                        Contact our support team
                    </a>
                </div>
            </div>
        </section>
    )
}
