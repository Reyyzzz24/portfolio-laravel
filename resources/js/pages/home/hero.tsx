import { motion, type Variants } from 'framer-motion';
import type { PortfolioContent } from '@/types';

const Hero = ({ content }: { content: PortfolioContent['hero'] }) => {
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
            },
        },
    };

    const itemVariants: Variants = {
        hidden: { y: 30, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.8, ease: "easeOut" },
        },
    };

    return (
        <section id="hero" className="py-20 lg:py-32 bg-white dark:bg-gray-900 transition-colors duration-300 overflow-hidden">
            <div className="container mx-auto max-w-7xl px-6 md:px-12 lg:px-20 flex flex-col-reverse md:flex-row items-center justify-between gap-12 md:gap-20">

                {/* Konten Teks */}
                <motion.div
                    className="md:w-1/2 text-center md:text-left"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    <motion.h3
                        variants={itemVariants}
                        className="text-blue-600 dark:text-blue-400 font-semibold mb-4 uppercase tracking-widest text-sm"
                    >
                        {content.eyebrow}
                    </motion.h3>

                    <motion.h1
                        variants={itemVariants}
                        className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight text-gray-900 dark:text-white"
                    >
                        {content.title}{' '}
                        <span className="text-blue-600 dark:text-blue-400">
                            {content.highlight}
                        </span>
                    </motion.h1>

                    <motion.p
                        variants={itemVariants}
                        className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg md:text-xl max-w-xl mx-auto md:mx-0"
                    >
                        {content.description}
                    </motion.p>

                    <motion.div variants={itemVariants} className="mt-10">
                        <a href={content.button_href} className="inline-block bg-blue-600 text-white px-8 py-3 rounded-full font-medium hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/20 active:scale-95">
                            {content.button_label}
                        </a>
                    </motion.div>
                </motion.div>

                {/* Bagian Gambar */}
                <motion.div
                    className="md:w-1/2 flex justify-center md:justify-end"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    viewport={{ once: true }}
                >
                    <div className="relative">
                        {/* Efek Cahaya Belakang - Optimasi: transform-gpu & will-change */}
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.3, 0.5, 0.3]
                            }}
                            transition={{ repeat: Infinity, duration: 4 }}
                            className="absolute -inset-4 bg-blue-600/20 dark:bg-blue-500/30 rounded-full blur-2xl transform-gpu will-change-transform"
                        />

                        {/* Gambar Utama - Optimasi: transform-gpu & will-change */}
                        <motion.img
                            src={content.image}
                            alt={content.imageAlt}
                            animate={{ y: [0, -20, 0] }}
                            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                            whileHover={{ scale: 1.05, rotate: 2 }}
                            className="relative w-64 h-64 md:w-80 md:h-80 lg:w-[28rem] lg:h-[28rem] rounded-full object-cover border-8 border-white dark:border-gray-800 shadow-2xl transition-all duration-300 transform-gpu will-change-transform"
                        />
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
