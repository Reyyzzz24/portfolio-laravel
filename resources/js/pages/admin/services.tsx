import React, { FormEvent, useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Save, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TextInput, TextArea, ColorPickerInput, LucideIconPicker } from '@/components/admin-form-utils';

// Impor komponen dialog/modal Radix UI (Shadcn)
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

type ServiceItem = {
    id: number | string;
    title: string;
    description: string;
    color: string;
    icon_path: string;
    display_order: number;
};

export default function EditServices({ section = null, services }: { section?: any; services: ServiceItem[] }) {
    const { data, setData, patch, processing, errors, recentlySuccessful } = useForm({
        section: section ?? { section_eyebrow: '', section_title: '' },
        services: services || []
    });

    // --- STATE UNTUK MODAL FORM ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newItem, setNewItem] = useState<Omit<ServiceItem, 'id' | 'section_eyebrow' | 'section_title'>>({
        title: '',
        description: '',
        color: '#3b82f6',
        icon_path: '',
        display_order: data.services.length + 1
    });

    const updateServiceRow = (index: number, values: Partial<ServiceItem>) => {
        const updated = data.services.map((row, i) => i === index ? { ...row, ...values } : row);
        setData('services', updated);
    };

    const updateGlobalHeader = (fields: { section_eyebrow?: string; section_title?: string }) => {
        setData('section', { ...data.section, ...fields });
    };

    const openAddModal = () => {
        setNewItem({
            title: '',
            description: '',
            color: '#3b82f6',
            icon_path: '',
            display_order: data.services.length + 1
        });
        setIsModalOpen(true);
    };

    // --- SUBMIT DARI MODAL KE STACK UTAMA ---
    const handleSaveNewItem = () => {
        const first = data.services[0];
        const completeItem: ServiceItem = {
            id: `new_${Date.now()}`,
            ...newItem
        };

        setData('services', [...data.services, completeItem]);
        setIsModalOpen(false); // Tutup modal
    };

    const removeService = (index: number) => {
        setData('services', data.services.filter((_, i) => i !== index));
    };

    const submit = (e: FormEvent) => {
        e.preventDefault();
        patch('/admin/services', { preserveScroll: true });
    };

    return (
        <form onSubmit={submit} className="p-6 space-y-6">
            <Head title="Edit Services Section" />
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Services Section</h1>
                    <p className="text-sm text-muted-foreground">Manage service offers provided to clients.</p>
                </div>
                <div className="flex items-center gap-3">
                    {recentlySuccessful && <span className="text-sm text-green-600">Saved Successfully</span>}
                    <Button type="submit" disabled={processing}>
                        <Save className="mr-2 h-4 w-4" /> Save Changes
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Services Stack</CardTitle>
                    <Button type="button" variant="outline" size="sm" onClick={openAddModal}><Plus className="w-4 h-4 mr-1" /> Add Item</Button>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-dashed p-4 rounded-lg bg-muted/20">
                        <TextInput label="Section Subtitle / Eyebrow" value={data.section.section_eyebrow || ''} onChange={v => updateGlobalHeader({ section_eyebrow: v })} />
                        <TextInput label="Section Title" value={data.section.section_title || ''} onChange={v => updateGlobalHeader({ section_title: v })} />
                    </div>

                    {data.services.map((row, index) => (
                        <div key={row.id} className="relative border p-4 rounded-lg bg-background grid grid-cols-1 md:grid-cols-2 gap-4 pt-10">
                            <Button type="button" variant="ghost" size="icon" className="absolute right-2 top-2 text-destructive hover:bg-destructive/10" onClick={() => removeService(index)}>
                                <Trash2 className="w-4 h-4" />
                            </Button>
                            <TextInput label="Service Title" value={row.title} onChange={v => updateServiceRow(index, { title: v })} error={errors[`services.${index}.title` as any]} />
                            <ColorPickerInput label="Theme Color" value={row.color} onChange={v => updateServiceRow(index, { color: v })} error={errors[`services.${index}.color` as any]} />
                            <LucideIconPicker
                                label="Icon Vector"
                                value={row.icon_path}
                                color={row.color}
                                onChange={v => updateServiceRow(index, { icon_path: v })}
                                error={errors[`services.${index}.icon_path` as any]}
                            />
                            <TextInput label="Order" type="number" value={row.display_order} onChange={v => updateServiceRow(index, { display_order: Number(v) })} error={errors[`services.${index}.display_order` as any]} />
                            <div className="md:col-span-2"><TextArea label="Service Description" value={row.description} onChange={v => updateServiceRow(index, { description: v })} error={errors[`services.${index}.description` as any]} /></div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent
                    className="sm:max-w-[600px]"
                    // Siasat jitu agar Popover/Dropdown di dalam modal tidak diblokir Radix UI:
                    onPointerDownOutside={(e) => e.preventDefault()}
                    onInteractOutside={(e) => e.preventDefault()}
                >
                    <DialogHeader>
                        <DialogTitle>Add New Service</DialogTitle>
                    </DialogHeader>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                        <TextInput
                            label="Service Title"
                            value={newItem.title}
                            onChange={v => setNewItem(prev => ({ ...prev, title: v }))}
                        />
                        <ColorPickerInput
                            label="Theme Color"
                            value={newItem.color}
                            onChange={v => setNewItem(prev => ({ ...prev, color: v }))}
                        />

                        {/* Picker Ikon Lucide Anda */}
                        <LucideIconPicker
                            label="Icon Vector"
                            value={newItem.icon_path}
                            color={newItem.color}
                            onChange={v => setNewItem(prev => ({ ...prev, icon_path: v }))}
                        />

                        <TextInput
                            label="Order"
                            type="number"
                            value={newItem.display_order}
                            onChange={v => setNewItem(prev => ({ ...prev, display_order: Number(v) }))}
                        />
                        <div className="md:col-span-2">
                            <TextArea
                                label="Service Description"
                                value={newItem.description}
                                onChange={v => setNewItem(prev => ({ ...prev, description: v }))}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button type="button" onClick={handleSaveNewItem} disabled={!newItem.title}>Add to Stack</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </form>
    );
}