import React, { FormEvent } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TextInput, TextArea, ImageUploadInput } from '@/components/admin-form-utils';

type HeroProps = {
    hero: {
        id?: number;
        eyebrow: string;
        title: string;
        highlight: string;
        description: string;
        button_label: string;
        button_href: string;
        image: string | File;
        image_alt: string;
    }
};

export default function EditHero({ hero }: HeroProps) {
    const { data, setData, patch, processing, errors, recentlySuccessful } = useForm({
        eyebrow: hero.eyebrow || '',
        title: hero.title || '',
        highlight: hero.highlight || '',
        description: hero.description || '',
        button_label: hero.button_label || '',
        button_href: hero.button_href || '',
        image: hero.image || '',
        image_alt: hero.image_alt || '',
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        patch('/admin/hero', { // <-- Ganti dengan string path langsung
            forceFormData: true,
            preserveScroll: true,
        });
    };

    return (
        <form onSubmit={submit} className="p-6 space-y-6">
            <Head title="Edit Hero Section" />
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Hero Section</h1>
                    <p className="text-sm text-muted-foreground">Manage your portfolio welcome message.</p>
                </div>
                <div className="flex items-center gap-3">
                    {recentlySuccessful && <span className="text-sm text-green-600">Saved Successfully</span>}
                    <Button type="submit" disabled={processing}>
                        <Save className="mr-2 h-4 w-4" /> Save Changes
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader><CardTitle>Hero Configuration</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextInput label="Eyebrow" value={data.eyebrow} onChange={v => setData('eyebrow', v)} error={errors.eyebrow} />
                    <TextInput label="Title" value={data.title} onChange={v => setData('title', v)} error={errors.title} />
                    <TextInput label="Highlight Word" value={data.highlight} onChange={v => setData('highlight', v)} error={errors.highlight} />
                    <TextInput label="Button Label" value={data.button_label} onChange={v => setData('button_label', v)} error={errors.button_label} />
                    <TextInput label="Button URL" value={data.button_href} onChange={v => setData('button_href', v)} error={errors.button_href} />
                    <TextInput label="Image Alt Description" value={data.image_alt} onChange={v => setData('image_alt', v)} error={errors.image_alt} />
                    <div className="md:col-span-2"><ImageUploadInput label="Hero Graphic File" value={data.image} onChange={file => setData('image', file)} error={errors.image} /></div>
                    <div className="md:col-span-2"><TextArea label="Description Text" value={data.description} onChange={v => setData('description', v)} error={errors.description} rows={4} /></div>
                </CardContent>
            </Card>
        </form>
    );
}