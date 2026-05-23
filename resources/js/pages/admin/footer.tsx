import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Save, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TextInput, LucideIconPicker, ColorPickerInput } from '@/components/admin-form-utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

type FooterItem = {
    id: number | string;
    copyright?: string;
    name: string;
    url: string;
    icon_path?: string;
    icon_color?: string;
    display_order?: number;
};

type FooterProps = {
    footers: FooterItem[];
};

export default function EditFooter({ footers = [] }: FooterProps) {
    const { data, setData, patch, processing, recentlySuccessful } = useForm<{ footers: FooterItem[] }>({
        footers: footers.length ? footers : [],
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newItem, setNewItem] = useState({ name: '', url: '', icon_path: 'Link', icon_color: '#3b82f6' });

    const updateCopyright = (value: string) => {
        setData('footers', data.footers.map((r, i) => i === 0 ? { ...r, copyright: value } : r));
    };

    const updateRow = (index: number, values: Partial<FooterItem>) => {
        setData('footers', data.footers.map((row, i) => i === index ? { ...row, ...values } : row));
    };

    const handleSaveNewItem = () => {
        const newRow: FooterItem = {
            id: `new_${Date.now()}`,
            copyright: data.footers[0]?.copyright ?? '',
            ...newItem,
            display_order: data.footers.length + 1,
        };
        setData('footers', [...data.footers, newRow]);
        setIsModalOpen(false);
        setNewItem({ name: '', url: '', icon_path: 'Link', icon_color: '#3b82f6' });
    };

    const removeRow = (index: number) => {
        setData('footers', data.footers.filter((_, i) => i !== index));
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        patch('/admin/footer', { preserveScroll: true, forceFormData: true });
    };

    return (
        <form onSubmit={submit} className="p-6 space-y-6">
            <Head title="Edit Footer" />

            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Footer</h1>
                    <p className="text-sm text-muted-foreground">Manage footer copyright and social links.</p>
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
                    <CardTitle>Social Links</CardTitle>
                    <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(true)}><Plus className="mr-1 h-3.5 w-3.5" /> Add Link</Button>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="rounded-lg border border-dashed p-4 bg-muted/10">
                        <TextInput label="Copyright" value={data.footers[0]?.copyright || ''} onChange={(v: string) => updateCopyright(v)} />
                    </div>

                    {data.footers.map((row, index) => (
                        <div key={row.id} className="relative rounded-lg border p-4 bg-background grid grid-cols-1 gap-4 md:grid-cols-2">
                            <Button type="button" variant="ghost" size="icon" className="absolute right-2 top-2 text-destructive" onClick={() => removeRow(index)}><Trash2 className="h-4 w-4" /></Button>
                            <TextInput label="Name" value={row.name} onChange={(v: string) => updateRow(index, { name: v })} />
                            <TextInput label="URL" value={row.url} onChange={(v: string) => updateRow(index, { url: v })} />
                            <LucideIconPicker label="Icon" value={row.icon_path || ''} onChange={(v: string) => updateRow(index, { icon_path: v })} color={row.icon_color} />
                        </div>
                    ))}
                </CardContent>
            </Card>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent>
                    <DialogHeader><DialogTitle>Add New Social Link</DialogTitle></DialogHeader>
                    <div className="space-y-4 py-4">
                        <TextInput label="Name" value={newItem.name} onChange={v => setNewItem(p => ({ ...p, name: v }))} />
                        <TextInput label="URL" value={newItem.url} onChange={v => setNewItem(p => ({ ...p, url: v }))} />
                        <div className="grid grid-cols-2 gap-4">
                            <LucideIconPicker label="Icon" value={newItem.icon_path} onChange={v => setNewItem(p => ({ ...p, icon_path: v }))} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" onClick={handleSaveNewItem}>Add to Footer</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </form>
    );
}