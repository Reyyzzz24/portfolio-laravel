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

export default function RoleAdmin({ roles = [] }: { roles?: any[] }) {
    const { data, setData, patch, processing, errors, recentlySuccessful } = useForm({ roles: roles || [] });
    const [open, setOpen] = useState(false);
    const [newRole, setNewRole] = useState({ name: '', display_name: '' });

    const updateRow = (index: number, values: Partial<any>) => 
        setData('roles', data.roles.map((r: any, i: number) => i === index ? { ...r, ...values } : r));
    
    const removeRow = (index: number) => 
        setData('roles', data.roles.filter((_, i: number) => i !== index));

    const addRole = () => {
        setData('roles', [...data.roles, { id: `new_${Date.now()}`, ...newRole }]);
        setNewRole({ name: '', display_name: '' });
        setOpen(false);
    };

    const submit = (e: FormEvent) => {
        e.preventDefault();
        patch('/admin/roles', { preserveScroll: true });
    };

    return (
        <>
            <Head title="Roles" />
            <form onSubmit={submit} className="p-6 space-y-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Roles</h1>
                        <p className="text-sm text-muted-foreground">Manage application roles and permissions.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {recentlySuccessful && <span className="text-sm text-green-600">Saved Successfully!</span>}
                        <Button type="submit" disabled={processing}>
                            <Save className="mr-2 h-4 w-4" /> Save Changes
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <CardTitle>Roles List</CardTitle>
                        <Button type="button" variant="outline" size="sm" onClick={() => setOpen(true)}>
                            <Plus className="mr-1 h-3.5 w-3.5" /> Add Role
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {data.roles.map((r: any, i: number) => (
                            <div key={r.id} className="relative rounded-lg border p-4 bg-muted/20 grid grid-cols-1 gap-4 md:grid-cols-3 pt-10">
                                <Button type="button" variant="ghost" size="icon" className="absolute right-2 top-2 text-destructive" onClick={() => removeRow(i)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                                <TextInput label="Name" value={r.name} onChange={(v: string) => updateRow(i, { name: v })} error={(errors as any)[`roles.${i}.name`]} />
                                <TextInput label="Display Name" value={r.display_name} onChange={(v: string) => updateRow(i, { display_name: v })} error={(errors as any)[`roles.${i}.display_name`]} />
                                <TextInput label="ID" value={r.id} disabled onChange={() => {}}/>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </form>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Role</DialogTitle>
                        <DialogDescription>Create a new role to assign to users.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-2">
                        <TextInput label="Name" value={newRole.name} onChange={(v: string) => setNewRole({ ...newRole, name: v })} />
                        <TextInput label="Display Name" value={newRole.display_name} onChange={(v: string) => setNewRole({ ...newRole, display_name: v })} />
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button onClick={addRole}>Add Role</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}