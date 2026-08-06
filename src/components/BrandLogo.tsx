interface BrandLogoProps {
    size?: number;
    className?: string;
}

export default function BrandLogo({ size = 48, className }: BrandLogoProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 512 512"
            fill="none"
            className={className}
            role="img"
            aria-label="Coffee & Code"
        >
            {/* Steam curls (code-inspired) */}
            <path
                className="brand-steam"
                d="M205 218 Q 189 200 205 182 Q 219 164 203 148"
                stroke="#2dd4bf"
                strokeWidth="14"
                strokeLinecap="round"
                fill="none"
            />
            <path
                className="brand-steam brand-steam-delay"
                d="M272 218 Q 288 200 272 182 Q 258 164 274 148"
                stroke="#2dd4bf"
                strokeWidth="14"
                strokeLinecap="round"
                fill="none"
            />
            {/* Left curly brace */}
            <path
                d="M20 8 C 6 8 0 18 0 28 C 0 38 8 44 20 50 C 8 56 0 62 0 72 C 0 82 6 92 20 92"
                stroke="#2dd4bf"
                strokeWidth="14"
                strokeLinecap="round"
                fill="none"
                transform="translate(108 236)"
            />
            {/* Right curly brace */}
            <path
                d="M20 8 C 6 8 0 18 0 28 C 0 38 8 44 20 50 C 8 56 0 62 0 72 C 0 82 6 92 20 92"
                stroke="#2dd4bf"
                strokeWidth="14"
                strokeLinecap="round"
                fill="none"
                transform="translate(372 236) scale(-1 1)"
            />
            {/* Cup handle */}
            <path
                d="M318 262 h 22 a 20 20 0 0 1 0 40 h -22"
                stroke="#f2a63b"
                strokeWidth="16"
                strokeLinecap="round"
                fill="none"
            />
            {/* Cup body */}
            <rect x="170" y="232" width="150" height="124" rx="28" fill="url(#cafeGrad)" />
            {/* Latte foam */}
            <rect x="170" y="232" width="150" height="24" rx="12" fill="#f6efe3" />
            <defs>
                <linearGradient id="cafeGrad" x1="170" y1="232" x2="320" y2="356" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#ffbe5c" />
                    <stop offset="1" stopColor="#d97f1e" />
                </linearGradient>
            </defs>
        </svg>
    );
}
