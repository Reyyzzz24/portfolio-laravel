import { useRef, type ReactNode } from 'react';
import {
    motion,
    useScroll,
    useSpring,
    useTransform,
    type MotionValue,
} from 'framer-motion';
import Particles from '@/components/Particles';

const PARTICLE_COLORS = ['#ffb3ba', '#baffc9', '#bae1ff', '#ffffba'];

const springConfig = { stiffness: 90, damping: 24, mass: 0.8 };

type ParallaxIntensity = 'subtle' | 'medium' | 'strong';

type IntensitySettings = {
    content: [number, number, number];
    background: [number, number, number];
    scalePeak: number;
    blurMax: number;
};

const intensityConfig: Record<ParallaxIntensity, IntensitySettings> = {
    subtle: {
        content: [120, 0, -120],
        background: [22, 0, -22],
        scalePeak: 1.04,
        blurMax: 5,
    },
    medium: {
        content: [200, 0, -200],
        background: [36, 0, -36],
        scalePeak: 1.06,
        blurMax: 7,
    },
    strong: {
        content: [280, 0, -280],
        background: [50, 0, -50],
        scalePeak: 1.08,
        blurMax: 9,
    },
};

function useSectionFocusMotion(
    focusProgress: MotionValue<number>,
    scalePeak: number,
    blurMax: number,
) {
    const scale = useSpring(
        useTransform(focusProgress, [0, 0.42, 0.5, 0.58, 1], [1, 0.97, scalePeak, 0.97, 1]),
        springConfig,
    );

    const blurAmount = useSpring(
        useTransform(
            focusProgress,
            [0, 0.3, 0.5, 0.7, 1],
            [blurMax, blurMax * 0.1, 0, blurMax * 0.1, blurMax],
        ),
        springConfig,
    );

    const filter = useTransform(blurAmount, (value) => `blur(${value.toFixed(2)}px)`);

    return { scale, filter };
}

interface ParallaxSectionProps {
    id: string;
    children: ReactNode;
    className?: string;
    showParticles?: boolean;
    particleCount?: number;
    intensity?: ParallaxIntensity;
}

export function ParallaxSection({
    id,
    children,
    className = '',
    showParticles = false,
    particleCount = 120,
    intensity = 'medium',
}: ParallaxSectionProps) {
    const ref = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end start'],
    });

    const { scrollYProgress: focusProgress } = useScroll({
        target: ref,
        offset: ['start 0.55', 'end 0.45'],
    });

    const { content, background, scalePeak, blurMax } = intensityConfig[intensity];

    const contentY = useSpring(useTransform(scrollYProgress, [0, 0.5, 1], content), springConfig);
    const backgroundY = useSpring(
        useTransform(scrollYProgress, [0, 0.5, 1], background),
        { ...springConfig, stiffness: 70, damping: 30 },
    );

    const { scale, filter } = useSectionFocusMotion(focusProgress, scalePeak, blurMax);

    return (
        <section
            ref={ref}
            id={id}
            className={`homepage-snap-section relative isolate flex flex-col justify-center overflow-hidden py-20 lg:py-28 ${className}`}
        >
            <div
                className="pointer-events-none absolute -inset-y-40 inset-x-0 z-0 bg-inherit"
                aria-hidden
            />

            {showParticles && (
                <motion.div
                    style={{ y: backgroundY }}
                    className="pointer-events-none absolute -inset-y-48 inset-x-0 z-0"
                    aria-hidden
                >
                    <Particles
                        particleColors={PARTICLE_COLORS}
                        particleCount={particleCount}
                        className="h-full min-h-[130%] w-full"
                    />
                </motion.div>
            )}

            <motion.div
                style={{
                    y: contentY,
                    scale,
                    filter,
                    transformOrigin: 'center center',
                }}
                className="relative z-10 will-change-[transform,filter]"
            >
                {children}
            </motion.div>
        </section>
    );
}
