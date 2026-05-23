import React, { FormEvent, useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Save, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TextInput } from '@/components/admin-form-utils';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

type NavbarItem = {
    id?: string | number;
    brand: string;
    resume_label: string;
    documents_label: string;
    item_type: 'link' | 'resume';
    label: string;
    href: string;
    display_order: number;
};

export default function NavbarAdmin({ navbars = [] }: { navbars?: NavbarItem[] }) {
    const { data, setData, patch, processing, errors, recentlySuccessful } = useForm({
        navbars: navbars || []
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const initialItem: NavbarItem = {
        brand: '', resume_label: '', documents_label: '', item_type: 'link',
        label: '', href: '', display_order: data.navbars.length + 1
    };
    const [newItem, setNewItem] = useState<NavbarItem>(initialItem);

    const updateRow = (index: number, values: Partial<NavbarItem>) =>
        setData('navbars', data.navbars.map((r, i) => i === index ? { ...r, ...values } : r));

    const removeRow = (index: number) =>
        setData('navbars', data.navbars.filter((_, i) => i !== index));

    const handleAdd = () => {
        setData('navbars', [...data.navbars, { id: `new_${Date.now()}`, ...newItem }]);
        setNewItem(initialItem);
        setIsModalOpen(false);
    };

    const submit = (e: FormEvent) => {
        e.preventDefault();
        patch('/admin/navbar', { preserveScroll: true });
    };

    return (
        <>
            <Head title="Manage Navbar" />
            <form onSubmit={submit} className="p-6 space-y-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Navbar</h1>
                        <p className="text-sm text-muted-foreground">Manage navigation items shown on the site header.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {recentlySuccessful && <span className="text-sm text-green-600">Saved Successfully</span>}
                        <Button type="submit" disabled={processing}>
                            <Save className="mr-2 h-4 w-4" /> Save Changes
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <CardTitle>Navigation Items</CardTitle>
                        <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(true)}>
                            <Plus className="mr-1 h-3.5 w-3.5" /> Add Item
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {data.navbars.map((row, index) => (
                            <div key={row.id || index} className="relative rounded-lg border p-4 bg-muted/20 grid grid-cols-1 gap-4 md:grid-cols-3 pt-10">
                                <Button type="button" variant="ghost" size="icon" className="absolute right-2 top-2 text-destructive" onClick={() => removeRow(index)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>

                                <TextInput label="Brand" value={row.brand} onChange={(v) => updateRow(index, { brand: v })} />
                                <TextInput label="Resume Label" value={row.resume_label} onChange={(v) => updateRow(index, { resume_label: v })} />
                                <TextInput label="Documents Label" value={row.documents_label} onChange={(v) => updateRow(index, { documents_label: v })} />
                                <TextInput label="Label" value={row.label} onChange={(v) => updateRow(index, { label: v })} />
                                <TextInput label="Href" value={row.href} onChange={(v) => updateRow(index, { href: v })} />
                                <TextInput label="Display Order" type="number" value={row.display_order} onChange={(v) => updateRow(index, { display_order: Number(v) })} />

                                <div className="md:col-span-3 space-y-2">
                                    <label className="text-sm font-medium">Item Type</label>
                                    <Select value={row.item_type} onValueChange={(v: 'link' | 'resume') => updateRow(index, { item_type: v })}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="link">Link</SelectItem>
                                            <SelectItem value="resume">Resume</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </form>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Navigation Item</DialogTitle>
                        <DialogDescription>Fill in the details to add a new navigation item.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-2">
                        <TextInput label="Brand" value={newItem.brand} onChange={(v) => setNewItem({ ...newItem, brand: v })} />
                        <TextInput label="Label" value={newItem.label} onChange={(v) => setNewItem({ ...newItem, label: v })} />
                        <TextInput label="Href" value={newItem.href} onChange={(v) => setNewItem({ ...newItem, href: v })} />

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Item Type</label>
                            <Select value={newItem.item_type} onValueChange={(v: 'link' | 'resume') => setNewItem({ ...newItem, item_type: v })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="link">Link</SelectItem>
                                    <SelectItem value="resume">Resume</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleAdd}>Add Item</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}