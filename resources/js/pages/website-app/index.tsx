import React from 'react';
import { Head, Link } from '@inertiajs/react';

const WebsiteAppIndex = ({ items = [] }: { items?: any[] }) => {
    return (
        <>
            <Head title="Website & App Gallery" />

            {/* Menambahkan dark:bg-gray-900 untuk background seluruh halaman */}
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16 px-6 transition-colors duration-300">
                <div className="container mx-auto max-w-7xl">
                    
                    {/* Tombol Back to Home */}
                    <div className="mb-8">
                        <Link 
                            href="/" 
                            className="inline-flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                            <span className="mr-2">←</span> Back to Home
                        </Link>
                    </div>

                    {/* Header Section */}
                    <div className="mb-12 text-center">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
                            Website & App Gallery
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            A curated showcase of projects, websites, and applications.
                        </p>
                    </div>

                    {/* Gallery Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {items.map((item: any) => (
                            <div
                                key={item.id}
                                className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                            >
                                {/* Image Container */}
                                <div className="aspect-video overflow-hidden bg-gray-200 dark:bg-gray-700">
                                    {item.image ? (
                                        <img
                                            src={item.image}
                                            alt={item.image_alt || item.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                                            No Image
                                        </div>
                                    )}
                                </div>

                                {/* Content Container */}
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4 h-15">
                                        {item.description}
                                    </p>

                                    {/* Tags */}
                                    {item.tags && (
                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {(typeof item.tags === 'string' ? item.tags.split(',') : item.tags).map((t: string, i: number) => (
                                                <span
                                                    key={i}
                                                    className="text-[10px] uppercase tracking-wider font-semibold bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2.5 py-1 rounded-md"
                                                >
                                                    {t.trim()}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Footer / Action */}
                                    <div className="pt-4">
                                        {item.is_external ? (
                                            <a
                                                href={item.link}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                                            >
                                                Visit Project →
                                            </a>
                                        ) : (
                                            <Link
                                                href={`/website-app/${item.id}`}
                                                className="inline-flex items-center text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                                            >
                                                View Details →
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default WebsiteAppIndex;