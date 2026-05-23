import { Head, Link } from '@inertiajs/react';
import { FileText, PanelsTopLeft, LayoutGrid, Cpu, GraduationCap, LayoutDashboard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboard as adminDashboard } from '@/routes/admin';

export default function AdminDashboard({ sectionCount, skillCount, educationCount, lastUpdated }: any) {
    return (
        <>
            <Head title="Admin Panel" />
            <div className="p-6 space-y-6">
                {/* Header Section */}
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                        <p className="text-sm text-muted-foreground">Selamat datang kembali, kelola portofolio Anda di sini.</p>
                    </div>
                    {lastUpdated && <div className="text-sm text-muted-foreground">Terakhir diperbarui: {lastUpdated}</div>}
                </div>

                {/* Metrik Statistik */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Card 1: Sections */}
                    <Card className="flex flex-col items-center justify-center p-6">
                        <div className="size-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                            <LayoutGrid className="size-8 text-slate-600" />
                        </div>
                        <CardTitle className="text-sm font-medium text-muted-foreground">Editable Sections</CardTitle>
                        <div className="text-3xl font-bold mt-1">{sectionCount}</div>
                    </Card>

                    {/* Card 2: Skills */}
                    <Card className="flex flex-col items-center justify-center p-6">
                        <div className="size-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                            <Cpu className="size-8 text-blue-600" />
                        </div>
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Skills</CardTitle>
                        <div className="text-3xl font-bold mt-1 text-blue-600">{skillCount}</div>
                    </Card>

                    {/* Card 3: Education */}
                    <Card className="flex flex-col items-center justify-center p-6">
                        <div className="size-16 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
                            <GraduationCap className="size-8 text-emerald-600" />
                        </div>
                        <CardTitle className="text-sm font-medium text-muted-foreground">Education Records</CardTitle>
                        <div className="text-3xl font-bold mt-1 text-emerald-600">{educationCount}</div>
                    </Card>
                </div>

                {/* Navigasi Cepat */}
                <h2 className="text-xl font-semibold mt-4">Quick Access</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Link href="/admin/projects">
                        <Card className="hover:bg-muted/50 transition cursor-pointer">
                            <CardHeader><CardTitle className="flex items-center gap-3 text-base"><PanelsTopLeft className="size-5" /> Project</CardTitle></CardHeader>
                        </Card>
                    </Link>
                    <Link href="/admin/skills-educations">
                        <Card className="hover:bg-muted/50 transition cursor-pointer">
                            <CardHeader><CardTitle className="flex items-center gap-3 text-base"><FileText className="size-5" /> Skills & Education</CardTitle></CardHeader>
                        </Card>
                    </Link>
                </div>
            </div>
        </>
    );
}

AdminDashboard.layout = {
    breadcrumbs: [
        {
            title: 'Admin Panel',
            href: adminDashboard(),
        },
    ],
};