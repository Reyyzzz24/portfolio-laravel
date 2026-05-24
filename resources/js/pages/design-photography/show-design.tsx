import React from 'react';
import { Head, Link } from '@inertiajs/react';

const ShowDesign = ({ item }: { item: any }) => {
    if (!item) return null;

    return (
        <>
            <Head title={item.title} />
            <div className="container mx-auto px-6 py-12">
                <div className="mb-6">
                    <Link href="/design-photography" className="text-sm text-blue-600">← Back</Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                        {item.image && <img src={item.image} alt={item.image_alt || item.title} className="w-full rounded-lg object-cover" />}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">{item.title}</h1>
                        <div className="mt-4 text-sm text-gray-600">{item.description}</div>
                        <div className="mt-6">
                            {Array.isArray(item.tags) && item.tags.map((t: string, i: number) => (
                                <span key={i} className="mr-2 inline-block bg-blue-50 text-blue-600 px-2 py-1 rounded-full text-xs">{t}</span>
                            ))}
                        </div>
                        <div className="mt-6">
                            {item.is_external ? (
                                <a href={item.link} target="_blank" rel="noreferrer" className="btn btn-primary">Open</a>
                            ) : (
                                <Link href={item.link} className="btn btn-primary">Visit</Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ShowDesign;
