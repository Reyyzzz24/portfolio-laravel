import React, { FormEvent, useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Save, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TextInput, LucideIconPicker, ColorPickerInput } from '@/components/admin-form-utils'; // Pastikan ColorPickerInput diimpor
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

type ContactItem = {
    id: number | string;
    section_eyebrow?: string;
    section_title?: string;
    form_action?: string;
    submit_label?: string;
    label: string;
    value: string;
    href?: string | null;
    icon_path?: string;
    icon_color?: string; // Menambahkan properti warna
    display_order?: number;
};

export default function EditContact({ section = null, contacts = [] }: { section?: any; contacts: ContactItem[] }) {
    const { data, setData, patch, processing, recentlySuccessful  } = useForm<{ section: any; contacts: ContactItem[] }>({
        section: section ?? { section_eyebrow: '', section_title: '', form_action: '', submit_label: '' },
        contacts: contacts || [],
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newItem, setNewItem] = useState({ label: '', value: '', icon_path: '', icon_color: '#3b82f6' });

    const updateSection = (fields: Partial<typeof data.section>) => {
        setData('section', { ...data.section, ...fields });
    };

    const updateRow = (index: number, values: Partial<ContactItem>) => {
        setData('contacts', data.contacts.map((row, i) => i === index ? { ...row, ...values } : row));
    };

    const handleSaveNewItem = () => {
        const newRow: ContactItem = {
            id: `new_${Date.now()}`,
            label: newItem.label,
            value: newItem.value,
            icon_path: newItem.icon_path,
            icon_color: newItem.icon_color, // Menyimpan warna
            display_order: data.contacts.length + 1,
        };
        setData('contacts', [...data.contacts, newRow]);
        setIsModalOpen(false);
        setNewItem({ label: '', value: '', icon_path: '', icon_color: '#3b82f6' });
    };

    const removeRow = (index: number) => {
        setData('contacts', data.contacts.filter((_, i) => i !== index));
    };

    const submit = (e: FormEvent) => {
        e.preventDefault();
        patch('/admin/contact', { preserveScroll: true, forceFormData: true });
    };

    return (
        <form onSubmit={submit} className="p-6 space-y-6">
            <Head title="Edit Contact Section" />

            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Contact Section</h1>
                    <p className="text-sm text-muted-foreground">Manage contact items.</p>
                </div>
                <div className="flex items-center gap-3">
                    {recentlySuccessful && <span className="text-sm text-green-600">Saved Successfully</span>}
                    <Button onClick={submit} disabled={processing}><Save className="w-4 h-4 mr-2" /> Save Changes</Button>
                </div>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Contact Items</CardTitle>
                    <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(true)}><Plus className="mr-1 h-3.5 w-3.5" /> Add Item</Button>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 rounded-lg border border-dashed p-4 bg-muted/10">
                        <TextInput label="Section Eyebrow" value={data.section.section_eyebrow || ''} onChange={v => updateSection({ section_eyebrow: v })} />
                        <TextInput label="Section Title" value={data.section.section_title || ''} onChange={v => updateSection({ section_title: v })} />
                        <TextInput label="Form Action" value={data.section.form_action || ''} onChange={v => updateSection({ form_action: v })} />
                        <TextInput label="Submit Label" value={data.section.submit_label || ''} onChange={v => updateSection({ submit_label: v })} />
                    </div>

                    {data.contacts.map((row, index) => (
                        <div key={row.id} className="relative rounded-lg border p-4 bg-background grid grid-cols-1 gap-4 md:grid-cols-3">
                            <Button type="button" variant="ghost" size="icon" className="absolute right-2 top-2 text-destructive" onClick={() => removeRow(index)}><Trash2 className="h-4 w-4" /></Button>
                            <TextInput label="Label" value={row.label} onChange={v => updateRow(index, { label: v })} />
                            <TextInput label="Value" value={row.value} onChange={v => updateRow(index, { value: v })} />
                            <div className="grid grid-cols-2 gap-2">
                                <LucideIconPicker label="Icon" value={row.icon_path || ''} onChange={v => updateRow(index, { icon_path: v })} />
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent>
                    <DialogHeader><DialogTitle>Add New Contact Item</DialogTitle></DialogHeader>
                    <div className="space-y-4 py-4">
                        <TextInput label="Label" value={newItem.label} onChange={v => setNewItem(p => ({ ...p, label: v }))} />
                        <TextInput label="Value" value={newItem.value} onChange={v => setNewItem(p => ({ ...p, value: v }))} />
                        <div className="grid grid-cols-2 gap-4">
                            <LucideIconPicker label="Icon" value={newItem.icon_path} onChange={v => setNewItem(p => ({ ...p, icon_path: v }))} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" onClick={handleSaveNewItem}>Add to List</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </form>
    );
}