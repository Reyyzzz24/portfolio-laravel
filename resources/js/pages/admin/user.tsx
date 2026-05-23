import React, { FormEvent } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function UserAdmin({ users = [], roles = [] }: { users?: any[]; roles?: any[] }) {
    const { data, setData, patch, processing, errors, recentlySuccessful } = useForm({ 
        users: users || [] 
    });

    const updateRow = (index: number, values: Partial<any>) => 
        setData('users', data.users.map((r: any, i: number) => i === index ? { ...r, ...values } : r));

    const submit = (e: FormEvent) => {
        e.preventDefault();
        patch('/admin/users', { preserveScroll: true });
    };

    return (
        <>
            <Head title="Users" />
            <form onSubmit={submit} className="p-6 space-y-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
                        <p className="text-sm text-muted-foreground">Manage user roles and permissions.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {recentlySuccessful && <span className="text-sm text-green-600">Saved Successfully!</span>}
                        <Button type="submit" disabled={processing}>
                            <Save className="mr-2 h-4 w-4" /> Save Changes
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>User List</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {data.users.map((u: any, i: number) => (
                            <div key={u.id} className="rounded-lg border p-4 bg-muted/20 grid grid-cols-1 gap-4 md:grid-cols-4 items-center">
                                <div>
                                    <div className="font-medium">{u.name}</div>
                                    <div className="text-sm text-muted-foreground">{u.email}</div>
                                    <div className="text-xs text-muted-foreground mt-1">ID: {u.id}</div>
                                </div>
                                
                                <div className="md:col-span-3 space-y-2">
                                    <label className="text-sm font-medium">Role</label>
                                    <Select 
                                        value={u.role_id?.toString() || ''} 
                                        onValueChange={(v) => updateRow(i, { role_id: v ? Number(v) : null })}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select a role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">(none)</SelectItem>
                                            {roles.map((r: any) => (
                                                <SelectItem key={r.id} value={r.id.toString()}>
                                                    {r.display_name || r.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </form>
        </>
    );
}