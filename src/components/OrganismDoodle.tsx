import { useState } from "react";
import type { Taxon } from "../types/puzzle";

const INK = "#292524";
const STROKE = { stroke: INK, strokeWidth: 3.2, strokeLinejoin: "round", strokeLinecap: "round" } as const;

type Archetype = "canid" | "frog" | "fish" | "bird" | "beetle" | "mushroom" | "blob";

/**
 * Force an archetype for a specific taxon id when the keyword guess is wrong,
 * e.g. { "red_panda": "blob" }.
 */
export const DOODLE_BY_ID: Record<string, Archetype> = {};

const KEYWORDS: [Archetype, RegExp][] = [
    ["canid", /\b(fox|wolf|jackal|coyote|dingo|dhole|dog|canis|vulpes|urocyon|otocyon|lycaon|speothos|cerdocyon|chrysocyon|nyctereutes|cuon)\b/],
    ["frog", /\b(frog|toad|newt|salamander|rana|bufo|hyla|xenopus)\b/],
    ["fish", /\b(fish|salmon|trout|shark|carp|tuna|eel|cod|perca|danio)\b/],
    ["bird", /\b(bird|eagle|owl|hawk|falcon|sparrow|crow|raven|penguin|duck|goose|swan|parrot|finch|chicken|gallus)\b/],
    ["beetle", /\b(beetle|ladybug|ladybird|ant|bee|wasp|fly|moth|butterfly|insect|coleoptera)\b/],
    ["mushroom", /\b(mushroom|fungus|fungi|amanita|agaricus|yeast|truffle)\b/],
];

function pickArchetype(taxon: Taxon): Archetype {
    const forced = DOODLE_BY_ID[taxon.id];
    if (forced) return forced;
    const key = `${taxon.name} ${taxon.sci_name}`.toLowerCase();
    for (const [kind, re] of KEYWORDS) if (re.test(key)) return kind;
    return "blob";
}

function hash(s: string): number {
    let h = 7;
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    return h;
}

// --- Canids (foxes, wolves, jackals, dogs) ----------------------------------

function canidLook(key: string) {
    let fur = "#c9a27a";
    if (/fennec|zerda/.test(key)) fur = "#f2d3a0";
    else if (/bat-eared|otocyon/.test(key)) fur = "#c9a27a";
    else if (/gray fox|grey fox|urocyon/.test(key)) fur = "#a8a29e";
    else if (/\bred\b|vulpes vulpes/.test(key)) fur = "#f08a3c";
    else if (/golden|jackal|aureus/.test(key)) fur = "#e0a73a";
    else if (/ethiopian|simensis/.test(key)) fur = "#d9742c";
    else if (/wild dog|lycaon/.test(key)) fur = "#b9772e";
    else if (/bush dog|speothos/.test(key)) fur = "#92572b";
    else if (/coyote|latrans/.test(key)) fur = "#c4a484";
    else if (/wolf|lupus/.test(key)) fur = "#9ca3af";
    return {
        fur,
        big: /fennec|zerda|bat-eared|otocyon/.test(key),
        fox: /fox|vulpes|urocyon|otocyon/.test(key),
        spots: /wild dog|lycaon/.test(key),
    };
}

function Canid({ keyText }: { keyText: string }) {
    const { fur, big, fox, spots } = canidLook(keyText);
    const ex = big ? 46 : fox ? 34 : 31;
    const ey = big ? -54 : fox ? -46 : -40;
    // A kite-shaped face that narrows to a snout, so it reads as a dog, not a cat.
    const head = `M-40 5 L${-ex} ${ey} L-9 -21 L9 -21 L${ex} ${ey} L40 5 L25 35 L0 53 L-25 35 Z`;
    const innerL = `M${-(ex - 4)} ${ey + 13} L-22 -20 L${-(ex - 4)} -18 Z`;
    const innerR = `M${ex - 4} ${ey + 13} L22 -20 L${ex - 4} -18 Z`;
    return (
        <>
            <path d={head} fill={fur} {...STROKE} />
            <path d={innerL} fill={INK} />
            <path d={innerR} fill={INK} />
            {spots && (
                <>
                    <circle cx="-24" cy="-8" r="7" fill="#44403c" opacity=".55" />
                    <circle cx="27" cy="-2" r="6" fill="#44403c" opacity=".55" />
                </>
            )}
            <path d="M-31 17 L0 25 L31 17 L22 36 L0 51 L-22 36 Z" fill="#fff" />
            <ellipse cx="-15" cy="4" rx="4.5" ry="5.5" fill={INK} transform="rotate(12 -15 4)" />
            <ellipse cx="15" cy="4" rx="4.5" ry="5.5" fill={INK} transform="rotate(-12 15 4)" />
            <path d="M-7 42 L7 42 L0 51 Z" fill={INK} {...STROKE} strokeWidth={2.4} />
        </>
    );
}

// --- Other archetypes -------------------------------------------------------

function Frog() {
    return (
        <>
            <ellipse cx="0" cy="8" rx="42" ry="34" fill="#84cc16" {...STROKE} />
            <circle cx="-22" cy="-20" r="15" fill="#84cc16" {...STROKE} />
            <circle cx="22" cy="-20" r="15" fill="#84cc16" {...STROKE} />
            <circle cx="-22" cy="-21" r="8" fill="#fff" stroke={INK} strokeWidth="2.5" />
            <circle cx="22" cy="-21" r="8" fill="#fff" stroke={INK} strokeWidth="2.5" />
            <circle cx="-21" cy="-20" r="4" fill={INK} />
            <circle cx="23" cy="-20" r="4" fill={INK} />
            <path d="M-24 14 C-10 32 10 32 24 14" fill="none" {...STROKE} />
            <circle cx="-30" cy="22" r="5" fill="#fda4af" opacity=".8" />
            <circle cx="30" cy="22" r="5" fill="#fda4af" opacity=".8" />
        </>
    );
}

function Fish() {
    return (
        <g transform="translate(-6 0) scale(.8)">
            <path d="M30 0 L62 -24 C58 -8 58 8 62 24 Z" fill="#38bdf8" {...STROKE} />
            <ellipse cx="0" cy="0" rx="42" ry="27" fill="#38bdf8" {...STROKE} />
            <path d="M-4 -26 C4 -42 18 -40 22 -24" fill="#0ea5e9" {...STROKE} />
            <circle cx="-22" cy="-6" r="7" fill="#fff" stroke={INK} strokeWidth="2.5" />
            <circle cx="-23" cy="-6" r="3.5" fill={INK} />
            <path d="M-38 8 C-32 14 -26 14 -22 10" fill="none" {...STROKE} />
            <path d="M4 -8 C10 -2 10 6 4 12 M16 -8 C22 -2 22 6 16 12" fill="none" stroke="#0369a1" strokeWidth="3" strokeLinecap="round" />
        </g>
    );
}

function Bird() {
    return (
        <>
            <path d="M-4 -30 C-8 -46 4 -48 8 -36" fill="none" {...STROKE} />
            <ellipse cx="-38" cy="10" rx="9" ry="16" fill="#fbbf24" transform="rotate(20 -38 10)" {...STROKE} />
            <ellipse cx="38" cy="10" rx="9" ry="16" fill="#fbbf24" transform="rotate(-20 38 10)" {...STROKE} />
            <circle cx="0" cy="4" r="35" fill="#fcd34d" {...STROKE} />
            <ellipse cx="0" cy="18" rx="20" ry="15" fill="#fef3c7" />
            <circle cx="-14" cy="-6" r="6" fill="#fff" stroke={INK} strokeWidth="2.5" />
            <circle cx="14" cy="-6" r="6" fill="#fff" stroke={INK} strokeWidth="2.5" />
            <circle cx="-13" cy="-5" r="3" fill={INK} />
            <circle cx="15" cy="-5" r="3" fill={INK} />
            <path d="M-8 6 L8 6 L0 18 Z" fill="#fb923c" {...STROKE} />
            <path d="M-10 40 L-10 48 M10 40 L10 48" fill="none" {...STROKE} />
        </>
    );
}

function Beetle() {
    return (
        <g transform="rotate(10)">
            <path d="M-30 -8 L-46 -18 M-32 6 L-50 8 M-28 20 L-44 32 M30 -8 L46 -18 M32 6 L50 8 M28 20 L44 32" fill="none" {...STROKE} />
            <path d="M-8 -36 L-16 -52 M8 -36 L16 -52" fill="none" {...STROKE} />
            <ellipse cx="0" cy="8" rx="31" ry="38" fill="#b45309" {...STROKE} />
            <path d="M0 -28 L0 46" fill="none" {...STROKE} />
            <circle cx="0" cy="-34" r="13" fill="#78350f" {...STROKE} />
            <circle cx="-5" cy="-36" r="2.8" fill="#fff" />
            <circle cx="5" cy="-36" r="2.8" fill="#fff" />
            <circle cx="-14" cy="6" r="5" fill="#fbbf24" />
            <circle cx="14" cy="22" r="5" fill="#fbbf24" />
            <circle cx="13" cy="-6" r="4" fill="#fbbf24" />
            <circle cx="-13" cy="28" r="4" fill="#fbbf24" />
        </g>
    );
}

function Mushroom() {
    return (
        <>
            <path d="M-16 4 L-13 38 C-6 44 6 44 13 38 L16 4 Z" fill="#fef3c7" {...STROKE} />
            <path d="M-42 6 C-42 -42 42 -42 42 6 Z" fill="#e5484d" {...STROKE} />
            <circle cx="-18" cy="-12" r="6" fill="#fff" />
            <circle cx="8" cy="-24" r="6.5" fill="#fff" />
            <circle cx="24" cy="-6" r="5" fill="#fff" />
        </>
    );
}

/** Fallback: a friendly blob with a sprout, coloured from the taxon id. */
function Blob({ id }: { id: string }) {
    const palette = ["#fca5a5", "#fcd34d", "#86efac", "#7dd3fc", "#c4b5fd", "#f9a8d4"];
    const fill = palette[hash(id) % palette.length];
    return (
        <>
            <path d="M0 -38 C-3 -50 8 -55 14 -52 C14 -43 7 -38 0 -38 Z" fill="#65a30d" {...STROKE} />
            <circle cx="0" cy="6" r="38" fill={fill} {...STROKE} />
            <circle cx="-13" cy="0" r="4.5" fill={INK} />
            <circle cx="13" cy="0" r="4.5" fill={INK} />
            <path d="M-12 16 C-5 26 5 26 12 16" fill="none" {...STROKE} />
        </>
    );
}

// --- Public component -------------------------------------------------------

interface OrganismDoodleProps {
    taxon: Taxon;
    className?: string;
}

function DoodleInner({ taxon, className }: OrganismDoodleProps) {
    // Your own drawings win: drop /public/doodles/<taxon.id>.png and it is used
    // automatically. If the file is missing, fall back to the built-in doodle.
    const [hasCustom, setHasCustom] = useState(true);

    if (hasCustom) {
        return (
            <img
                src={`/doodles/${taxon.id}.png`}
                alt=""
                aria-hidden="true"
                draggable={false}
                onError={() => setHasCustom(false)}
                className={`${className ?? ""} object-contain`}
            />
        );
    }

    const kind = pickArchetype(taxon);
    const keyText = `${taxon.name} ${taxon.sci_name}`.toLowerCase();
    const tilt = (hash(taxon.id) % 9) - 4;

    return (
        <svg viewBox="-54 -58 108 114" className={className} aria-hidden="true">
            <g transform={`rotate(${tilt})`}>
                {kind === "canid" && <Canid keyText={keyText} />}
                {kind === "frog" && <Frog />}
                {kind === "fish" && <Fish />}
                {kind === "bird" && <Bird />}
                {kind === "beetle" && <Beetle />}
                {kind === "mushroom" && <Mushroom />}
                {kind === "blob" && <Blob id={taxon.id} />}
            </g>
        </svg>
    );
}

export function OrganismDoodle({ taxon, className = "h-10 w-10" }: OrganismDoodleProps) {
    return <DoodleInner key={taxon.id} taxon={taxon} className={className} />;
}