import { Link } from '@inertiajs/react';
import {
    BookOpen,
    FolderGit2,
    LayoutDashboard,
    LayoutGrid,
    Image,
    Briefcase,
    Cpu,
    GraduationCap,
    Navigation,
    Mail,
    LayoutPanelLeft,
    Users,
    ShieldCheck,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { dashboard as adminDashboard } from '@/routes/admin';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Admin Dashboard',
        href: '/admin',
        icon: LayoutDashboard,
    },
    {
        title: 'Navbar Section',
        href: '/admin/navbar',
        icon: Navigation, // Lebih tepat untuk navigasi
    },
    {
        title: 'Hero Section',
        href: '/admin/hero',
        icon: Image,
    },
    {
        title: 'Services Section',
        href: '/admin/services',
        icon: Briefcase,
    },
    {
        title: 'Projects Section',
        href: '/admin/projects',
        icon: FolderGit2,
    },
    {
        title: 'Contact Section',
        href: '/admin/contact',
        icon: Mail, // Ikon surat lebih cocok untuk kontak
    },
    {
        title: 'Footer Section',
        href: '/admin/footer',
        icon: LayoutPanelLeft, // Membedakan dengan Navbar
    },
    {
        title: 'Skills & Education',
        href: '/admin/skills-educations',
        icon: Cpu, // Bisa juga diganti 'GraduationCap'
    },
    {
        title: 'User Management',
        href: '/admin/users',
        icon: Users, // Standar untuk manajemen user
    },
    {
        title: 'Roles & Permissions',
        href: '/admin/roles',
        icon: ShieldCheck, // Ikon perisai sangat umum untuk roles/permissions
    }
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}