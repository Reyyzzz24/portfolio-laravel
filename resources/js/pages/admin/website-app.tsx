import React, { FormEvent, useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Save, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TextInput, TextArea, ImageUploadInput } from '@/components/admin-form-utils';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

type AppFormItem = {
    id: number | string;
    title: string;
    image: string | File | null;
    image_alt: string;
    tags: string;
    description: string;
    link: string;
    is_external: boolean;
    display_order: number;
};

const initialNewApp = {
    title: '',
    image: null as string | File | null,
    image_alt: '',
    tags: '',
    description: '',
    link: '',
    is_external: false,
    display_order: 1,
};

export default function AdminWebsiteApp({ section = null, apps = [] }: { section?: any, apps: AppFormItem[] }) {
    const { data, setData, patch, processing, errors, recentlySuccessful } = useForm<{ section: any; apps: AppFormItem[] }>({ 
        section: section ?? { section_eyebrow: '', section_title: '' },
        apps: apps || [] 
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newApp, setNewApp] = useState(initialNewApp);

    const updateSectionHeader = (fields: { section_eyebrow?: string; section_title?: string }) => {
        setData('section', { ...data.section, ...fields });
    };

    const handleOpenModal = () => {
        setNewApp({ ...initialNewApp, display_order: data.apps.length + 1 });
        setIsModalOpen(true);
    };

    const handleSaveNewApp = () => {
        const constructed = { id: `new_${Date.now()}`, ...newApp } as AppFormItem;
        setData('apps', [...data.apps, constructed]);
        setIsModalOpen(false);
    };

    const updateRow = (index: number, values: Partial<AppFormItem>) => {
        const updated = data.apps.map((r, i) => (i === index ? { ...r, ...values } : r));
        setData('apps', updated);
    };

    const removeRow = (index: number) => {
        setData('apps', data.apps.filter((_, i) => i !== index));
    };

    const submit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        patch('/admin/website-app', { preserveScroll: true, forceFormData: true });
    };

    return (
        <>
            <Head title="Manage Website & App Section" />
            <form onSubmit={submit} className="p-6 space-y-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Website & App Collection</h1>
                        <p className="text-sm text-muted-foreground">Manage your website/app showcase items.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {recentlySuccessful && <span className="text-sm text-green-600">Saved Successfully</span>}
                        <Button type="submit" disabled={processing}><Save className="mr-2 h-4 w-4" /> Save Changes</Button>
                    </div>
                </div>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-4">
                        <CardTitle>Collection Items</CardTitle>
                        <Button type="button" variant="outline" size="sm" onClick={handleOpenModal}><Plus className="mr-1 h-3.5 w-3.5" />Add Item</Button>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* List Items */}
                        {data.apps.map((row, index) => (
                            <div key={row.id} className="relative rounded-lg border p-4 bg-background grid grid-cols-1 gap-4 md:grid-cols-2 pt-8 shadow-xs">
                                <Button type="button" variant="ghost" size="icon" className="absolute right-2 top-2 text-destructive" onClick={() => removeRow(index)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>

                                <TextInput label="Title" value={row.title} onChange={(v: string) => updateRow(index, { title: v })} error={errors[`apps.${index}.title`]} />
                                <TextInput label="Image Alt" value={row.image_alt} onChange={(v: string) => updateRow(index, { image_alt: v })} error={errors[`apps.${index}.image_alt`]} />
                                <TextInput label="Tags (Comma separated)" value={row.tags} onChange={(v: string) => updateRow(index, { tags: v })} error={errors[`apps.${index}.tags`]} />
                                <TextInput label="Link" value={row.link} onChange={(v: string) => updateRow(index, { link: v })} error={errors[`apps.${index}.link`]} />
                                <TextInput label="Display Order" type="number" value={row.display_order} onChange={(v: string) => updateRow(index, { display_order: Number(v) })} error={errors[`apps.${index}.display_order`]} />

                                <div className="flex items-center gap-2 pt-6">
                                    <input type="checkbox" checked={!!row.is_external} onChange={(e) => updateRow(index, { is_external: e.target.checked })} className="rounded border-gray-300 h-4 w-4 text-primary" />
                                    <label className="text-sm font-medium">Open in new tab (external)</label>
                                </div>

                                <div className="md:col-span-2">
                                    <ImageUploadInput label="Cover Image" value={row.image} onChange={(v: File | null) => updateRow(index, { image: v })} error={errors[`apps.${index}.image`]} />
                                </div>
                                <div className="md:col-span-2">
                                    <TextArea label="Description" value={row.description} onChange={(v: string) => updateRow(index, { description: v })} error={errors[`apps.${index}.description`]} />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </form>

            {/* Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Add New Item</DialogTitle>
                        <DialogDescription>Fill in the details below to add a new showcase item.</DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
                        <TextInput label="Title *" value={newApp.title} onChange={(v: string) => setNewApp({ ...newApp, title: v })} />
                        <TextInput label="Image Alt" value={newApp.image_alt} onChange={(v: string) => setNewApp({ ...newApp, image_alt: v })} />
                        <TextInput label="Tags" value={newApp.tags} onChange={(v: string) => setNewApp({ ...newApp, tags: v })} />
                        <TextInput label="Link *" value={newApp.link} onChange={(v: string) => setNewApp({ ...newApp, link: v })} />
                        <TextInput label="Display Order" type="number" value={newApp.display_order} onChange={(v: string) => setNewApp({ ...newApp, display_order: Number(v) })} />
                        <div className="flex items-center gap-2 pt-6">
                            <input type="checkbox" checked={newApp.is_external} onChange={(e) => setNewApp({ ...newApp, is_external: e.target.checked })} className="rounded border-gray-300 h-4 w-4" />
                            <label className="text-sm font-medium">Open in new tab</label>
                        </div>
                        <div className="md:col-span-2">
                            <ImageUploadInput label="Cover Image" value={newApp.image} onChange={(v: File | null) => setNewApp({ ...newApp, image: v })} />
                        </div>
                        <div className="md:col-span-2">
                            <TextArea label="Description *" value={newApp.description} onChange={(v: string) => setNewApp({ ...newApp, description: v })} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleSaveNewApp}>Insert Item</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}