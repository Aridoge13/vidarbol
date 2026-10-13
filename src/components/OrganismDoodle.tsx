/**
 * Hand-drawn-style SVG doodles for organisms.
 *
 * Every species in scripts/puzzles.yml should have an explicit entry in
 * DOODLE_BY_ID. The keyword classifier is only a fallback for anything new.
 */

import type { Taxon } from "../types/puzzle";
import type { ReactElement } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type Archetype =
    | "canid"
    | "feline"
    | "bear"
    | "primate"
    | "whale"
    | "rodent"
    | "rabbit"
    | "mustelid"
    | "elephant"
    | "marsupial"
    | "platypus"
    | "turtle"
    | "crocodile"
    | "snake"
    | "lizard"
    | "frog"
    | "fish"
    | "shark"
    | "ray"
    | "lamprey"
    | "bird"
    | "ostrich"
    | "penguin"
    | "parrot"
    | "owl"
    | "butterfly"
    | "moth"
    | "beetle"
    | "fly"
    | "mushroom"
    | "blob";

// ---------------------------------------------------------------------------
// Palette
// ---------------------------------------------------------------------------

const P = {
    amber: "#fbbf24",
    orange: "#fb923c",
    peach: "#fed7aa",
    cream: "#fef3c7",
    tan: "#e7d3b3",
    brown: "#a16207",
    rust: "#c2410c",
    green: "#4ade80",
    forest: "#16a34a",
    lime: "#a3e635",
    blue: "#60a5fa",
    sky: "#7dd3fc",
    navy: "#1e40af",
    teal: "#2dd4bf",
    purple: "#c084fc",
    pink: "#f472b6",
    rose: "#fda4af",
    red: "#ef4444",
    crimson: "#dc2626",
    gray: "#9ca3af",
    lightGray: "#d1d5db",
    pale: "#f1f5f9",
    white: "#ffffff",
    black: "#1c1917",
};

// Common SVG attributes for the sketchy outline style.
const OUT = {
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinejoin: "round" as const,
    strokeLinecap: "round" as const,
};

// ---------------------------------------------------------------------------
// Mammals
// ---------------------------------------------------------------------------

function CanidDoodle() {
    return (
        <>
            <path d="M14 22 L10 6 L26 16 Z" fill={P.amber} {...OUT} />
            <path d="M50 22 L54 6 L38 16 Z" fill={P.amber} {...OUT} />
            <path
                d="M12 32 q0 -12 12 -14 h16 q12 2 12 14 q0 12 -10 16 q-6 2 -10 6 q-4 -4 -10 -6 q-10 -4 -10 -16 z"
                fill={P.amber}
                {...OUT}
            />
            <ellipse cx="32" cy="42" rx="8" ry="6" fill={P.cream} stroke="currentColor" strokeWidth="1.5" />
            <circle cx="32" cy="40" r="2" fill="currentColor" />
            <circle cx="23" cy="30" r="1.8" fill="currentColor" />
            <circle cx="41" cy="30" r="1.8" fill="currentColor" />
            <path d="M32 42 v2" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M28 45 q4 2 8 0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </>
    );
}

function FelineDoodle() {
    return (
        <>
            <path d="M18 24 L14 8 L28 18 Z" fill={P.orange} {...OUT} />
            <path d="M46 24 L50 8 L36 18 Z" fill={P.orange} {...OUT} />
            <path d="M20 22 L18 13 L25 17 Z" fill={P.rose} />
            <path d="M44 22 L46 13 L39 17 Z" fill={P.rose} />
            <circle cx="32" cy="36" r="16" fill={P.orange} {...OUT} />
            <circle cx="25" cy="34" r="1.8" fill="currentColor" />
            <circle cx="39" cy="34" r="1.8" fill="currentColor" />
            <path d="M32 40 l-2.5 -2 h5 z" fill="currentColor" />
            <path d="M32 40 v2 M32 42 q-3 2 -5 0 M32 42 q3 2 5 0" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            <path d="M14 36 h-5 M14 40 h-5 M50 36 h5 M50 40 h5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
        </>
    );
}

function BearDoodle() {
    return (
        <>
            <circle cx="18" cy="18" r="7" fill={P.brown} {...OUT} />
            <circle cx="46" cy="18" r="7" fill={P.brown} {...OUT} />
            <circle cx="18" cy="18" r="3.5" fill={P.tan} />
            <circle cx="46" cy="18" r="3.5" fill={P.tan} />
            <circle cx="32" cy="36" r="18" fill={P.brown} {...OUT} />
            <ellipse cx="32" cy="43" rx="10" ry="7" fill={P.tan} stroke="currentColor" strokeWidth="1.5" />
            <circle cx="32" cy="40" r="2.5" fill="currentColor" />
            <circle cx="25" cy="31" r="2" fill="currentColor" />
            <circle cx="39" cy="31" r="2" fill="currentColor" />
            <path d="M32 43 v3 M28 47 q4 2 8 0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </>
    );
}

function PrimateDoodle() {
    return (
        <>
            <circle cx="16" cy="30" r="7" fill={P.tan} {...OUT} />
            <circle cx="48" cy="30" r="7" fill={P.tan} {...OUT} />
            <circle cx="16" cy="30" r="3" fill={P.peach} />
            <circle cx="48" cy="30" r="3" fill={P.peach} />
            <ellipse cx="32" cy="36" rx="16" ry="18" fill={P.tan} {...OUT} />
            <ellipse cx="32" cy="40" rx="11" ry="10" fill={P.peach} />
            <circle cx="27" cy="34" r="2" fill="currentColor" />
            <circle cx="37" cy="34" r="2" fill="currentColor" />
            <circle cx="32" cy="41" r="1.5" fill="currentColor" opacity="0.6" />
            <path d="M28 46 q4 3 8 0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </>
    );
}

function WhaleDoodle() {
    return (
        <>
            <path
                d="M6 34 q0 -12 18 -12 q20 0 30 -6 q-3 12 -9 16 q2 8 -3 12 q-6 -2 -9 -6 q-10 3 -20 0 q-6 -2 -7 -4 z"
                fill={P.sky}
                {...OUT}
            />
            <path d="M54 16 q3 -6 8 -6 q-4 5 -2 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <circle cx="20" cy="30" r="1.8" fill="currentColor" />
            <path d="M26 36 q8 4 16 2" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M32 22 q0 -3 -2 -4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </>
    );
}

function RodentDoodle() {
    return (
        <>
            <circle cx="20" cy="18" r="7" fill={P.gray} {...OUT} />
            <circle cx="44" cy="18" r="7" fill={P.gray} {...OUT} />
            <circle cx="20" cy="18" r="3" fill={P.rose} />
            <circle cx="44" cy="18" r="3" fill={P.rose} />
            <ellipse cx="32" cy="38" rx="15" ry="14" fill={P.gray} {...OUT} />
            <circle cx="27" cy="34" r="1.8" fill="currentColor" />
            <circle cx="37" cy="34" r="1.8" fill="currentColor" />
            <circle cx="32" cy="42" r="2" fill={P.rose} stroke="currentColor" strokeWidth="1" />
            <path d="M30 44 h4 M32 44 v2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
            <path d="M32 52 q-8 4 -12 1 M32 52 q8 4 12 1" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </>
    );
}

function RabbitDoodle() {
    return (
        <>
            <ellipse cx="24" cy="14" rx="4" ry="11" fill={P.pink} {...OUT} />
            <ellipse cx="40" cy="14" rx="4" ry="11" fill={P.pink} {...OUT} />
            <ellipse cx="24" cy="14" rx="1.8" ry="7" fill={P.rose} />
            <ellipse cx="40" cy="14" rx="1.8" ry="7" fill={P.rose} />
            <ellipse cx="32" cy="38" rx="14" ry="13" fill={P.pink} {...OUT} />
            <circle cx="27" cy="35" r="1.8" fill="currentColor" />
            <circle cx="37" cy="35" r="1.8" fill="currentColor" />
            <path d="M32 40 l-2 -2 h4 z" fill={P.rose} />
            <path d="M32 40 v2 M30 43 q2 1.5 4 0" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            <circle cx="46" cy="48" r="3" fill={P.white} stroke="currentColor" strokeWidth="1.5" />
        </>
    );
}

function MustelidDoodle() {
    return (
        <>
            <path
                d="M4 42 q4 -16 22 -16 q16 0 26 8 q-4 14 -18 16 q-18 2 -30 -8 z"
                fill={P.rust}
                {...OUT}
            />
            <circle cx="44" cy="34" r="1.8" fill="currentColor" />
            <path d="M48 38 q2 1 4 -1" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            <ellipse cx="50" cy="42" rx="3" ry="2" fill={P.cream} stroke="currentColor" strokeWidth="1.2" />
            <path d="M10 46 q10 6 20 6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </>
    );
}

function ElephantDoodle() {
    return (
        <>
            <circle cx="14" cy="30" r="13" fill={P.gray} {...OUT} />
            <circle cx="50" cy="30" r="13" fill={P.gray} {...OUT} />
            <circle cx="32" cy="36" r="19" fill={P.gray} {...OUT} />
            <circle cx="24" cy="30" r="2" fill="currentColor" />
            <circle cx="40" cy="30" r="2" fill="currentColor" />
            <path
                d="M32 40 q-4 8 -3 14 q0 3 3 3 q3 0 3 -3 q1 -6 -3 -14"
                fill={P.gray}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
            />
            <path d="M27 44 q2 2 5 1 M37 44 q-2 2 -5 1" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
        </>
    );
}

function MarsupialDoodle() {
    return (
        <>
            {/* head */}
            <ellipse cx="32" cy="20" rx="9" ry="8" fill={P.tan} {...OUT} />
            <path d="M24 14 L20 6 L28 12 Z" fill={P.tan} {...OUT} />
            <path d="M40 14 L44 6 L36 12 Z" fill={P.tan} {...OUT} />
            <circle cx="29" cy="20" r="1.5" fill="currentColor" />
            <circle cx="35" cy="20" r="1.5" fill="currentColor" />
            <circle cx="32" cy="24" r="1.3" fill="currentColor" />
            {/* body */}
            <ellipse cx="32" cy="38" rx="13" ry="14" fill={P.tan} {...OUT} />
            {/* legs */}
            <path d="M24 50 q-2 6 0 8 M40 50 q2 6 0 8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" />
            {/* tail */}
            <path d="M44 44 q10 6 8 14" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </>
    );
}

function PlatypusDoodle() {
    return (
        <>
            <ellipse cx="34" cy="34" rx="20" ry="12" fill={P.brown} {...OUT} />
            <path
                d="M8 34 q-4 0 -4 4 q0 4 4 4 q6 0 10 -4 q-4 -4 -10 -4 z"
                fill={P.gray}
                {...OUT}
            />
            <circle cx="42" cy="30" r="1.6" fill="currentColor" />
            <path
                d="M52 40 l12 6 l-4 2 l4 4 l-14 2 z"
                fill={P.brown}
                {...OUT}
            />
        </>
    );
}

// ---------------------------------------------------------------------------
// Reptiles
// ---------------------------------------------------------------------------

function TurtleDoodle() {
    return (
        <>
            {/* head */}
            <ellipse cx="10" cy="34" rx="7" ry="5" fill={P.forest} {...OUT} />
            <circle cx="8" cy="32" r="1.2" fill="currentColor" />
            {/* shell */}
            <path d="M14 32 q0 -14 20 -14 q20 0 20 14 q0 14 -20 14 q-20 0 -20 -14 z" fill={P.forest} {...OUT} />
            <path d="M22 30 l4 -6 M30 26 l6 -4 M40 26 l4 4 M20 38 l4 6 M32 44 l4 -6 M44 38 l-6 6" stroke="currentColor" strokeWidth="1.2" fill="none" opacity="0.6" />
            {/* legs */}
            <path d="M18 46 v4 M46 46 v4" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            <path d="M18 50 l-3 2 M46 50 l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        </>
    );
}

function CrocodileDoodle() {
    return (
        <>
            <path
                d="M6 34 q0 -6 6 -6 h20 q12 0 20 4 q6 3 6 5 q-4 4 -14 4 h-24 q-10 0 -14 -7 z"
                fill={P.green}
                {...OUT}
            />
            <circle cx="44" cy="30" r="1.8" fill="currentColor" />
            {/* teeth */}
            <path d="M14 36 l1 3 l1 -3 M20 36 l1 3 l1 -3 M26 36 l1 3 l1 -3 M32 36 l1 3 l1 -3 M38 36 l1 3 l1 -3" fill={P.white} stroke="currentColor" strokeWidth="0.8" />
            {/* back ridges */}
            <path d="M12 26 l2 -4 l2 4 M20 24 l2 -4 l2 4 M28 24 l2 -4 l2 4" fill={P.green} stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
            <path d="M52 40 q4 0 6 -2" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </>
    );
}

function SnakeDoodle() {
    return (
        <>
            <path
                d="M12 52 q14 -4 20 -14 q4 -8 10 -8 q6 0 6 6 q0 6 -8 6 q-10 0 -14 8 q-4 6 -12 6 q-4 0 -4 -2 q0 -2 2 -2 z"
                fill={P.lime}
                {...OUT}
            />
            <circle cx="48" cy="42" r="1.5" fill="currentColor" />
            <path d="M52 46 q2 0 3 1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" fill="none" />
            <circle cx="20" cy="46" r="1.5" fill="currentColor" opacity="0.4" />
            <circle cx="30" cy="42" r="1.5" fill="currentColor" opacity="0.4" />
            <circle cx="38" cy="36" r="1.5" fill="currentColor" opacity="0.4" />
        </>
    );
}

function LizardDoodle() {
    return (
        <>
            {/* body */}
            <ellipse cx="30" cy="36" rx="16" ry="9" fill={P.green} {...OUT} />
            {/* head */}
            <ellipse cx="48" cy="34" rx="9" ry="7" fill={P.green} {...OUT} />
            <circle cx="52" cy="32" r="1.6" fill="currentColor" />
            {/* legs */}
            <path d="M22 30 l-6 -4 M22 42 l-6 4 M38 30 l6 -4 M38 42 l6 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            {/* tail */}
            <path d="M14 36 q-10 2 -12 10" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            {/* back ridges */}
            <path d="M22 28 l1.5 -3 l1.5 3 M28 26 l1.5 -3 l1.5 3 M34 26 l1.5 -3 l1.5 3 M40 28 l1.5 -3 l1.5 3" fill={P.forest} stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
        </>
    );
}

// ---------------------------------------------------------------------------
// Amphibians
// ---------------------------------------------------------------------------

function FrogDoodle() {
    return (
        <>
            {/* eye bulges */}
            <circle cx="20" cy="18" r="9" fill={P.lime} {...OUT} />
            <circle cx="44" cy="18" r="9" fill={P.lime} {...OUT} />
            <circle cx="20" cy="18" r="4" fill={P.white} />
            <circle cx="44" cy="18" r="4" fill={P.white} />
            <circle cx="20" cy="18" r="2" fill="currentColor" />
            <circle cx="44" cy="18" r="2" fill="currentColor" />
            {/* body */}
            <ellipse cx="32" cy="40" rx="20" ry="14" fill={P.lime} {...OUT} />
            <path d="M20 42 q12 6 24 0" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M22 34 l2 -2 M42 34 l-2 -2" stroke="currentColor" strokeWidth="1" opacity="0.5" />
            {/* feet */}
            <path d="M12 48 l-3 3 M14 50 l-3 3 M52 48 l3 3 M50 50 l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
        </>
    );
}

// ---------------------------------------------------------------------------
// Fish
// ---------------------------------------------------------------------------

function FishDoodle() {
    return (
        <>
            <path
                d="M8 32 q0 -14 18 -14 q16 0 24 10 q-8 10 -24 10 q-18 0 -18 -6 z"
                fill={P.blue}
                {...OUT}
            />
            <path d="M50 28 l10 -8 l-2 12 z" fill={P.blue} {...OUT} />
            <path d="M28 18 l4 -6 l4 6" fill={P.sky} stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M30 46 l3 5 l3 -5" fill={P.sky} stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            <circle cx="18" cy="30" r="1.8" fill="currentColor" />
            <path d="M22 34 q4 2 6 0" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            <path d="M28 28 q4 -2 6 0 M28 34 q4 2 6 0" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.5" />
        </>
    );
}

function SharkDoodle() {
    return (
        <>
            <path
                d="M4 36 q4 -10 18 -12 q14 -2 22 4 q8 5 14 8 q-6 2 -16 2 q-14 0 -22 -2 q-14 -2 -16 0 z"
                fill={P.gray}
                {...OUT}
            />
            <path d="M40 22 l2 -12 l6 12 z" fill={P.gray} {...OUT} />
            <path d="M46 40 l4 8 l-8 -2 z" fill={P.gray} {...OUT} />
            <circle cx="14" cy="30" r="1.8" fill="currentColor" />
            {/* gills */}
            <path d="M26 30 l2 4 M30 30 l2 4 M34 30 l2 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            {/* teeth */}
            <path d="M6 38 l2 2 l2 -2 M12 38 l2 2 l2 -2 M18 39 l2 2 l2 -2" fill={P.white} stroke="currentColor" strokeWidth="0.8" />
        </>
    );
}

function RayDoodle() {
    return (
        <>
            <path
                d="M32 12 q-20 4 -28 22 q10 8 28 8 q18 0 28 -8 q-8 -18 -28 -22 z"
                fill={P.navy}
                {...OUT}
            />
            <path d="M32 42 q-2 8 -2 14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="24" cy="26" r="1.6" fill="currentColor" />
            <circle cx="40" cy="26" r="1.6" fill="currentColor" />
            <path d="M28 34 q4 2 8 0" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </>
    );
}

function LampreyDoodle() {
    return (
        <>
            <path
                d="M6 32 q10 -8 22 -8 q14 0 26 8 q-12 8 -26 8 q-12 0 -22 -8 z"
                fill={P.tan}
                {...OUT}
            />
            <circle cx="14" cy="32" r="5" fill={P.cream} stroke="currentColor" strokeWidth="2" />
            <circle cx="14" cy="32" r="2.5" fill={P.rust} />
            <circle cx="14" cy="32" r="1" fill="currentColor" />
            <path d="M28 26 q-2 6 0 12" stroke="currentColor" strokeWidth="1" opacity="0.4" fill="none" />
            <path d="M34 26 q-2 6 0 12" stroke="currentColor" strokeWidth="1" opacity="0.4" fill="none" />
            <path d="M40 26 q-2 6 0 12" stroke="currentColor" strokeWidth="1" opacity="0.4" fill="none" />
            <path d="M54 32 q4 0 6 -2" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </>
    );
}

// ---------------------------------------------------------------------------
// Birds
// ---------------------------------------------------------------------------

function BirdDoodle() {
    return (
        <>
            <ellipse cx="30" cy="36" rx="18" ry="14" fill={P.orange} {...OUT} />
            <circle cx="46" cy="22" r="9" fill={P.orange} {...OUT} />
            <path d="M54 22 l6 2 l-6 3 z" fill={P.amber} {...OUT} />
            <circle cx="48" cy="20" r="1.8" fill="currentColor" />
            {/* wing */}
            <path d="M22 30 q10 -6 20 4 q-8 6 -20 -4 z" fill={P.crimson} stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            {/* tail */}
            <path d="M12 42 l-8 4 l2 -8 z" fill={P.orange} stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            {/* legs */}
            <path d="M28 50 l-2 6 M36 50 l2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </>
    );
}

function OstrichDoodle() {
    return (
        <>
            {/* body */}
            <ellipse cx="36" cy="34" rx="18" ry="14" fill={P.lightGray} {...OUT} />
            {/* neck */}
            <path d="M22 28 q-6 -12 -2 -20" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
            <path d="M22 28 q-6 -12 -2 -20" fill="none" stroke={P.pale} strokeWidth="3" strokeLinecap="round" />
            {/* head */}
            <circle cx="18" cy="6" r="5" fill={P.pale} {...OUT} />
            <circle cx="16" cy="5" r="1.2" fill="currentColor" />
            <path d="M14 6 l-3 1 l3 2 z" fill={P.amber} />
            {/* legs */}
            <path d="M32 46 l-2 12 M42 46 l4 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            <path d="M30 58 l-4 0 M46 58 l4 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </>
    );
}

function PenguinDoodle() {
    return (
        <>
            <path
                d="M32 6 q-16 0 -18 20 q-2 18 4 26 q6 6 14 6 q8 0 14 -6 q6 -8 4 -26 q-2 -20 -18 -20 z"
                fill={P.black}
                {...OUT}
            />
            <ellipse cx="32" cy="40" rx="10" ry="16" fill={P.white} />
            <path d="M20 30 q6 -4 12 -4" fill="none" stroke={P.amber} strokeWidth="2" strokeLinecap="round" opacity="0.6" />
            <circle cx="26" cy="20" r="2" fill={P.white} />
            <circle cx="38" cy="20" r="2" fill={P.white} />
            <circle cx="26" cy="20" r="1" fill="currentColor" />
            <circle cx="38" cy="20" r="1" fill="currentColor" />
            <path d="M30 26 l-3 2 l3 2 l3 -2 z" fill={P.amber} stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
            <path d="M14 40 l-6 6 M50 40 l6 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" />
        </>
    );
}

function ParrotDoodle() {
    return (
        <>
            <ellipse cx="32" cy="36" rx="14" ry="16" fill={P.red} {...OUT} />
            <circle cx="34" cy="18" r="10" fill={P.red} {...OUT} />
            {/* crest */}
            <path d="M28 10 q-2 -6 -6 -6 q2 4 0 8" fill={P.crimson} stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            {/* beak */}
            <path d="M44 14 q8 2 6 10 q-4 -2 -8 -2 z" fill={P.gray} {...OUT} />
            <circle cx="32" cy="16" r="1.8" fill={P.white} />
            <circle cx="32" cy="16" r="1" fill="currentColor" />
            {/* wing */}
            <path d="M22 30 q8 -4 14 8 q-8 6 -14 -8 z" fill={P.blue} stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            {/* tail */}
            <path d="M36 52 l4 10 l-8 -4 z" fill={P.blue} stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            {/* feet */}
            <path d="M28 52 l-2 6 M36 52 l2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </>
    );
}

function OwlDoodle() {
    return (
        <>
            {/* ear tufts */}
            <path d="M16 16 l-2 -10 l8 6 z" fill={P.brown} {...OUT} />
            <path d="M48 16 l2 -10 l-8 6 z" fill={P.brown} {...OUT} />
            {/* body */}
            <ellipse cx="32" cy="38" rx="18" ry="20" fill={P.brown} {...OUT} />
            {/* facial disc */}
            <circle cx="24" cy="28" r="9" fill={P.tan} stroke="currentColor" strokeWidth="1.5" />
            <circle cx="40" cy="28" r="9" fill={P.tan} stroke="currentColor" strokeWidth="1.5" />
            {/* eyes */}
            <circle cx="24" cy="28" r="4" fill={P.white} />
            <circle cx="40" cy="28" r="4" fill={P.white} />
            <circle cx="24" cy="28" r="2" fill="currentColor" />
            <circle cx="40" cy="28" r="2" fill="currentColor" />
            {/* beak */}
            <path d="M32 32 l-2 4 l4 0 z" fill={P.amber} {...OUT} />
            {/* feather texture */}
            <path d="M22 42 q2 2 4 0 M28 46 q2 2 4 0 M36 46 q2 2 4 0 M42 42 q-2 2 -4 0" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
            {/* feet */}
            <path d="M26 56 l-2 4 M38 56 l2 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </>
    );
}

// ---------------------------------------------------------------------------
// Insects
// ---------------------------------------------------------------------------

function ButterflyDoodle() {
    return (
        <>
            {/* upper wings */}
            <path d="M32 26 q-6 -16 -20 -14 q-6 2 -8 10 q-2 8 8 12 q8 4 20 -8 z" fill={P.orange} {...OUT} />
            <path d="M32 26 q6 -16 20 -14 q6 2 8 10 q2 8 -8 12 q-8 4 -20 -8 z" fill={P.orange} {...OUT} />
            {/* lower wings */}
            <path d="M32 32 q-8 4 -16 14 q-2 6 4 8 q8 2 12 -12 z" fill={P.amber} {...OUT} />
            <path d="M32 32 q8 4 16 14 q2 6 -4 8 q-8 2 -12 -12 z" fill={P.amber} {...OUT} />
            {/* wing spots */}
            <circle cx="16" cy="22" r="2.5" fill={P.crimson} />
            <circle cx="48" cy="22" r="2.5" fill={P.crimson} />
            <circle cx="20" cy="46" r="2" fill={P.crimson} />
            <circle cx="44" cy="46" r="2" fill={P.crimson} />
            {/* body */}
            <ellipse cx="32" cy="38" rx="2" ry="14" fill="currentColor" />
            {/* antennae */}
            <path d="M32 24 q-4 -6 -8 -8 M32 24 q4 -6 8 -8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="24" cy="16" r="1.5" fill="currentColor" />
            <circle cx="40" cy="16" r="1.5" fill="currentColor" />
        </>
    );
}

function MothDoodle() {
    return (
        <>
            <path d="M32 28 q-8 -16 -22 -12 q-4 2 -4 8 q0 8 10 12 q10 4 16 -8 z" fill={P.tan} {...OUT} />
            <path d="M32 28 q8 -16 22 -12 q4 2 4 8 q0 8 -10 12 q-10 4 -16 -8 z" fill={P.tan} {...OUT} />
            <path d="M32 36 q-6 6 -12 14 q-2 4 2 6 q6 2 10 -12 z" fill={P.peach} {...OUT} />
            <path d="M32 36 q6 6 12 14 q2 4 -2 6 q-6 2 -10 -12 z" fill={P.peach} {...OUT} />
            {/* eyespot on each wing */}
            <circle cx="18" cy="26" r="3" fill={P.brown} opacity="0.6" />
            <circle cx="46" cy="26" r="3" fill={P.brown} opacity="0.6" />
            {/* fuzzy body */}
            <ellipse cx="32" cy="38" rx="3" ry="14" fill={P.brown} {...OUT} />
            <path d="M32 24 q-3 -6 -6 -8 M32 24 q3 -6 6 -8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </>
    );
}

function BeetleDoodle() {
    return (
        <>
            {/* legs */}
            <path d="M22 26 l-8 -6 M20 34 l-10 0 M22 42 l-8 6 M42 26 l8 -6 M44 34 l10 0 M42 42 l8 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
            {/* body */}
            <ellipse cx="32" cy="36" rx="12" ry="16" fill={P.crimson} {...OUT} />
            {/* center line */}
            <path d="M32 22 v28" stroke="currentColor" strokeWidth="1.8" />
            {/* head */}
            <ellipse cx="32" cy="20" rx="6" ry="4" fill="currentColor" />
            {/* spots */}
            <circle cx="26" cy="30" r="2.5" fill="currentColor" />
            <circle cx="38" cy="30" r="2.5" fill="currentColor" />
            <circle cx="26" cy="42" r="2.5" fill="currentColor" />
            <circle cx="38" cy="42" r="2.5" fill="currentColor" />
            {/* antennae */}
            <path d="M28 18 l-3 -6 M36 18 l3 -6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        </>
    );
}

function FlyDoodle() {
    return (
        <>
            {/* wings */}
            <ellipse cx="18" cy="24" rx="12" ry="6" fill={P.sky} opacity="0.6" stroke="currentColor" strokeWidth="1.2" transform="rotate(-25 18 24)" />
            <ellipse cx="46" cy="24" rx="12" ry="6" fill={P.sky} opacity="0.6" stroke="currentColor" strokeWidth="1.2" transform="rotate(25 46 24)" />
            {/* body */}
            <ellipse cx="32" cy="36" rx="11" ry="14" fill={P.black} {...OUT} />
            {/* head */}
            <circle cx="32" cy="20" r="6" fill={P.black} {...OUT} />
            {/* compound eyes */}
            <circle cx="28" cy="19" r="3" fill={P.crimson} />
            <circle cx="36" cy="19" r="3" fill={P.crimson} />
            {/* legs */}
            <path d="M22 30 l-6 2 M22 38 l-6 4 M42 30 l6 2 M42 38 l6 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        </>
    );
}

// ---------------------------------------------------------------------------
// Other
// ---------------------------------------------------------------------------

function MushroomDoodle() {
    return (
        <>
            {/* cap */}
            <path
                d="M8 32 q0 -22 24 -22 q24 0 24 22 q-12 4 -24 4 q-12 0 -24 -4 z"
                fill={P.crimson}
                {...OUT}
            />
            {/* spots */}
            <circle cx="18" cy="22" r="3" fill={P.white} stroke="currentColor" strokeWidth="0.8" />
            <circle cx="34" cy="16" r="2.5" fill={P.white} stroke="currentColor" strokeWidth="0.8" />
            <circle cx="46" cy="24" r="3" fill={P.white} stroke="currentColor" strokeWidth="0.8" />
            <circle cx="28" cy="28" r="2" fill={P.white} stroke="currentColor" strokeWidth="0.8" />
            {/* stem */}
            <path
                d="M26 36 q0 -4 -3 -4 h18 q-3 0 -3 4 v18 q0 4 -6 4 q-6 0 -6 -4 z"
                fill={P.cream}
                {...OUT}
            />
        </>
    );
}

function BlobDoodle() {
    return (
        <>
            <path
                d="M32 8 q22 0 22 22 q0 20 -22 26 q-22 -6 -22 -26 q0 -22 22 -22 z"
                fill={P.lightGray}
                {...OUT}
            />
            <circle cx="26" cy="30" r="2" fill="currentColor" />
            <circle cx="38" cy="30" r="2" fill="currentColor" />
            <path d="M26 40 q6 4 12 0" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </>
    );
}

// ---------------------------------------------------------------------------
// Registry
// ---------------------------------------------------------------------------

const DOODLES: Record<Archetype, () => ReactElement> = {
    canid: CanidDoodle,
    feline: FelineDoodle,
    bear: BearDoodle,
    primate: PrimateDoodle,
    whale: WhaleDoodle,
    rodent: RodentDoodle,
    rabbit: RabbitDoodle,
    mustelid: MustelidDoodle,
    elephant: ElephantDoodle,
    marsupial: MarsupialDoodle,
    platypus: PlatypusDoodle,
    turtle: TurtleDoodle,
    crocodile: CrocodileDoodle,
    snake: SnakeDoodle,
    lizard: LizardDoodle,
    frog: FrogDoodle,
    fish: FishDoodle,
    shark: SharkDoodle,
    ray: RayDoodle,
    lamprey: LampreyDoodle,
    bird: BirdDoodle,
    ostrich: OstrichDoodle,
    penguin: PenguinDoodle,
    parrot: ParrotDoodle,
    owl: OwlDoodle,
    butterfly: ButterflyDoodle,
    moth: MothDoodle,
    beetle: BeetleDoodle,
    fly: FlyDoodle,
    mushroom: MushroomDoodle,
    blob: BlobDoodle,
};

// ---------------------------------------------------------------------------
// Explicit id → archetype map. Covers every species in puzzles.yml.
// ---------------------------------------------------------------------------

export const DOODLE_BY_ID: Record<string, Archetype> = {
    // Hominidae + Primates
    homo_sapiens: "primate",
    pan_troglodytes: "primate",
    pan_paniscus: "primate",
    gorilla_gorilla: "primate",
    gorilla_beringei: "primate",
    pongo_abelii: "primate",
    pongo_pygmaeus: "primate",
    pongo_tapanuliensis: "primate",
    macaca_mulatta: "primate",
    papio_anubis: "primate",
    lemur_catta: "primate",
    daubentonia_madagascariensis: "primate",
    tarsius_tarsier: "primate",
    callithrix_jacchus: "primate",

    // Felidae
    panthera_leo: "feline",
    panthera_tigris: "feline",
    panthera_pardus: "feline",
    panthera_onca: "feline",
    acinonyx_jubatus: "feline",
    puma_concolor: "feline",
    lynx_lynx: "feline",
    neofelis_nebulosa: "feline",
    prionailurus_bengalensis: "feline",
    felis_catus: "feline",

    // Ursidae
    ursus_arctos: "bear",
    ursus_maritimus: "bear",
    ursus_americanus: "bear",
    ursus_thibetanus: "bear",
    ailuropoda_melanoleuca: "bear",
    tremarctos_ornatus: "bear",
    helarctos_malayanus: "bear",
    melursus_ursinus: "bear",

    // Canidae
    canis_lupus: "canid",
    canis_latrans: "canid",
    canis_aureus: "canid",
    canis_simensis: "canid",
    vulpes_vulpes: "canid",
    vulpes_zerda: "canid",
    urocyon_cinereoargenteus: "canid",
    lycaon_pictus: "canid",
    speothos_venaticus: "canid",
    otocyon_megalotis: "canid",

    // Lagomorpha
    oryctolagus_cuniculus: "rabbit",
    lepus_europaeus: "rabbit",
    sylvilagus_floridanus: "rabbit",
    lepus_americanus: "rabbit",
    lepus_timidus: "rabbit",
    lepus_arcticus: "rabbit",
    lepus_californicus: "rabbit",
    lepus_townsendii: "rabbit",
    sylvilagus_audubonii: "rabbit",
    ochotona_princeps: "rabbit",

    // Aves
    struthio_camelus: "ostrich",
    apteryx_australis: "ostrich",
    dromaius_novaehollandiae: "ostrich",
    spheniscus_demersus: "penguin",
    psittacus_erithacus: "parrot",
    bubo_bubo: "owl",
    gallus_gallus: "bird",
    anas_platyrhynchos: "bird",
    columba_livia: "bird",
    corvus_corax: "bird",
    passer_domesticus: "bird",

    // Passeriformes
    erithacus_rubecula: "bird",
    hirundo_rustica: "bird",
    troglodytes_troglodytes: "bird",
    turdus_merula: "bird",
    sturnus_vulgaris: "bird",
    pica_pica: "bird",
    cyanistes_caeruleus: "bird",
    taeniopygia_guttata: "bird",

    // Cetacea + Delphinidae
    balaenoptera_musculus: "whale",
    balaenoptera_physalus: "whale",
    megaptera_novaeangliae: "whale",
    eubalaena_glacialis: "whale",
    physeter_macrocephalus: "whale",
    orcinus_orca: "whale",
    tursiops_truncatus: "whale",
    tursiops_aduncus: "whale",
    delphinus_delphis: "whale",
    delphinus_capensis: "whale",
    phocoena_phocoena: "whale",
    monodon_monoceros: "whale",
    globicephala_melas: "whale",
    globicephala_macrorhynchus: "whale",
    sousa_chinensis: "whale",
    stenella_attenuata: "whale",
    lagenorhynchus_albirostris: "whale",

    // Mustelidae
    mustela_nivalis: "mustelid",
    mustela_erminea: "mustelid",
    mustela_putorius: "mustelid",
    neovison_vison: "mustelid",
    lutra_lutra: "mustelid",
    enhydra_lutris: "mustelid",
    meles_meles: "mustelid",
    gulo_gulo: "mustelid",
    taxidea_taxus: "mustelid",
    martes_martes: "mustelid",

    // Rodentia
    mus_musculus: "rodent",
    rattus_norvegicus: "rodent",
    rattus_rattus: "rodent",
    cavia_porcellus: "rodent",
    sciurus_vulgaris: "rodent",
    castor_fiber: "rodent",
    castor_canadensis: "rodent",
    hydrochoerus_hydrochaeris: "rodent",
    marmota_marmota: "rodent",
    cricetomys_gambianus: "rodent",

    // Testudines
    chelonia_mydas: "turtle",
    caretta_caretta: "turtle",
    dermochelys_coriacea: "turtle",
    eretmochelys_imbricata: "turtle",
    lepidochelys_olivacea: "turtle",
    testudo_graeca: "turtle",
    testudo_hermanni: "turtle",
    geochelone_elegans: "turtle",
    trachemys_scripta: "turtle",
    chelydra_serpentina: "turtle",

    // Crocodilia
    crocodylus_porosus: "crocodile",
    crocodylus_niloticus: "crocodile",
    crocodylus_acutus: "crocodile",
    crocodylus_palustris: "crocodile",
    crocodylus_johnstoni: "crocodile",
    crocodylus_siamensis: "crocodile",
    alligator_mississippiensis: "crocodile",
    alligator_sinensis: "crocodile",
    melanosuchus_niger: "crocodile",
    gavialis_gangeticus: "crocodile",

    // Anura
    rana_temporaria: "frog",
    pelophylax_ridibundus: "frog",
    lithobates_catesbeianus: "frog",
    xenopus_laevis: "frog",
    dendrobates_tinctorius: "frog",
    phyllobates_terribilis: "frog",
    hyla_arborea: "frog",
    bufo_bufo: "frog",
    bombina_bombina: "frog",
    eleutherodactylus_coqui: "frog",

    // Squamata
    varanus_komodoensis: "lizard",
    varanus_salvator: "lizard",
    chamaeleo_chamaeleon: "lizard",
    iguana_iguana: "lizard",
    gekko_gecko: "lizard",
    pogona_vitticeps: "lizard",
    python_bivittatus: "snake",
    python_regius: "snake",
    naja_naja: "snake",
    ophiophagus_hannah: "snake",

    // Lepidoptera
    danaus_plexippus: "butterfly",
    papilio_machaon: "butterfly",
    pieris_brassicae: "butterfly",
    vanessa_atalanta: "butterfly",
    aglais_io: "butterfly",
    gonepteryx_rhamni: "butterfly",
    bombyx_mori: "moth",
    manduca_sexta: "moth",
    attacus_atlas: "moth",
    actias_luna: "moth",

    // Coleoptera
    coccinella_septempunctata: "beetle",
    lucanus_cervus: "beetle",
    scarabaeus_sacer: "beetle",
    lampyris_noctiluca: "beetle",
    dytiscus_marginalis: "beetle",
    cetonia_aurata: "beetle",
    anoplophora_glabripennis: "beetle",
    harmonia_axyridis: "beetle",
    leptinotarsa_decemlineata: "beetle",
    tenebrio_molitor: "beetle",

    // Diptera
    drosophila_melanogaster: "fly",
    musca_domestica: "fly",
    culex_pipiens: "fly",
    anopheles_gambiae: "fly",
    aedes_aegypti: "fly",
    aedes_albopictus: "fly",
    glossina_morsitans: "fly",
    simulium_damnosum: "fly",
    tipula_paludosa: "fly",
    calliphora_vicina: "fly",

    // Vertebrates
    petromyzon_marinus: "lamprey",
    carcharodon_carcharias: "shark",
    manta_birostris: "ray",
    latimeria_chalumnae: "fish",
    danio_rerio: "fish",
    salmo_salar: "fish",

    // Mammals (broad)
    ornithorhynchus_anatinus: "platypus",
    didelphis_virginiana: "marsupial",
    macropus_giganteus: "marsupial",
    erinaceus_europaeus: "rodent",
    loxodonta_africana: "elephant",
    elephas_maximus: "elephant",
};

// ---------------------------------------------------------------------------
// Keyword classifier — only used for ids not in DOODLE_BY_ID.
// ---------------------------------------------------------------------------

function classify(id: string, name: string): Archetype {
    const s = `${id} ${name}`.toLowerCase();
    const has = (re: RegExp) => re.test(s);

    if (has(/\b(lion|tiger|leopard|jaguar|cheetah|cougar|lynx|cat|panther|puma|neofelis|prionailurus)/)) return "feline";
    if (has(/\b(bear|ursus|panda|helarctos|melursus|tremarctos)/)) return "bear";
    if (has(/\b(bonobo|chimp|gorilla|orangutan|human|macaque|baboon|lemur|tarsier|marmoset|aye-aye)/)) return "primate";
    if (has(/\b(whale|dolphin|orca|porpoise|narwhal|balaenoptera|megaptera|tursiops|delphinus)/)) return "whale";
    if (has(/\b(mouse|rat|squirrel|beaver|capybara|marmot|guinea|cricetomys)/)) return "rodent";
    if (has(/\b(rabbit|hare|jackrabbit|cottontail|pika|lepus|oryctolagus|sylvilagus)/)) return "rabbit";
    if (has(/\b(otter|badger|wolverine|weasel|stoat|polecat|marten|mink|mustela|meles|gulo|lutra|enhydra|martes)/)) return "mustelid";
    if (has(/\b(elephant|loxodonta|elephas)/)) return "elephant";
    if (has(/\b(platypus|ornithorhynchus)/)) return "platypus";
    if (has(/\b(kangaroo|opossum|wallaby|macropus|didelphis|wombat|koala)/)) return "marsupial";
    if (has(/\b(turtle|tortoise|terrapin|chelonia|testudo|caretta)/)) return "turtle";
    if (has(/\b(crocodile|alligator|caiman|gharial|crocodylus|gavialis)/)) return "crocodile";
    if (has(/\b(snake|python|cobra|viper|boa|naja|ophiophagus)/)) return "snake";
    if (has(/\b(lizard|gecko|iguana|chameleon|komodo|varanus|pogona|skink)/)) return "lizard";
    if (has(/\b(frog|toad|rana|bufo|xenopus|pelophylax|lithobates|hyla|dendrobates)/)) return "frog";
    if (has(/\b(shark|great white|hammerhead|tiger shark|carcharodon)/)) return "shark";
    if (has(/\b(ray|manta)/)) return "ray";
    if (has(/\b(lamprey|hagfish|petromyzon)/)) return "lamprey";
    if (has(/\b(ostrich|emu|kiwi|rhea|cassowary|struthio|dromaius|apteryx)/)) return "ostrich";
    if (has(/\b(penguin|spheniscus)/)) return "penguin";
    if (has(/\b(parrot|macaw|cockatoo|parakeet|psittacus)/)) return "parrot";
    if (has(/\b(owl|bubo|strix|tyto)/)) return "owl";
    if (has(/\b(butterfly|monarch|swallowtail|admiral|peacock|brimstone|danaus|papilio|vanessa|aglais|pieris|gonepteryx)/)) return "butterfly";
    if (has(/\b(moth|silkmoth|sphinx|luna|atlas|bombyx|manduca|actias|attacus)/)) return "moth";
    if (has(/\b(bee|wasp|ant|honeybee|apis|vespa)/)) return "beetle";
    if (has(/\b(fly|mosquito|drosophila|musca|culex|anopheles|aedes|glossina|tipula)/)) return "fly";
    if (has(/\b(beetle|ladybird|ladybug|scarab|stag|glow-worm|firefly)/)) return "beetle";
    if (has(/\b(bird|sparrow|raven|crow|dove|pigeon|chicken|fowl|robin|swallow|wren|blackbird|starling|magpie|tit|finch|mallard|duck|goose)/)) return "bird";
    if (has(/\b(fish|salmon|zebrafish|coelacanth|danio|latimeria|trout|cod|tuna)/)) return "fish";
    if (has(/\b(mushroom|fungus|yeast|agaricus|saccharomyces)/)) return "mushroom";

    return "blob";
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface OrganismDoodleProps {
    taxon: Taxon;
    /** Rendered size in CSS pixels. Defaults to 32. */
    size?: number;
    /** Optional className applied to the svg. */
    className?: string;
}

export function OrganismDoodle({ taxon, size = 32, className }: OrganismDoodleProps) {
    const archetype = DOODLE_BY_ID[taxon.id] ?? classify(taxon.id, taxon.name);
    const Doodle = DOODLES[archetype];

    return (
        <svg
            viewBox="0 0 64 64"
            width={size}
            height={size}
            className={className}
            role="img"
            aria-label={taxon.name}
        >
            <Doodle />
        </svg>
    );
}