import { Link } from '@inertiajs/react';
import { motion, Variants } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ParallaxSection } from '@/components/ParallaxSection';

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
};

const Projects = ({
    content,
    depthIndex = 2,
}: {
    content: { eyebrow: string; title: string; items: any[] } | null;
    depthIndex?: number;
}) => {
    const data = content ?? { eyebrow: '', title: '', items: [] };

    return (
        <ParallaxSection id="portofolios" showParticles particleCount={150} intensity="strong" depthIndex={depthIndex}>
            <div className="container mx-auto max-w-7xl px-6 md:px-12">
                <div className="mb-16">
                    <h3 className="text-sm font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">
                        {data.eyebrow}
                    </h3>
                    <h1 className="mt-2 text-4xl font-bold text-gray-900 md:text-5xl dark:text-white">
                        {data.title}
                    </h1>
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3"
                >
                    {data.items.map((project: any, index: number) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            whileHover={{ y: -10, scale: 1.02 }}
                        >
                            <div className="h-full overflow-hidden rounded-3xl border border-gray-200 bg-white transition-shadow duration-300 hover:shadow-2xl dark:border-gray-700 dark:bg-gray-800">
                                <div className="relative aspect-video overflow-hidden">
                                    <img
                                        src={project.image}
                                        alt={project.imageAlt}
                                        className="h-full w-full object-cover transition duration-700 hover:scale-110"
                                    />
                                </div>

                                <div className="p-8 pb-0">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                                            {project.title}
                                        </h4>

                                        <Button
                                            asChild
                                            variant="ghost"
                                            className="h-auto rounded-full bg-blue-50 px-4 py-1.5 text-xs font-bold text-blue-600 uppercase shadow-sm transition-all hover:bg-blue-600 hover:text-white dark:bg-gray-700 dark:text-blue-400 dark:hover:bg-blue-600 dark:hover:text-white"
                                        >
                                            {project.isExternal ? (
                                                <a
                                                    href={project.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    View
                                                </a>
                                            ) : (
                                                <Link href={project.link}>View</Link>
                                            )}
                                        </Button>
                                    </div>
                                </div>

                                <div className="p-8 pt-4">
                                    {(() => {
                                        const tags = Array.isArray(project.tags)
                                            ? project.tags
                                            : typeof project.tags === 'string'
                                              ? project.tags.split(',')
                                              : [];

                                        return (
                                            <div className="mask-fade relative mb-6 w-full overflow-hidden">
                                                <motion.div
                                                    className="flex space-x-2"
                                                    animate={{ x: ['0%', '-50%'] }}
                                                    transition={{
                                                        duration: 20,
                                                        ease: 'linear',
                                                        repeat: Infinity,
                                                    }}
                                                >
                                                    {[...tags, ...tags].map(
                                                        (tag: string, tagIndex: number) => (
                                                            <span
                                                                key={tagIndex}
                                                                className="rounded-full bg-blue-50 px-3 py-1 text-[10px] font-bold text-blue-600 uppercase whitespace-nowrap dark:bg-blue-900/30 dark:text-blue-400"
                                                            >
                                                                {tag.trim()}
                                                            </span>
                                                        ),
                                                    )}
                                                </motion.div>
                                            </div>
                                        );
                                    })()}

                                    <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                                        {project.description}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </ParallaxSection>
    );
};

export default Projects;