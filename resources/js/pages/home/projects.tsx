import { Link } from '@inertiajs/react';
import { motion, Variants } from 'framer-motion';

// Variabel animasi untuk kontainer grid
const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.2 },
    },
};

// Variabel animasi untuk setiap kartu proyek
const itemVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
        opacity: 1, 
        y: 0, 
        transition: { type: "spring" as const, stiffness: 100 } 
    },
};

const Projects = ({ content }: { content: { eyebrow: string; title: string; items: any[] } | null }) => {
    const data = content ?? { eyebrow: '', title: '', items: [] };

    return (
        <section id="portofolios" className="py-24 bg-white dark:bg-gray-900 transition-colors duration-300">
            <div className="container mx-auto max-w-7xl px-6 md:px-12">
                {/* Header Section dengan animasi */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16"
                >
                    <h3 className="text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-widest text-sm">
                        {data.eyebrow}
                    </h3>
                    <h1 className="text-4xl md:text-5xl font-bold mt-2 text-gray-900 dark:text-white">
                        {data.title}
                    </h1>
                </motion.div>

                {/* Portofolio Grid dengan animasi Stagger */}
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
                >
                    {data.items.map((project: any, index: number) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            whileHover={{ y: -10, scale: 1.02 }}
                            className="group bg-white dark:bg-gray-800 rounded-3xl overflow-hidden transition-shadow duration-300 hover:shadow-2xl border border-gray-200 dark:border-gray-700"
                        >
                            {/* Image Container */}
                            <div className="relative overflow-hidden aspect-video">
                                <img
                                    src={project.image}
                                    alt={project.imageAlt}
                                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                                />
                            </div>

                            {/* Content Container */}
                            <div className="p-8">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                                        {project.title}
                                    </h4>

                                    {/* Logika Link */}
                                    {project.isExternal ? (
                                        <a
                                            href={project.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 bg-blue-50 dark:bg-gray-700 rounded-full text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                        >
                                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M6 17c2.269-9.881 11-11.667 11-11.667v-3.333l7 6.637-7 6.696v-3.333s-6.17-.171-11 5zm12 .145v2.855h-16v-12h6.598c.768-.787 1.561-1.449 2.339-2h-10.937v16h20v-6.769l-2 1.914z" /></svg>
                                        </a>
                                    ) : (
                                        <Link
                                            href={project.link}
                                            className="p-2 bg-blue-50 dark:bg-gray-700 rounded-full text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                        >
                                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M6 17c2.269-9.881 11-11.667 11-11.667v-3.333l7 6.637-7 6.696v-3.333s-6.17-.171-11 5zm12 .145v2.855h-16v-12h6.598c.768-.787 1.561-1.449 2.339-2h-10.937v16h20v-6.769l-2 1.914z" /></svg>
                                        </Link>
                                    )}
                                </div>

                                {/* Tags */}
                                <div className="flex space-x-2 overflow-x-auto no-scrollbar mb-6">
                                    {Array.isArray(project.tags) && project.tags.map((tag: string, tagIndex: number) => (
                                        <span
                                            key={tagIndex}
                                            className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase rounded-full whitespace-nowrap"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                    {project.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default Projects;