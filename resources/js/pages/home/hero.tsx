import {
    motion,
    useTransform,
    useSpring,
    useMotionValue,
    type Variants,
} from 'framer-motion';
import type { PortfolioContent } from '@/types';
import { SplitText } from '@/components/SplitText';
import { ParallaxSection } from '@/components/ParallaxSection';

const Hero = ({ content }: { content: PortfolioContent['hero'] }) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const rotateYMouse = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), {
        stiffness: 120,
        damping: 20,
    });
    const rotateXMouse = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), {
        stiffness: 120,
        damping: 20,
    });

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
    };

    const itemVariants: Variants = {
        hidden: { y: '100%', opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
    };

    return (
        <ParallaxSection
            id="hero"
            showParticles
            particleCount={200}
            intensity="strong"
            className="!py-20 lg:!py-32"
        >
            <div className="relative">
                <motion.div
                    style={{
                        rotateX: rotateXMouse,
                        rotateY: rotateYMouse,
                        transformPerspective: 1200,
                    }}
                    className="container relative z-10 mx-auto flex max-w-7xl flex-col-reverse items-center justify-between gap-12 px-6 will-change-transform md:flex-row md:gap-20 md:px-12 lg:px-20"
                    onMouseMove={(e) => {
                        const { innerWidth, innerHeight } = window;
                        mouseX.set(e.clientX / innerWidth - 0.5);
                        mouseY.set(e.clientY / innerHeight - 0.5);
                    }}
                    onMouseLeave={() => {
                        mouseX.set(0);
                        mouseY.set(0);
                    }}
                >
                    <motion.div
                        className="text-center md:w-1/2 md:text-left"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        <motion.h3
                            variants={itemVariants}
                            className="mb-4 text-sm font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400"
                        >
                            {content.eyebrow}
                        </motion.h3>

                        <div className="mb-8 text-5xl leading-tight font-bold text-gray-900 md:text-6xl lg:text-7xl dark:text-white">
                            <SplitText text={content.title} variants={itemVariants} />
                            <span className="block text-blue-600 md:inline dark:text-blue-400">
                                <SplitText text={content.highlight} variants={itemVariants} />
                            </span>
                        </div>

                        <motion.p
                            variants={itemVariants}
                            className="mx-auto max-w-xl text-lg leading-relaxed text-gray-600 md:mx-0 md:text-xl dark:text-gray-400"
                        >
                            {content.description}
                        </motion.p>

                        <motion.div variants={itemVariants} className="mt-10">
                            <a
                                href={content.button_href}
                                className="inline-block rounded-full bg-blue-600 px-8 py-3 font-medium text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-blue-500/20 active:scale-95"
                            >
                                {content.button_label}
                            </a>
                        </motion.div>
                    </motion.div>

                    <motion.div className="flex justify-center md:w-1/2 md:justify-end">
                        <div className="relative">
                            <motion.div
                                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                                transition={{ repeat: Infinity, duration: 4 }}
                                className="absolute -inset-4 rounded-full bg-blue-600/20 blur-2xl dark:bg-blue-500/30"
                            />
                            <motion.img
                                src={content.image}
                                alt={content.imageAlt}
                                animate={{ y: [0, -20, 0] }}
                                transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
                                className="relative h-64 w-64 rounded-full border-8 border-white object-cover shadow-2xl md:h-80 md:w-80 lg:h-[28rem] lg:w-[28rem]"
                            />
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </ParallaxSection>
    );
};

export default Hero;
