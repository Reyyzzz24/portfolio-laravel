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

/**
 * depthIndex: nomor urut section (0-based).
 * Genap  → maju ke depan  (translateZ +, rotateY -, tilt kiri)
 * Ganjil → mundur ke belakang (translateZ -, rotateY +, tilt kanan)
 */
const depthProfiles = [
    // index 0 – Hero: maju, tilt kiri
    { translateZ: [80, 0, -40], rotateY: [-5, 0, 3], rotateX: [2, 0, -1] },
    // index 1 – Services: mundur, tilt kanan
    { translateZ: [-40, 0, 60], rotateY: [4, 0, -5], rotateX: [-1, 0, 2] },
    // index 2 – Projects: maju, tilt kiri (lebih dalam)
    { translateZ: [100, 0, -60], rotateY: [-6, 0, 4], rotateX: [3, 0, -2] },
    // index 3 – Skills: mundur, tilt kanan (lebih dalam)
    { translateZ: [-60, 0, 80], rotateY: [5, 0, -6], rotateX: [-2, 0, 3] },
    // index 4 – Contact: maju, tilt kiri
    { translateZ: [70, 0, -50], rotateY: [-4, 0, 3], rotateX: [2, 0, -1] },
    // fallback untuk index >4 – alternating
    { translateZ: [50, 0, -50], rotateY: [-3, 0, 3], rotateX: [1, 0, -1] },
];

function getDepthProfile(index: number) {
    if (index < depthProfiles.length - 1) return depthProfiles[index];
    // Untuk section di luar tabel: alternating genap/ganjil
    const isEven = index % 2 === 0;
    return isEven
        ? { translateZ: [60, 0, -40], rotateY: [-4, 0, 3], rotateX: [2, 0, -1] }
        : { translateZ: [-40, 0, 60], rotateY: [4, 0, -4], rotateX: [-2, 0, 2] };
}

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

function use3DDepthMotion(
    scrollYProgress: MotionValue<number>,
    depthIndex: number,
) {
    const profile = getDepthProfile(depthIndex);

    const rawTZ = useTransform(scrollYProgress, [0, 0.5, 1], profile.translateZ);
    const rawRY = useTransform(scrollYProgress, [0, 0.5, 1], profile.rotateY);
    const rawRX = useTransform(scrollYProgress, [0, 0.5, 1], profile.rotateX);

    const translateZ = useSpring(rawTZ, { stiffness: 70, damping: 22, mass: 0.9 });
    const rotateY    = useSpring(rawRY, { stiffness: 60, damping: 20, mass: 1.0 });
    const rotateX    = useSpring(rawRX, { stiffness: 60, damping: 20, mass: 1.0 });

    return { translateZ, rotateY, rotateX };
}

interface ParallaxSectionProps {
    id: string;
    children: ReactNode;
    className?: string;
    showParticles?: boolean;
    particleCount?: number;
    intensity?: ParallaxIntensity;
    /**
     * Nomor urut section (0-based).
     * 0 = Hero, 1 = Services, 2 = Projects, 3 = Skills, 4 = Contact, dst.
     * Menentukan arah & kedalaman 3D yang selang-seling.
     */
    depthIndex?: number;
}

export function ParallaxSection({
    id,
    children,
    className = '',
    showParticles = false,
    particleCount = 120,
    intensity = 'medium',
    depthIndex = 0,
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

    const contentY = useSpring(
        useTransform(scrollYProgress, [0, 0.5, 1], content),
        springConfig,
    );
    const backgroundY = useSpring(
        useTransform(scrollYProgress, [0, 0.5, 1], background),
        { ...springConfig, stiffness: 70, damping: 30 },
    );

    const { scale, filter } = useSectionFocusMotion(focusProgress, scalePeak, blurMax);

    // 3D depth selang-seling
    const { translateZ, rotateY, rotateX } = use3DDepthMotion(scrollYProgress, depthIndex);

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

            {/*
             * transformPerspective ditaruh di sini agar translateZ & rotateY
             * benar-benar dirender dalam ruang 3D, bukan hanya efek 2D.
             */}
            <motion.div
                style={{
                    y: contentY,
                    scale,
                    filter,
                    translateZ,
                    rotateY,
                    rotateX,
                    transformPerspective: 1400,
                    transformOrigin: 'center center',
                }}
                className="relative z-10 will-change-[transform,filter]"
            >
                {children}
            </motion.div>
        </section>
    );
}
