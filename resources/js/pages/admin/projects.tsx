import React, { FormEvent, useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Save, Plus, Trash2, X } from 'lucide-react';
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

type ProjectFormItem = {
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

type ProjectsSectionProps = {
    projects: ProjectFormItem[];
};

// State cetakan awal untuk form di dalam modal
const initialNewProject = {
    title: '',
    image: null as string | File | null,
    image_alt: '',
    tags: '',
    description: '',
    link: '',
    is_external: false,
    display_order: 1,
};

export default function ProjectsSection({ section = null, projects }: ProjectsSectionProps & { section?: any }) {
    const { data, setData, patch, transform, processing, errors, recentlySuccessful } =
        useForm<{ section: any; projects: ProjectFormItem[] }>({
            section: section ?? { section_eyebrow: '', section_title: '' },
            projects: projects || [],
        });

    // State untuk kontrol Modal Add Project
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newProject, setNewProject] = useState(initialNewProject);
    const [modalError, setModalError] = useState('');

    const updateSectionHeader = (fields: { section_eyebrow?: string; section_title?: string }) => {
        setData('section', { ...data.section, ...fields });
    };

    const updateRow = (index: number, values: Partial<ProjectFormItem>) => {
        const updatedArray = data.projects.map((row, rowIndex) =>
            rowIndex === index ? { ...row, ...values } : row
        );
        setData('projects', updatedArray);
    };

    // Fungsi pemicu saat tombol "Add Project" utama ditekan
    const handleOpenModal = () => {
        setModalError('');
        setNewProject({
            ...initialNewProject,
            display_order: data.projects.length + 1,
        });
        setIsModalOpen(true);
    };

    // Menyimpan data dari modal ke state list utama Inertia
    const handleSaveNewProject = () => {
        if (!newProject.title || !newProject.description || !newProject.link) {
            setModalError('Project Title, Link, and Description are required!');
            return;
        }

        const first = data.projects[0];
        const constructedProject: ProjectFormItem = {
            id: `new_${Date.now()}`,
            ...newProject,
        };

        setData('projects', [...data.projects, constructedProject]);
        setIsModalOpen(false);
    };

    const removeRow = (index: number) => {
        const filtered = data.projects.filter((_, i) => i !== index);
        setData('projects', filtered);
    };

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        transform((data) => ({
            ...data,
            _method: 'PATCH',
        }));

        patch('/admin/projects', {
            preserveScroll: true,
            forceFormData: true,
        });
    };

    return (
        <>
            <Head title="Manage Projects Section" />
            <form onSubmit={submit} className="p-6 space-y-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Projects Section</h1>
                        <p className="text-sm text-muted-foreground">Manage your portfolio projects showcase item.</p>
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
                        <CardTitle>Projects Collection</CardTitle>
                        <Button type="button" variant="outline" size="sm" onClick={handleOpenModal}>
                            <Plus className="mr-1 h-3.5 w-3.5" />Add Project
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Section Header Inputs */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 rounded-lg border border-dashed p-4 bg-muted/10">
                            <TextInput
                                label="Section Eyebrow"
                                value={data.section.section_eyebrow || ''}
                                onChange={(v: string) => updateSectionHeader({ section_eyebrow: v })}
                            />
                            <TextInput
                                label="Section Title"
                                value={data.section.section_title || ''}
                                onChange={(v: string) => updateSectionHeader({ section_title: v })}
                            />
                        </div>

                        {/* List of Projects */}
                        {data.projects.map((row, index) => (
                            <div key={row.id} className="relative rounded-lg border p-4 bg-background grid grid-cols-1 gap-4 md:grid-cols-2 pt-8 shadow-xs">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-2 top-2 text-destructive hover:bg-destructive/10"
                                    onClick={() => removeRow(index)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>

                                <TextInput label="Project Title" value={row.title} onChange={(v: string) => updateRow(index, { title: v })} error={errors[`projects.${index}.title`]} />
                                <TextInput label="Image Alt" value={row.image_alt} onChange={(v: string) => updateRow(index, { image_alt: v })} error={errors[`projects.${index}.image_alt`]} />
                                <TextInput label="Tags (Comma separated)" value={row.tags} onChange={(v: string) => updateRow(index, { tags: v })} error={errors[`projects.${index}.tags`]} />
                                <TextInput label="Project URL Link" value={row.link} onChange={(v: string) => updateRow(index, { link: v })} error={errors[`projects.${index}.link`]} />
                                <TextInput label="Display Order" type="number" value={row.display_order} onChange={(v: string) => updateRow(index, { display_order: Number(v) })} error={errors[`projects.${index}.display_order`]} />

                                <div className="flex items-center gap-2 pt-6">
                                    <input
                                        type="checkbox"
                                        id={`proj_ext_${index}`}
                                        checked={row.is_external}
                                        onChange={(e) => updateRow(index, { is_external: e.target.checked })}
                                        className="rounded border-gray-300 h-4 w-4 text-primary focus:ring-primary"
                                    />
                                    <label htmlFor={`proj_ext_${index}`} className="text-sm font-medium cursor-pointer">Open in New Tab (External)</label>
                                </div>

                                <div className="md:col-span-2">
                                    <ImageUploadInput label="Project Cover Image" value={row.image} onChange={(v: File | null) => updateRow(index, { image: v })} error={errors[`projects.${index}.image`]} />
                                </div>

                                <div className="md:col-span-2">
                                    <TextArea label="Description" value={row.description} onChange={(v: string) => updateRow(index, { description: v })} error={errors[`projects.${index}.description`]} />
                                </div>
                            </div>
                        ))}

                        {data.projects.length === 0 && (
                            <p className="text-center text-sm text-muted-foreground py-4">No project records found. Click "Add Project" to create one.</p>
                        )}
                    </CardContent>
                </Card>
            </form>

            {/* MODAL / DIALOG DI SINI */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Add New Project</DialogTitle>
                        <DialogDescription>
                            Fill in the details below to add a project item to the list.
                        </DialogDescription>
                    </DialogHeader>

                    {modalError && (
                        <div className="bg-destructive/15 text-destructive p-3 rounded-md text-sm font-medium">
                            {modalError}
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 py-2">
                        <TextInput
                            label="Project Title *"
                            value={newProject.title}
                            onChange={(v: string) => setNewProject({ ...newProject, title: v })}
                        />
                        <TextInput
                            label="Image Alt"
                            value={newProject.image_alt}
                            onChange={(v: string) => setNewProject({ ...newProject, image_alt: v })}
                        />
                        <TextInput
                            label="Tags (Comma separated)"
                            value={newProject.tags}
                            onChange={(v: string) => setNewProject({ ...newProject, tags: v })}
                        />
                        <TextInput
                            label="Project URL Link *"
                            value={newProject.link}
                            onChange={(v: string) => setNewProject({ ...newProject, link: v })}
                        />
                        <TextInput
                            label="Display Order"
                            type="number"
                            value={newProject.display_order}
                            onChange={(v: string) => setNewProject({ ...newProject, display_order: Number(v) })}
                        />

                        <div className="flex items-center gap-2 pt-6">
                            <input
                                type="checkbox"
                                id="modal_proj_ext"
                                checked={newProject.is_external}
                                onChange={(e) => setNewProject({ ...newProject, is_external: e.target.checked })}
                                className="rounded border-gray-300 h-4 w-4 text-primary focus:ring-primary"
                            />
                            <label htmlFor="modal_proj_ext" className="text-sm font-medium cursor-pointer">Open in New Tab (External)</label>
                        </div>

                        <div className="md:col-span-2">
                            <ImageUploadInput
                                label="Project Cover Image"
                                value={newProject.image}
                                onChange={(v: File | null) => setNewProject({ ...newProject, image: v })}
                            />
                        </div>

                        <div className="md:col-span-2">
                            <TextArea
                                label="Description *"
                                value={newProject.description}
                                onChange={(v: string) => setNewProject({ ...newProject, description: v })}
                            />
                        </div>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="button" onClick={handleSaveNewProject}>
                            Insert Item
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}