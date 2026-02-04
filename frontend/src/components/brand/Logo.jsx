import { Link } from 'react-router-dom'
import { cn } from '../../lib/utils'

/**
 * WealthWise Logo Component
 * 
 * @param {Object} props
 * @param {'icon' | 'full'} props.variant - Logo variant (default: 'full')
 * @param {'sm' | 'md' | 'lg' | 'xl'} props.size - Logo size (default: 'md')
 * @param {boolean} props.showText - Whether to show wordmark (default: true for 'full' variant)
 * @param {boolean} props.animated - Enable hover animations (default: true)
 * @param {boolean} props.linkToHome - Wrap in Link to "/" (default: false)
 * @param {string} props.className - Additional container classes
 * @param {string} props.iconClassName - Additional icon classes
 * @param {string} props.textClassName - Additional text classes
 */

// Size configurations
const sizes = {
    sm: {
        icon: 'w-8 h-8',
        iconRadius: 'rounded-lg',
        text: 'text-lg',
        gap: 'gap-2',
        strokeWidth: 2.5,
    },
    md: {
        icon: 'w-10 h-10',
        iconRadius: 'rounded-xl',
        text: 'text-xl',
        gap: 'gap-2.5',
        strokeWidth: 2.5,
    },
    lg: {
        icon: 'w-12 h-12',
        iconRadius: 'rounded-xl',
        text: 'text-2xl',
        gap: 'gap-3',
        strokeWidth: 3,
    },
    xl: {
        icon: 'w-16 h-16',
        iconRadius: 'rounded-2xl',
        text: 'text-3xl',
        gap: 'gap-4',
        strokeWidth: 3.5,
    },
}

/**
 * The WealthWise Logo Icon (SVG)
 * A rounded square with a smooth upward trend curve
 */
function LogoIcon({ size = 'md', className, animated = true }) {
    const config = sizes[size]
    
    return (
        <div
            className={cn(
                config.icon,
                config.iconRadius,
                'relative flex items-center justify-center overflow-hidden',
                'bg-gradient-to-br from-blue-500 to-emerald-500',
                'shadow-lg shadow-blue-500/25',
                animated && 'transition-transform duration-300 group-hover:scale-105',
                className
            )}
        >
            {/* SVG Trend Line */}
            <svg
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full p-2"
            >
                {/* Gradient definition for the glow effect */}
                <defs>
                    <linearGradient id="trendGlow" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
                        <stop offset="100%" stopColor="rgba(255,255,255,0.8)" />
                    </linearGradient>
                    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="1" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>
                
                {/* Main trend line - smooth curve going up */}
                <path
                    d="M8 36 C 14 36, 18 28, 24 24 S 34 12, 40 8"
                    stroke="white"
                    strokeWidth={config.strokeWidth}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                    filter="url(#glow)"
                    className={cn(animated && 'transition-all duration-300')}
                />
                
                {/* Arrow head at the end */}
                <path
                    d="M36 6 L40 8 L38 12"
                    stroke="white"
                    strokeWidth={config.strokeWidth}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                />
                
                {/* Subtle dot at the start */}
                <circle
                    cx="8"
                    cy="36"
                    r="2"
                    fill="white"
                    opacity="0.6"
                />
            </svg>
            
            {/* Subtle inner glow overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/10 pointer-events-none" />
        </div>
    )
}

/**
 * The WealthWise Wordmark (Text)
 */
function LogoText({ size = 'md', className, gradient = true }) {
    const config = sizes[size]
    
    return (
        <span
            className={cn(
                config.text,
                'font-bold tracking-tight',
                gradient
                    ? 'bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent'
                    : 'text-white',
                className
            )}
        >
            WealthWise
        </span>
    )
}

/**
 * Main Logo Component
 */
export function Logo({
    variant = 'full',
    size = 'md',
    showText = true,
    animated = true,
    linkToHome = false,
    className,
    iconClassName,
    textClassName,
    textGradient = true,
}) {
    const config = sizes[size]
    const isIconOnly = variant === 'icon' || !showText

    const LogoContent = (
        <div
            className={cn(
                'group flex items-center',
                config.gap,
                className
            )}
        >
            <LogoIcon 
                size={size} 
                className={iconClassName} 
                animated={animated} 
            />
            {!isIconOnly && (
                <LogoText 
                    size={size} 
                    className={textClassName} 
                    gradient={textGradient} 
                />
            )}
        </div>
    )

    if (linkToHome) {
        return (
            <Link to="/" className="inline-flex">
                {LogoContent}
            </Link>
        )
    }

    return LogoContent
}

/**
 * Standalone exports for flexible usage
 */
export { LogoIcon, LogoText }

/**
 * Icon-only variant shorthand
 */
export function LogoMark(props) {
    return <Logo variant="icon" {...props} />
}

export default Logo
