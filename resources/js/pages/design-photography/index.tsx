import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

const DesignPhotographyIndex = ({ designs = [], photographies = [] }: { designs?: any[]; photographies?: any[] }) => {
    // ... (logika useForm dan submit tetap sama)
    const { data, setData, post, processing, reset } = useForm({
        title: '', image: '', image_alt: '', tags: '', description: '', link: '', is_external: false, display_order: 0, kind: 'design',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const tagsArray = data.tags ? (typeof data.tags === 'string' ? data.tags.split(',').map((t: string) => t.trim()) : data.tags) : [];
        setData('tags', tagsArray as any);
        if (data.kind === 'design') {
            post('/design-photography/design', { onSuccess: () => reset() });
        } else {
            post('/design-photography/photography', { onSuccess: () => reset() });
        }
    };

    const GallerySection = ({ title, items, path }: { title: string; items: any[]; path: string }) => (
        <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">{title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {items.map((item: any) => (
                    <div key={item.id} className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                        <div className="aspect-video overflow-hidden bg-gray-200 dark:bg-gray-700">
                            <img src={item.image} alt={item.image_alt || item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4 h-15">{item.description}</p>
                            
                            {item.tags && (
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {(Array.isArray(item.tags) ? item.tags : item.tags.split(',')).map((t: string, i: number) => (
                                        <span key={i} className="text-[10px] uppercase tracking-wider font-semibold bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2.5 py-1 rounded-md">{t.trim()}</span>
                                    ))}
                                </div>
                            )}

                            <div className="pt-4">
                                {item.is_external ? (
                                    <a href={item.link} target="_blank" rel="noreferrer" className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">Visit Project →</a>
                                ) : (
                                    <Link href={`/design-photography/${path}/${item.id}`} className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">View Details →</Link>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );

    return (
        <>
            <Head title="Design & Photography" />
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16 px-6 transition-colors duration-300">
                <div className="container mx-auto max-w-7xl">
                    <div className="mb-8">
                        <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-blue-600">← Back to Home</Link>
                    </div>

                    <div className="mb-12 text-center">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">Design & Photography</h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">A curated gallery of visual works and photography.</p>
                    </div>

                    <GallerySection title="Designs" items={designs} path="design" />
                    <GallerySection title="Photography" items={photographies} path="photography" />
                </div>
            </div>
        </>
    );
};

export default DesignPhotographyIndex;