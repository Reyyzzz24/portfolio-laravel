import React, { FormEvent, useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Save, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TextInput, TextArea } from '@/components/admin-form-utils';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

type ResumeSection = {
    section_eyebrow: string;
    section_title: string;
    section_description: string;
};

type SkillItem = { id: number | string; name: string; display_order: number };

type EducationItem = {
    id: number | string;
    institution: string;
    degree: string;
    period: string;
    is_current: boolean;
    display_order: number;
};

export default function SkillsEducations({ section = null, skills = [], education = [] }: { section?: ResumeSection | null; skills?: SkillItem[]; education?: EducationItem[] }) {
    const { data, setData, patch, processing, errors, recentlySuccessful } = useForm({
        section_eyebrow: section?.section_eyebrow || '',
        section_title: section?.section_title || '',
        section_description: section?.section_description || '',
        skills: skills || [],
        education: education || [],
    });

    // Skills modal
    const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
    const [newSkillName, setNewSkillName] = useState('');
    const [newSkillOrder, setNewSkillOrder] = useState(data.skills.length + 1);

    // Education modal
    const [isEduModalOpen, setIsEduModalOpen] = useState(false);
    const initialEdu = { institution: '', degree: '', period: '', is_current: false, display_order: 1 };
    const [newEdu, setNewEdu] = useState(initialEdu);

    const updateSkillRow = (index: number, values: Partial<SkillItem>) => {
        setData('skills', data.skills.map((r, i) => i === index ? { ...r, ...values } : r));
    };

    const removeSkill = (index: number) => setData('skills', data.skills.filter((_, i) => i !== index));

    const handleAddSkill = () => {
        if (!newSkillName.trim()) return;
        setData('skills', [...data.skills, { id: `new_${Date.now()}`, name: newSkillName, display_order: Number(newSkillOrder) }]);
        setIsSkillModalOpen(false);
    };

    const updateEduRow = (index: number, values: Partial<EducationItem>) => {
        setData('education', data.education.map((r, i) => i === index ? { ...r, ...values } : r));
    };

    const removeEdu = (index: number) => setData('education', data.education.filter((_, i) => i !== index));

    const handleAddEdu = () => {
        if (!newEdu.institution || !newEdu.degree) return;
        setData('education', [...data.education, { id: `new_${Date.now()}`, ...newEdu }]);
        setIsEduModalOpen(false);
    };

    const submit = (e: FormEvent) => {
        e.preventDefault();
        patch('/admin/skills-educations', { preserveScroll: true });
    };

    return (
        <>
            <Head title="Skills & Education" />
            <form onSubmit={submit} className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">Skills & Education</h1>
                        <p className="text-sm text-muted-foreground">Manage your resume profile components.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {recentlySuccessful && <span className="text-sm text-green-600">Saved Successfully</span>}
                        <Button type="submit" disabled={processing}>
                            <Save className="mr-2 h-4 w-4" /> Save Changes
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardHeader><CardTitle>Resume Metadata</CardTitle></CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <TextInput label="Section Eyebrow" value={data.section_eyebrow} onChange={(v: string) => setData('section_eyebrow', v)} />
                        <TextInput label="Section Title" value={data.section_title} onChange={(v: string) => setData('section_title', v)} />
                        <div className="md:col-span-2">
                            <TextArea label="Section Description" value={data.section_description} onChange={(v: string) => setData('section_description', v)} />
                        </div>
                    </CardContent>
                </Card>

                {/* Grid Layout untuk Skills dan Education */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

                    {/* Skills Column */}
                    <Card className="h-full">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle>Skills</CardTitle>
                            <Button type="button" variant="outline" size="sm" onClick={() => setIsSkillModalOpen(true)}><Plus className="h-3.5 w-3.5 mr-1" /> Add</Button>
                        </CardHeader>
                        <CardContent className="space-y-3 pt-4">
                            {data.skills.map((row: SkillItem, index: number) => (
                                <div key={row.id} className="flex gap-2 items-center bg-muted/50 p-2 rounded-md border">
                                    <div className="flex-1">
                                        {/* Tambahkan label di sini */}
                                        <TextInput
                                            label="Skill Name"
                                            value={row.name}
                                            onChange={(v: string) => updateSkillRow(index, { name: v })}
                                        />
                                    </div>
                                    <div className="w-20">
                                        {/* Tambahkan label di sini */}
                                        <TextInput
                                            label="Order"
                                            type="number"
                                            value={row.display_order}
                                            onChange={(v: string) => updateSkillRow(index, { display_order: Number(v) })}
                                        />
                                    </div>
                                    <Button type="button" variant="ghost" size="icon" onClick={() => removeSkill(index)}>
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Education Column */}
                    <Card className="h-full">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle>Education</CardTitle>
                            <Button type="button" variant="outline" size="sm" onClick={() => setIsEduModalOpen(true)}><Plus className="h-3.5 w-3.5 mr-1" /> Add</Button>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-4">
                            {data.education.map((row: EducationItem, index: number) => (
                                <div key={row.id} className="relative rounded-lg border p-4 bg-background space-y-3">
                                    <Button type="button" variant="ghost" size="icon" className="absolute right-2 top-2" onClick={() => removeEdu(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                    <div className="grid grid-cols-2 gap-2">
                                        <TextInput label="Institution" value={row.institution} onChange={(v: string) => updateEduRow(index, { institution: v })} />
                                        <TextInput label="Degree" value={row.degree} onChange={(v: string) => updateEduRow(index, { degree: v })} />
                                    </div>
                                    <div className="flex gap-2 items-end">
                                        <div className="flex-1">
                                            <TextInput label="Period" value={row.period} onChange={(v: string) => updateEduRow(index, { period: v })} />
                                        </div>
                                        <div className="w-20">
                                            <TextInput label="Order" type="number" value={row.display_order} onChange={(v: string) => updateEduRow(index, { display_order: Number(v) })} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </form>

            {/* Skill Modal */}
            <Dialog open={isSkillModalOpen} onOpenChange={setIsSkillModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Skill</DialogTitle>
                        <DialogDescription>Input the technology or professional skill node name.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <TextInput label="Skill Name *" value={newSkillName} onChange={(v: string) => setNewSkillName(v)} />
                        <TextInput label="Display Order" type="number" value={newSkillOrder} onChange={(v: string) => setNewSkillOrder(Number(v))} />
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsSkillModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleAddSkill}>Insert Skill</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Education Modal */}
            <Dialog open={isEduModalOpen} onOpenChange={setIsEduModalOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Add Education Record</DialogTitle>
                        <DialogDescription>Input academic timeline history tracking.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <TextInput label="Institution *" value={newEdu.institution} onChange={(v: string) => setNewEdu({ ...newEdu, institution: v })} />
                        <TextInput label="Degree / Major *" value={newEdu.degree} onChange={(v: string) => setNewEdu({ ...newEdu, degree: v })} />
                        <TextInput label="Period (e.g., 2020 - 2024) *" value={newEdu.period} onChange={(v: string) => setNewEdu({ ...newEdu, period: v })} />
                        <TextInput label="Display Order" type="number" value={newEdu.display_order} onChange={(v: string) => setNewEdu({ ...newEdu, display_order: Number(v) })} />
                        <div className="flex items-center gap-2 pt-2">
                            <input type="checkbox" id="new_curr" checked={newEdu.is_current} onChange={(e) => setNewEdu({ ...newEdu, is_current: e.target.checked })} className="rounded border-gray-300 h-4 w-4" />
                            <label htmlFor="new_curr" className="text-sm font-medium">Still Studying Here</label>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsEduModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleAddEdu}>Insert History</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
