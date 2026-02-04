import { Link } from 'react-router-dom'
import {
    Twitter,
    Github,
    Linkedin,
    Mail,
    Heart
} from 'lucide-react'
import { Logo } from '../brand'

const footerLinks = {
    product: {
        title: 'Product',
        links: [
            { label: 'Features', href: '#features' },
            { label: 'How It Works', href: '#how-it-works' },
            { label: 'Screenshots', href: '#screenshots' },
            { label: 'Pricing', href: '#' }
        ]
    },
    company: {
        title: 'Company',
        links: [
            { label: 'About Us', href: '#' },
            { label: 'Blog', href: '#' },
            { label: 'Careers', href: '#' },
            { label: 'Contact', href: '#' }
        ]
    },
    resources: {
        title: 'Resources',
        links: [
            { label: 'Help Center', href: '#' },
            { label: 'FAQ', href: '#faq' },
            { label: 'Community', href: '#' },
            { label: 'API Docs', href: '#' }
        ]
    },
    legal: {
        title: 'Legal',
        links: [
            { label: 'Privacy Policy', href: '#' },
            { label: 'Terms of Service', href: '#' },
            { label: 'Cookie Policy', href: '#' },
            { label: 'Security', href: '#' }
        ]
    }
}

const socialLinks = [
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Github, href: 'https://github.com', label: 'GitHub' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: Mail, href: 'mailto:hello@wealthwise.com', label: 'Email' }
]

export function Footer() {
    const currentYear = new Date().getFullYear()

    const scrollToSection = (href) => {
        if (href.startsWith('#') && href !== '#') {
            const element = document.querySelector(href)
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' })
            }
        }
    }

    return (
        <footer className="relative bg-card/30 border-t border-white/10">
            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-2 md:grid-cols-6 gap-8 lg:gap-12">
                    {/* Brand Column */}
                    <div className="col-span-2">
                        {/* Logo */}
                        <div className="mb-4">
                            <Logo linkToHome size="md" textGradient={false} />
                        </div>

                        <p className="text-muted-foreground mb-6 max-w-xs">
                            Track, budget, and grow your wealth with the most intuitive personal finance app.
                        </p>

                        {/* Social Links */}
                        <div className="flex gap-3">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg flex items-center justify-center text-muted-foreground hover:text-white transition-all duration-300"
                                    aria-label={social.label}
                                >
                                    <social.icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Link Columns */}
                    {Object.values(footerLinks).map((section) => (
                        <div key={section.title}>
                            <h3 className="font-semibold text-white mb-4">
                                {section.title}
                            </h3>
                            <ul className="space-y-3">
                                {section.links.map((link) => (
                                    <li key={link.label}>
                                        <a
                                            href={link.href}
                                            onClick={(e) => {
                                                if (link.href.startsWith('#')) {
                                                    e.preventDefault()
                                                    scrollToSection(link.href)
                                                }
                                            }}
                                            className="text-muted-foreground hover:text-white transition-colors duration-200"
                                        >
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-muted-foreground">
                            &copy; {currentYear} WealthWise. All rights reserved.
                        </p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                            Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> for better finances
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    )
}
