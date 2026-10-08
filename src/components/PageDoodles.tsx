const INK = "#292524";

function Sparkle({ className }: { className: string }) {
    return (
        <svg viewBox="-12 -12 24 24" className={className}>
            <path
                d="M0 -10 Q2.8 -2.8 10 0 Q2.8 2.8 0 10 Q-2.8 2.8 -10 0 Q-2.8 -2.8 0 -10 Z"
                fill="#fbbf24"
                stroke={INK}
                strokeWidth="1.4"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function Leaf({ className }: { className: string }) {
    return (
        <svg viewBox="-2 -16 34 32" className={className}>
            <path
                d="M0 0 C8 -14 24 -14 30 0 C22 12 8 12 0 0 Z M2 0 L26 0"
                fill="#65a30d"
                stroke={INK}
                strokeWidth="1.6"
                strokeLinejoin="round"
                strokeLinecap="round"
            />
        </svg>
    );
}

/** Purely decorative doodles that fill the empty margins on wide screens. */
export function PageDoodles() {
    return (
        <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 hidden overflow-hidden xl:block"
        >
            <Sparkle className="absolute left-[6%] top-[14%] h-9 w-9" />
            <Sparkle className="absolute left-[11%] top-[38%] h-5 w-5" />
            <Leaf className="absolute left-[4%] top-[58%] h-14 w-14 -rotate-12" />
            <Leaf className="absolute left-[9%] top-[78%] h-9 w-9 rotate-[30deg]" />
            <Sparkle className="absolute right-[7%] top-[20%] h-7 w-7" />
            <Leaf className="absolute right-[5%] top-[50%] h-12 w-12 rotate-[24deg]" />
            <Sparkle className="absolute right-[10%] top-[74%] h-5 w-5" />
        </div>
    );
}