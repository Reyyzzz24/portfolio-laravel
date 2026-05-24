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

type ItemForm = {
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

const initialItem: ItemForm = {
    id: 'new',
    title: '',
    image: null,
    image_alt: '',
    tags: '',
    description: '',
    link: '',
    is_external: false,
    display_order: 1,
};

export default function AdminDesignPhotography({ designs = [], photographies = [] }: { designs: ItemForm[]; photographies: ItemForm[] }) {
    const { data, setData, patch, processing, errors, recentlySuccessful } = useForm<{ designs: ItemForm[]; photographies: ItemForm[] }>({
        designs,
        photographies,
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState<'designs' | 'photographies'>('designs');
    const [newItem, setNewItem] = useState<ItemForm>(initialItem);

    const handleOpenModal = (type: 'designs' | 'photographies') => {
        setModalType(type);
        setNewItem({ ...initialItem, display_order: data[type].length + 1 });
        setIsModalOpen(true);
    };

    const handleSaveNewItem = () => {
        setData(modalType, [...data[modalType], { ...newItem, id: `new_${Date.now()}` }]);
        setIsModalOpen(false);
    };

    const updateRow = (type: 'designs' | 'photographies', index: number, values: Partial<ItemForm>) => {
        setData(type, data[type].map((item, i) => (i === index ? { ...item, ...values } : item)));
    };

    const removeRow = (type: 'designs' | 'photographies', index: number) => {
        setData(type, data[type].filter((_, i) => i !== index));
    };

    const submit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        patch('/admin/design-photography', { preserveScroll: true, forceFormData: true });
    };

    const renderSection = (title: string, type: 'designs' | 'photographies') => (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle>{title} Collection</CardTitle>
                <Button type="button" variant="outline" size="sm" onClick={() => handleOpenModal(type)}>
                    <Plus className="mr-1 h-3.5 w-3.5" /> Add Item
                </Button>
            </CardHeader>
            <CardContent className="space-y-6">
                {data[type].map((row, index) => (
                    <div key={row.id} className="relative rounded-lg border p-4 bg-background grid grid-cols-1 gap-4 md:grid-cols-2 pt-8 shadow-xs">
                        <Button type="button" variant="ghost" size="icon" className="absolute right-2 top-2 text-destructive" onClick={() => removeRow(type, index)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                        <TextInput label="Title" value={row.title} onChange={(v: string) => updateRow(type, index, { title: v })} error={errors[`${type}.${index}.title`]} />
                        <TextInput label="Image Alt" value={row.image_alt} onChange={(v: string) => updateRow(type, index, { image_alt: v })} />
                        <TextInput label="Tags" value={row.tags} onChange={(v: string) => updateRow(type, index, { tags: v })} />
                        <TextInput label="Link" value={row.link} onChange={(v: string) => updateRow(type, index, { link: v })} />
                        <TextInput label="Display Order" type="number" value={row.display_order} onChange={(v: string) => updateRow(type, index, { display_order: Number(v) })} />
                        <div className="md:col-span-2">
                            <ImageUploadInput label="Cover Image" value={row.image} onChange={(v: File | null) => updateRow(type, index, { image: v })} />
                        </div>
                        <div className="md:col-span-2">
                            <TextArea label="Description" value={row.description} onChange={(v: string) => updateRow(type, index, { description: v })} />
                        </div>
                        <div className="flex items-center gap-2 pt-2">
                            <input type="checkbox" checked={row.is_external} onChange={(e) => updateRow(type, index, { is_external: e.target.checked })} className="rounded h-4 w-4" />
                            <label className="text-sm">Open in new tab</label>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );

    return (
        <>
            <Head title="Admin - Design & Photography" />
            <form onSubmit={submit} className="p-6 space-y-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Design & Photography</h1>
                        <p className="text-sm text-muted-foreground">Manage your design and photography galleries.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {recentlySuccessful && <span className="text-sm text-green-600">Saved Successfully</span>}
                        <Button type="submit" disabled={processing}><Save className="mr-2 h-4 w-4" /> Save Changes</Button>
                    </div>
                </div>
                {renderSection('Designs', 'designs')}
                {renderSection('Photography', 'photographies')}
            </form>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Add New Item to {modalType}</DialogTitle>
                        <DialogDescription>Fill in the details below to add a new gallery item.</DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 py-2">
                        <TextInput label="Title *" value={newItem.title} onChange={(v: string) => setNewItem({ ...newItem, title: v })} />
                        <TextInput label="Image Alt" value={newItem.image_alt} onChange={(v: string) => setNewItem({ ...newItem, image_alt: v })} />
                        <TextInput label="Tags" value={newItem.tags} onChange={(v: string) => setNewItem({ ...newItem, tags: v })} />
                        <TextInput label="Link *" value={newItem.link} onChange={(v: string) => setNewItem({ ...newItem, link: v })} />
                        <TextInput label="Display Order" type="number" value={newItem.display_order} onChange={(v: string) => setNewItem({ ...newItem, display_order: Number(v) })} />
                        <div className="md:col-span-2">
                            <ImageUploadInput label="Cover Image" value={newItem.image} onChange={(v: File | null) => setNewItem({ ...newItem, image: v })} />
                        </div>
                        <div className="md:col-span-2">
                            <TextArea label="Description *" value={newItem.description} onChange={(v: string) => setNewItem({ ...newItem, description: v })} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleSaveNewItem}>Insert Item</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}