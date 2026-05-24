import { router, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState, type ReactNode } from 'react';

type TransitionPhase = 'idle' | 'cover' | 'reveal';

const PUBLIC_PATH_PATTERN =
    /^\/$|^\/website-app(\/|$)|^\/design-photography(\/|$)/;

export function isPublicPortfolioComponent(name: string): boolean {
    return (
        name === 'homepage' ||
        name.startsWith('website-app/') ||
        name.startsWith('design-photography/')
    );
}

function getPathname(url: string): string {
    try {
        return new URL(url, window.location.origin).pathname;
    } catch {
        return url;
    }
}

export function isPublicPortfolioPath(pathname: string): boolean {
    if (
        pathname.startsWith('/admin') ||
        pathname.startsWith('/dashboard') ||
        pathname.startsWith('/settings')
    ) {
        return false;
    }

    if (/^\/(login|register|forgot-password|reset-password|verify-email|two-factor)/.test(pathname)) {
        return false;
    }

    return PUBLIC_PATH_PATTERN.test(pathname);
}

function getVisitPaths(visit: { url: string | URL; only?: string[] }): {
    fromPath: string;
    toPath: string;
} | null {
    if (visit.only && visit.only.length > 0) {
        return null;
    }

    const fromPath = window.location.pathname;
    const toPath = getPathname(String(visit.url));

    if (fromPath === toPath) {
        return null;
    }

    if (!isPublicPortfolioPath(fromPath) || !isPublicPortfolioPath(toPath)) {
        return null;
    }

    return { fromPath, toPath };
}

function MotionGraphicOverlay({ phase }: { phase: TransitionPhase }) {
    const isActive = phase !== 'idle';

    return (
        <AnimatePresence>
            {isActive && (
                <motion.div
                    className="fixed inset-0 z-[9999] overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    aria-hidden
                >
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700"
                        initial={{ scale: 1.15, opacity: 0 }}
                        animate={{
                            scale: phase === 'cover' ? 1 : 1.08,
                            opacity: phase === 'cover' ? 1 : 0.85,
                        }}
                        exit={{ scale: 1.2, opacity: 0 }}
                        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    />

                    <motion.div
                        className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.25),transparent_45%),radial-gradient(circle_at_80%_80%,rgba(186,225,255,0.2),transparent_40%)]"
                        animate={{ opacity: [0.5, 0.9, 0.5] }}
                        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                    />

                    <motion.div
                        className="absolute -top-24 -left-24 h-72 w-72 rounded-full border border-white/30"
                        animate={{ rotate: 360, scale: [1, 1.12, 1] }}
                        transition={{
                            rotate: { duration: 8, repeat: Infinity, ease: 'linear' },
                            scale: { duration: 2, repeat: Infinity },
                        }}
                    />
                    <motion.div
                        className="absolute top-1/3 -right-16 h-56 w-56 rounded-full border-2 border-pink-300/40"
                        animate={{ rotate: -360, y: [0, 24, 0] }}
                        transition={{
                            rotate: { duration: 10, repeat: Infinity, ease: 'linear' },
                            y: { duration: 3, repeat: Infinity },
                        }}
                    />
                    <motion.div
                        className="absolute bottom-10 left-1/4 h-40 w-40 rounded-full bg-white/10 blur-2xl"
                        animate={{ x: [0, 40, 0], y: [0, -20, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    />

                    {[0, 1, 2, 3].map((index) => (
                        <motion.span
                            key={index}
                            className="absolute h-px bg-gradient-to-r from-transparent via-white/70 to-transparent"
                            style={{
                                top: `${22 + index * 18}%`,
                                left: '-20%',
                                width: '140%',
                                rotate: -8 + index * 4,
                            }}
                            initial={{ x: '-30%', opacity: 0 }}
                            animate={{
                                x: phase === 'cover' ? '10%' : '120%',
                                opacity: phase === 'cover' ? [0.2, 0.9, 0.2] : [0.4, 1, 0],
                            }}
                            transition={{
                                x: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
                                opacity: { duration: 0.5 },
                            }}
                        />
                    ))}

                    <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{
                            opacity: phase === 'cover' ? 1 : 0,
                            scale: phase === 'cover' ? 1 : 1.15,
                        }}
                        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <div className="relative">
                            <motion.div
                                className="h-20 w-20 rounded-2xl border-2 border-white/50"
                                animate={{ rotate: [0, 90, 0] }}
                                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                            />
                            <motion.div
                                className="absolute inset-2 rounded-xl bg-white/20 backdrop-blur-sm"
                                animate={{ scale: [1, 0.92, 1] }}
                                transition={{ duration: 0.9, repeat: Infinity }}
                            />
                        </div>
                    </motion.div>

                    <motion.div
                        className="absolute inset-0 bg-white dark:bg-gray-900"
                        initial={{ clipPath: 'circle(0% at 50% 50%)' }}
                        animate={{
                            clipPath:
                                phase === 'cover'
                                    ? 'circle(150% at 50% 50%)'
                                    : 'circle(0% at 50% 50%)',
                        }}
                        transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
}

const pageVariants = {
    initial: {
        opacity: 0,
        y: 28,
        scale: 1.03,
        filter: 'blur(10px)',
    },
    animate: {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: 'blur(0px)',
        transition: {
            duration: 0.55,
            delay: 0.12,
            ease: [0.22, 1, 0.36, 1] as const,
        },
    },
    exit: {
        opacity: 0,
        y: -20,
        scale: 0.97,
        filter: 'blur(8px)',
        transition: { duration: 0.35, ease: [0.4, 0, 1, 1] as const },
    },
};

/**
 * Sits outside the Inertia <App> (in withApp). Handles overlay + router events only.
 * Must NOT call usePage() here.
 */
export function MotionGraphicTransitionProvider({ children }: { children: ReactNode }) {
    const [phase, setPhase] = useState<TransitionPhase>('idle');
    const revealTimerRef = useRef<ReturnType<typeof setTimeout>>();
    const pendingVisitRef = useRef<{ fromPath: string; toPath: string } | null>(null);

    useEffect(() => {
        const removeStart = router.on('start', (event) => {
            const paths = getVisitPaths(event.detail.visit);

            if (!paths) {
                pendingVisitRef.current = null;
                return;
            }

            pendingVisitRef.current = paths;
            clearTimeout(revealTimerRef.current);
            setPhase('cover');
        });

        const removeFinish = router.on('finish', () => {
            if (!pendingVisitRef.current) {
                return;
            }

            pendingVisitRef.current = null;
            setPhase('reveal');
            revealTimerRef.current = setTimeout(() => setPhase('idle'), 680);
        });

        const removeCancel = router.on('cancel', () => {
            pendingVisitRef.current = null;
            clearTimeout(revealTimerRef.current);
            setPhase('idle');
        });

        return () => {
            removeStart();
            removeFinish();
            removeCancel();
            clearTimeout(revealTimerRef.current);
        };
    }, []);

    return (
        <>
            {children}
            <MotionGraphicOverlay phase={phase} />
        </>
    );
}

/**
 * Inertia layout for public portfolio pages. Receives { children, ...pageProps }.
 * Must be registered as a layout component (not a render callback).
 */
export default function MotionGraphicPageLayout({ children }: { children: ReactNode }) {
    const { url, component } = usePage();
    const pageKey = `${component}-${url}`;

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={pageKey}
                className="relative min-h-screen"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}
