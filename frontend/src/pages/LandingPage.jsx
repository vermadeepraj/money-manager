import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
    Navbar,
    HeroSection,
    FeaturesSection,
    HowItWorks,
    Screenshots,
    Testimonials,
    FAQ,
    CTASection,
    Footer
} from '../components/landing'

// Register GSAP plugin
gsap.registerPlugin(ScrollTrigger)

export function LandingPage() {
    useEffect(() => {
        // Refresh ScrollTrigger when page loads to ensure proper calculations
        ScrollTrigger.refresh()

        // Cleanup on unmount
        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill())
        }
    }, [])

    return (
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
            {/* Navigation */}
            <Navbar />

            {/* Main Content */}
            <main>
                {/* Hero Section */}
                <HeroSection />

                {/* Features Section */}
                <FeaturesSection />

                {/* How It Works */}
                <HowItWorks />

                {/* Screenshots Gallery */}
                <Screenshots />

                {/* Testimonials */}
                <Testimonials />

                {/* FAQ */}
                <FAQ />

                {/* Call to Action */}
                <CTASection />
            </main>

            {/* Footer */}
            <Footer />
        </div>
    )
}

export default LandingPage
