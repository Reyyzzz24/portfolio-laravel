import { motion, Variants } from 'framer-motion';
import type { PortfolioContent } from '@/types';
import { LazyIcon } from '@/components/admin-form-utils';
import { ParallaxSection } from '@/components/ParallaxSection';

const serviceColors: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30',
    green: 'bg-green-50 text-green-600 dark:bg-green-900/30',
    purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/30',
};

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
};

const Services = ({ content }: { content: PortfolioContent['services'] | any[] | null }) => {
    const contentObj = Array.isArray(content)
        ? {
            eyebrow: content[0]?.section_eyebrow ?? '',
            title: content[0]?.section_title ?? '',
            items: content.map((service: any) => ({
                title: service.title,
                description: service.description,
                color: service.color,
                iconPath: service.icon_path ?? service.iconPath,
            })),
        }
        : (content ?? { eyebrow: '', title: '', items: [] });

    return (
        <ParallaxSection
            id="services"
            intensity="medium"
            className="relative bg-gray-50 dark:bg-background"
        >
            <div
                className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.05]"
                style={{
                    backgroundImage: `linear-gradient(#808080 1px, transparent 1px), linear-gradient(90deg, #808080 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }}
            />
            <div className="container mx-auto max-w-7xl px-6 md:px-12 z-10 relative">
                <div className="mb-16 text-center">
                    <h3 className="text-sm font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">
                        {contentObj.eyebrow}
                    </h3>
                    <h1 className="mt-2 text-4xl font-bold text-gray-900 md:text-5xl dark:text-white">
                        {contentObj.title}
                    </h1>
                    <div className="mx-auto mt-6 h-1.5 w-20 rounded-full bg-blue-600" />
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-12"
                >
                    {contentObj.items.map((service: any) => {
                        const isHexColor = service.color?.startsWith('#');
                        const colorClass = isHexColor
                            ? ''
                            : (serviceColors[service.color] ?? serviceColors.blue);

                        return (
                            <motion.div
                                key={service.title}
                                variants={itemVariants}
                                whileHover={{ y: -15, scale: 1.02 }}
                                className="rounded-3xl border border-gray-200 bg-white p-10 text-center transition-shadow duration-300 hover:shadow-2xl dark:border-gray-700 dark:bg-gray-800"
                            >
                                <div
                                    className={`mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl ${colorClass}`}
                                    style={
                                        isHexColor
                                            ? {
                                                backgroundColor: `${service.color}15`,
                                                color: service.color,
                                            }
                                            : {}
                                    }
                                >
                                    <LazyIcon
                                        name={service.iconPath}
                                        className="h-10 w-10"
                                        style={isHexColor ? { color: service.color } : {}}
                                    />
                                </div>
                                <h4 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                                    {service.title}
                                </h4>
                                <p className="text-gray-600 dark:text-gray-400">{service.description}</p>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </ParallaxSection>
    );
};

export default Services;
