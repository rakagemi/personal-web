'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    X,
    Minus,
    Plus,
    Sparkles,
    Copy,
    Check,
    Clipboard,
    MousePointerClick,
    Move,
} from 'lucide-react'

/* ─────────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────────── */
interface MacCredentialWindowProps {
    email?: string
    password?: string
    marqueeText?: string
}

/* ─────────────────────────────────────────────────────────────
   Sub-component: per-line copy button
   Uses a parent group class ("group/body") on the code body to
   reveal buttons on hover — mirrors the Vue `.mac-body:hover .line-copy` selector.
───────────────────────────────────────────────────────────── */
function LineCopyButton({
    field,
    copiedField,
    onCopy,
}: {
    field: string
    copiedField: string | null
    onCopy: () => void
}) {
    const isOk = copiedField === field

    return (
        <button
            onClick={onCopy}
            aria-label={`copy ${field}`}
            className={[
                'ml-auto inline-flex items-center gap-1.25 pl-1.75 pr-2.25 py-0.75 rounded-[6px]',
                'border text-[11px] cursor-pointer transition-all duration-200 leading-none',
                'focus-visible:opacity-100 focus-visible:translate-x-0',
                isOk
                    ? 'opacity-100 translate-x-0'
                    : 'opacity-0 translate-x-1 group-hover/body:opacity-100 group-hover/body:translate-x-0',
            ].join(' ')}
            style={{
                letterSpacing: '0.3px',
                background: isOk ? 'rgba(52,211,153,0.14)' : 'rgba(255,255,255,0.03)',
                borderColor: isOk ? 'rgba(52,211,153,0.45)' : 'rgba(255,255,255,0.06)',
                color: isOk ? '#6ee7b7' : 'rgba(203,213,225,0.7)',
            }}
            // Hover styles via inline event handlers (can't do conditional Tailwind hover on dynamic classes)
            onMouseEnter={e => {
                if (!isOk) {
                    const el = e.currentTarget as HTMLButtonElement
                    el.style.background = 'rgba(99,102,241,0.15)'
                    el.style.color = '#c7d2fe'
                    el.style.borderColor = 'rgba(99,102,241,0.4)'
                }
            }}
            onMouseLeave={e => {
                if (!isOk) {
                    const el = e.currentTarget as HTMLButtonElement
                    el.style.background = 'rgba(255,255,255,0.03)'
                    el.style.color = 'rgba(203,213,225,0.7)'
                    el.style.borderColor = 'rgba(255,255,255,0.06)'
                }
            }}
        >
            {isOk ? <Check size={12} /> : <Clipboard size={12} />}
            <span>{isOk ? 'Copied' : 'Copy'}</span>
        </button>
    )
}

/* ─────────────────────────────────────────────────────────────
   Main component
───────────────────────────────────────────────────────────── */
export default function MacCredentialWindow({
    email = 'john.doe@example.com',
    password = 'password123',
    marqueeText =
    'Vite, Typescript, Nuxt.js, Vue.js, Tailwind CSS, Nuxt UI, Vue Motion, Pinia, Zod, Tanstack, Vercel',
}: MacCredentialWindowProps) {
    const [isOpen, setIsOpen] = useState(true)
    const [copiedField, setCopiedField] = useState<string | null>(null)
    const [togglePos, setTogglePos] = useState({ x: 24, y: 24 })
    const [isDragging, setIsDragging] = useState(false)

    const justDragged = useRef(false)
    const toggleRef = useRef<HTMLButtonElement>(null)
    const dragOffset = useRef({ x: 0, y: 0 })
    // Keep a ref copy of togglePos so event listeners always read the latest value
    const togglePosRef = useRef(togglePos)

    /* ── clipboard ── */
    const copyToClipboard = useCallback(async (text: string, field: string) => {
        try {
            await navigator.clipboard.writeText(text)
        } catch {
            const ta = document.createElement('textarea')
            ta.value = text
            Object.assign(ta.style, { position: 'fixed', opacity: '0' })
            document.body.appendChild(ta)
            ta.select()
            document.execCommand('copy')
            document.body.removeChild(ta)
        }
        setCopiedField(field)
        setTimeout(() => setCopiedField(prev => (prev === field ? null : prev)), 1600)
    }, [])

    const fullSnippet = `"dependencies": {
        "@iconify-json/lucide": "^1.2.104",
        "@iconify-json/simple-icons": "^1.2.80",
        "@nuxt/ui": "^4.7.0",
        "@tanstack/vue-query": "^5.100.8",
        "@vueuse/motion": "^3.0.3",
        "nuxt": "^4.4.2",
        "pinia": "^3.0.4",
        "tailwindcss": "^4.2.4",
        "zod": "^4.4.2"
    }`

    /* ── window open / close ── */
    const closeWindow = () => setIsOpen(false)
    const openWindow = () => {
        if (justDragged.current) return
        setIsOpen(true)
    }

    /* ── drag start ── */
    const handleDragStart = useCallback(
        (e: React.MouseEvent | React.TouchEvent) => {
            const point =
                'touches' in e
                    ? e.touches[0] ?? e.changedTouches[0]
                    : (e as React.MouseEvent)
            if (!point) return
            dragOffset.current = {
                x: point.clientX - togglePosRef.current.x,
                y: point.clientY - togglePosRef.current.y,
            }
            setIsDragging(true)
            justDragged.current = false
        },
        [],
    )

    /* ── drag move / end (attached to window while dragging) ── */
    useEffect(() => {
        if (!isDragging) return

        const onMove = (e: MouseEvent | TouchEvent) => {
            if ('touches' in e && e.cancelable) e.preventDefault()
            const point = 'touches' in e ? e.touches[0] : e
            if (!point) return

            const el = toggleRef.current
            const w = el?.offsetWidth ?? 130
            const h = el?.offsetHeight ?? 44
            const pad = 8
            const nx = Math.max(pad, Math.min(window.innerWidth - w - pad, point.clientX - dragOffset.current.x))
            const ny = Math.max(pad, Math.min(window.innerHeight - h - pad, point.clientY - dragOffset.current.y))

            const newPos = { x: nx, y: ny }
            togglePosRef.current = newPos
            setTogglePos(newPos)
            justDragged.current = true
        }

        const onEnd = () => {
            setIsDragging(false)
            setTimeout(() => {
                justDragged.current = false
            }, 50)
        }

        window.addEventListener('mousemove', onMove)
        window.addEventListener('mouseup', onEnd)
        window.addEventListener('touchmove', onMove, { passive: false })
        window.addEventListener('touchend', onEnd)

        return () => {
            window.removeEventListener('mousemove', onMove)
            window.removeEventListener('mouseup', onEnd)
            window.removeEventListener('touchmove', onMove)
            window.removeEventListener('touchend', onEnd)
        }
    }, [isDragging])

    /* ── initial position (bottom-right) + resize guard ── */
    useEffect(() => {
        const placeToggle = () => {
            const el = toggleRef.current
            const w = el?.offsetWidth ?? 130
            const h = el?.offsetHeight ?? 44
            const pos = {
                x: window.innerWidth - w - 24,
                y: window.innerHeight - h - 24,
            }
            togglePosRef.current = pos
            setTogglePos(pos)
        }

        const onResize = () => {
            const el = toggleRef.current
            if (!el) return
            const newPos = {
                x: Math.min(togglePosRef.current.x, window.innerWidth - el.offsetWidth - 8),
                y: Math.min(togglePosRef.current.y, window.innerHeight - el.offsetHeight - 8),
            }
            togglePosRef.current = newPos
            setTogglePos(newPos)
        }

        // Place once on first render
        placeToggle()
        window.addEventListener('resize', onResize)
        return () => window.removeEventListener('resize', onResize)
    }, [])

    // Re-place when toggle becomes visible
    useEffect(() => {
        if (!isOpen) {
            requestAnimationFrame(() => {
                const el = toggleRef.current
                if (!el) return
                const w = el.offsetWidth
                const h = el.offsetHeight
                const pos = {
                    x: window.innerWidth - w - 24,
                    y: window.innerHeight - h - 24,
                }
                togglePosRef.current = pos
                setTogglePos(pos)
            })
        }
    }, [isOpen])

    /* ── traffic light dots config ── */
    const dots = [
        { bg: '#ff5f57', icon: <X size={9} />, label: 'close' },
        { bg: '#febc2e', icon: <Minus size={9} />, label: 'minimize' },
        { bg: '#28c840', icon: <Plus size={9} />, label: 'maximize' },
    ] as const

    /* ─────────────────────────────────────────────────────────
       Render
    ───────────────────────────────────────────────────────── */
    return (
        <>
            {/* ── Keyframe animations (can't be expressed in Tailwind) ── */}
            <style>{`
        @keyframes _marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes _pulse-ring {
          0%   { transform: scale(1);    opacity: 0.55; }
          70%  { transform: scale(1.35); opacity: 0;    }
          100% { transform: scale(1.35); opacity: 0;    }
        }
        @keyframes _gradient-shift {
          0%, 100% { background-position: 0%   50%; }
          50%       { background-position: 100% 50%; }
        }
        @keyframes _wiggle {
          0%, 100% { transform: rotate(0deg); }
          25%       { transform: rotate(-12deg) scale(1.1); }
          50%       { transform: rotate(8deg);  }
          75%       { transform: rotate(-4deg); }
        }

        .mcw-marquee-track  { animation: _marquee 28s linear infinite; will-change: transform; }
        .mcw-marquee-wrap:hover .mcw-marquee-track { animation-play-state: paused; }

        .mcw-toggle-pulse   { animation: _pulse-ring 2.2s ease-out infinite; }
        .mcw-toggle-btn     { animation: _gradient-shift 6s ease-in-out infinite; background-size: 200% 200%; }
        .mcw-toggle-icon    { animation: _wiggle 1.8s ease-in-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          .mcw-marquee-track,
          .mcw-toggle-pulse,
          .mcw-toggle-btn,
          .mcw-toggle-icon { animation: none !important; }
        }
      `}</style>

            {/* ── Mac-style window ── */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        key="mac-window"
                        className="relative w-full max-w-180 mx-auto rounded-[14px] overflow-hidden border border-white/8 isolate"
                        initial={{ opacity: 0, scale: 0.92, y: 24 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.85, y: 8, filter: 'blur(4px)' }}
                        transition={{ type: 'spring', stiffness: 180, damping: 18, mass: 0.9 }}
                        style={{
                            background: 'linear-gradient(180deg, #1f2230 0%, #14161f 100%)',
                            boxShadow:
                                '0 1px 0 rgba(255,255,255,0.06) inset, 0 30px 60px -20px rgba(0,0,0,0.55), 0 12px 24px -12px rgba(0,0,0,0.45)',
                        }}
                    >
                        {/* ── Title bar ── */}
                        <div
                            className="grid items-center gap-3.5 px-3.5 py-3 border-b border-white/6"
                            style={{
                                gridTemplateColumns: 'auto 1fr auto',
                                background: 'linear-gradient(180deg, #2a2d3a 0%, #1d1f2a 100%)',
                            }}
                        >
                            {/* Traffic lights */}
                            <div className="flex gap-2 group">
                                {dots.map(({ bg, icon, label }) => (
                                    <button
                                        key={label}
                                        // onClick={closeWindow}
                                        aria-label={label}
                                        className="w-3.5 h-3.5 rounded-full flex items-center justify-center transition-transform duration-180 hover:scale-110 active:scale-95"
                                        style={{ background: bg, boxShadow: 'inset 0 0 0 0.5px rgba(0,0,0,0.35)' }}
                                    >
                                        <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-180 text-black/55 flex items-center justify-center">
                                            {icon}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            {/* Marquee */}
                            <div
                                className="relative overflow-hidden mcw-marquee-wrap"
                                style={{
                                    maskImage:
                                        'linear-gradient(90deg, transparent 0, #000 32px, #000 calc(100% - 32px), transparent 100%)',
                                }}
                                aria-live="polite"
                            >
                                <div className="mcw-marquee-track inline-flex whitespace-nowrap">
                                    {[0, 1].map(i => (
                                        <span
                                            key={i}
                                            className="inline-flex items-center gap-2 pr-12 italic"
                                            style={{
                                                fontSize: '13.5px',
                                                letterSpacing: '0.2px',
                                                color: 'rgba(229,231,235,0.85)',
                                            }}
                                            aria-hidden={i === 1 ? true : undefined}
                                        >
                                            <Sparkles size={14} className="text-amber-400 shrink-0" />
                                            {marqueeText}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Lang pill + copy-all */}
                            <div className="inline-flex items-center gap-2">
                                {/* TypeScript pill */}
                                <span
                                    className="inline-flex items-center gap-1.25 px-2.25 py-0.75 rounded-full border border-white/8 text-slate-300 font-semibold"
                                    style={{
                                        background: 'rgba(255,255,255,0.06)',
                                        fontSize: '11px',
                                        letterSpacing: '0.3px',
                                    }}
                                >
                                    {/* Simple icon */}
                                    <svg
                                        viewBox="0 0 24 24"
                                        className="w-3 h-3"
                                        fill="none"
                                        aria-hidden
                                    >
                                        <path
                                            d="M2 4h20v16h-10v-2h-4v2H2V4z"
                                            fill="#CB3837"
                                        />
                                        <path
                                            d="M5 7h14v10h-3V9h-2v8h-2V9h-2v8H5V7z"
                                            fill="white"
                                        />
                                    </svg>
                                    package.json
                                </span>

                                {/* Copy all */}
                                <button
                                    onClick={() => copyToClipboard(fullSnippet, 'all')}
                                    aria-label="copy all"
                                    className="inline-flex items-center justify-center w-7 h-7 rounded-lg border border-white/8 text-slate-300 cursor-pointer transition-all duration-180 hover:-translate-y-px hover:bg-white/10 active:translate-y-0"
                                    style={{ background: 'rgba(255,255,255,0.04)' }}
                                >
                                    <AnimatePresence mode="wait">
                                        {copiedField === 'all' ? (
                                            <motion.span
                                                key="check"
                                                initial={{ scale: 0.6, rotate: -20 }}
                                                animate={{ scale: 1, rotate: 0 }}
                                                exit={{ scale: 0.6, rotate: 20 }}
                                                transition={{ duration: 0.18 }}
                                            >
                                                <Check size={14} className="text-emerald-400" />
                                            </motion.span>
                                        ) : (
                                            <motion.span
                                                key="copy"
                                                initial={{ scale: 0.6, rotate: -20 }}
                                                animate={{ scale: 1, rotate: 0 }}
                                                exit={{ scale: 0.6, rotate: 20 }}
                                                transition={{ duration: 0.18 }}
                                            >
                                                <Copy size={14} />
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </button>
                            </div>
                        </div>

                        {/* ── Code body ── */}
                        <div
                            className="grid group/body"
                            style={{
                                gridTemplateColumns: '44px 1fr',
                                background:
                                    'radial-gradient(ellipse at top left, rgba(99,102,241,0.06), transparent 60%), #14161f',
                                padding: '18px 0 22px',
                            }}
                        >
                            {/* Line-number gutter */}
                            <div
                                className="flex flex-col items-end pr-3.5 select-none"
                                style={{
                                    fontSize: '13px',
                                    lineHeight: '1.85',
                                    color: 'rgba(148,163,184,0.4)',
                                }}
                                aria-hidden
                            >
                                {[1, 2, 3, 4].map(n => (
                                    <span key={n}>{n}</span>
                                ))}
                            </div>

                            {/* Code */}
                            <pre
                                className="m-0 overflow-x-auto rounded-2xl  text-slate-200"
                                style={{
                                    fontSize: '13.5px',
                                    lineHeight: '1.85',
                                    padding: '18px 22px',
                                }}
                            >
                                <code className="block">
                                    {/* Line 1 */}
                                    <motion.div
                                    className="flex items-center min-h-[1.85em]"
                                    initial={{ opacity: 0, y: 4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.05 }}
                                    >

                                    <span style={{ color: '#86efac' }}>
                                        &quot;dependencies&quot;
                                    </span>

                                    <span style={{ color: '#94a3b8' }}>:</span>

                                    <span>&nbsp;</span>

                                    <span style={{ color: '#94a3b8' }}>{'{'}</span>
                                    </motion.div>

                                    {/* Dependencies */}
                                    {[
                                        ['@iconify-json/lucide', '^1.2.104'],
                                        ['@iconify-json/simple-icons', '^1.2.80'],
                                        ['@nuxt/ui', '^4.7.0'],
                                        ['@tanstack/vue-query', '^5.100.8'],
                                        ['@vueuse/motion', '^3.0.3'],
                                        ['nuxt', '^4.4.2'],
                                        ['pinia', '^3.0.4'],
                                        ['tailwindcss', '^4.2.4'],
                                        ['zod', '^4.4.2'],
                                    ].map(([name, version], index) => (
                                        <motion.div
                                            key={name}
                                            className="flex items-center min-h-[1.85em]"
                                            initial={{ opacity: 0, x: -8 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 + index * 0.06 }}
                                        >
                                            <span>&nbsp;&nbsp;</span>

                                            {/* package name */}
                                            <span style={{ color: '#86efac' }}>
                                                &quot;{name}&quot;
                                            </span>

                                            <span style={{ color: '#94a3b8' }}>:</span>
                                            <span>&nbsp;</span>

                                            {/* version */}
                                            <span style={{ color: '#fde68a' }}>
                                                &quot;{version}&quot;
                                            </span>

                                            {/* comma */}
                                            <span style={{ color: '#94a3b8' }}>,</span>
                                        </motion.div>
                                    ))}

                                    {/* Line End */}
                                    <motion.div
                                        className="flex items-center min-h-[1.85em]"
                                        initial={{ opacity: 0, y: 4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.7 }}
                                    >
                                        <span style={{ color: '#94a3b8' }}>{'}'}</span>
                                    </motion.div>
                                </code>
                            </pre>
                        </div>

                        {/* Ambient glow */}
                        <div
                            className="absolute pointer-events-none -z-10"
                            style={{
                                inset: '-40%',
                                background:
                                    'radial-gradient(circle at 20% 0%, rgba(255,95,86,0.18), transparent 40%), radial-gradient(circle at 80% 100%, rgba(39,201,63,0.14), transparent 45%)',
                                filter: 'blur(40px)',
                            }}
                            aria-hidden
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Floating "Click Me" toggle ── */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        key="floating-toggle"
                        ref={toggleRef}
                        className={[
                            'fixed z-50 inline-flex items-center gap-2.25 pl-3.5 pr-4.5 py-2.75',
                            'rounded-full text-white font-semibold border-0 select-none touch-none',
                            'mcw-toggle-btn',
                            isDragging
                                ? 'cursor-grabbing scale-[0.97]'
                                : 'cursor-grab hover:-translate-y-0.5 hover:scale-[1.04] active:scale-[0.97]',
                        ].join(' ')}
                        style={{
                            left: togglePos.x,
                            top: togglePos.y,
                            fontSize: '13px',
                            letterSpacing: '0.5px',
                            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
                            backgroundSize: '200% 200%',
                            boxShadow:
                                '0 1px 0 rgba(255,255,255,0.2) inset, 0 10px 30px -8px rgba(139,92,246,0.6), 0 4px 12px -4px rgba(0,0,0,0.3)',
                            transition: isDragging
                                ? 'transform 0.08s ease'
                                : 'transform 0.2s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s ease',
                        }}
                        initial={{ opacity: 0, scale: 0.4, rotate: -20 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0, scale: 0.6 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                        onMouseDown={handleDragStart}
                        onTouchStart={handleDragStart}
                        onClick={openWindow}
                    >
                        {/* Pulse ring */}
                        <span
                            className="mcw-toggle-pulse absolute inset-0 rounded-[inherit] -z-10"
                            style={{ background: 'inherit', opacity: 0.55 }}
                            aria-hidden
                        />

                        <MousePointerClick size={16} className="mcw-toggle-icon shrink-0" />
                        <span className="relative z-10">Click&nbsp;Me</span>
                        <Move size={13} className="opacity-70 ml-0.5 shrink-0" />
                    </motion.button>
                )}
            </AnimatePresence>
        </>
    )
}