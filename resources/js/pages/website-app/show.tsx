import React from 'react';
import { Head, Link } from '@inertiajs/react';

const WebsiteAppShow = ({ item }: { item: any }) => {
    if (!item) return null;

    return (
        <>
            <Head title={item.title} />

            {/* Menambahkan dark:bg-gray-900 */}
            <div className="min-h-screen bg-white dark:bg-gray-900 py-12 px-6 transition-colors duration-300">
                <div className="container mx-auto max-w-5xl">
                    {/* Navigation */}
                    <div className="mb-10">
                        <Link
                            href="/website-app"
                            className="inline-flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                            <span className="mr-2">←</span> Back to gallery
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                        {/* Left: Image */}
                        <div className="sticky top-12">
                            <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700">
                                {item.image ? (
                                    <img
                                        src={item.image}
                                        alt={item.image_alt || item.title}
                                        className="w-full h-auto object-cover"
                                    />
                                ) : (
                                    <div className="w-full aspect-video bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 dark:text-gray-500">
                                        No Image Available
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right: Details */}
                        <div className="flex flex-col">
                            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6">
                                {item.title}
                            </h1>

                            {/* Tags */}
                            {item.tags && item.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-8">
                                    {(typeof item.tags === 'string' ? item.tags.split(',') : item.tags).map((t: string, i: number) => (
                                        <span
                                            key={i}
                                            className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wide rounded-full border border-blue-100 dark:border-blue-800"
                                        >
                                            {t.trim()}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Description */}
                            <div className="prose prose-lg dark:prose-invert text-gray-600 dark:text-gray-400 max-w-none mb-10">
                                <p className="leading-relaxed">
                                    {item.description}
                                </p>
                            </div>

                            {/* Action Button */}
                            <div>
                                {item.is_external ? (
                                    <a
                                        href={item.link}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-block px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/25 active:scale-95"
                                    >
                                        Visit Project Website →
                                    </a>
                                ) : (
                                    <Link
                                        href={item.link}
                                        className="inline-block px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/25 active:scale-95"
                                    >
                                        View Project →
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default WebsiteAppShow;