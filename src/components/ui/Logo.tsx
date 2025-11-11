/**
 * Logo Component
 * Logo riutilizzabile dell'app con responsive scaling
 */

import { Link } from 'react-router-dom'

interface LogoProps {
  className?: string
}

export default function Logo({ className = '' }: LogoProps) {
  return (
    <Link to="/" className={`flex items-center ${className}`}>
      {/* Logo Text - Responsive sizing 20px→14px */}
      <span className="font-bold text-gray-900
                     text-[clamp(14px,1.5vw,20px)]
                     transition-all duration-200
                     hover:text-orange-500"
            style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}>
        Take Your Trade
      </span>
    </Link>
  )
}

